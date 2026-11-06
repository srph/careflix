import { useEffect, useMemo, useReducer, useRef } from 'react'
import axios from '~/lib/axios'
import { usePusher } from '~/hooks/usePusher'
import usePresence from '~/hooks/usePresence'
import { useNow } from '~/hooks/useNow'
import { usePartyContext } from '~/screens/app.watch/Context'

type State = {
  history: AppPartyInvitation[]
  users: AppUser[]
  query: string
  loading: boolean
  searchError: boolean
  historyError: boolean
  busy: Record<string, boolean>
  errors: Record<string, string>
}
type Action =
  | { type: 'history'; invitations: AppPartyInvitation[] }
  | { type: 'history-error'; failed: boolean }
  | { type: 'query'; query: string }
  | { type: 'loading' }
  | { type: 'results'; users: AppUser[]; failed: boolean }
  | { type: 'busy'; id: string; busy: boolean; error?: string }

// A late search/snapshot/event must never undo a newer invitation or its answer.
function mergeHistory(current: AppPartyInvitation[], incoming: AppPartyInvitation[]) {
  const byPerson = new Map(current.map(invitation => [String(invitation.recipient.id), invitation]))
  for (const invitation of incoming) {
    const id = String(invitation.recipient.id)
    const previous = byPerson.get(id)
    if (!previous || Number(invitation.id) > Number(previous.id) ||
      (String(invitation.id) === String(previous.id) &&
        (previous.action === 'pending' || invitation.action !== 'pending'))) byPerson.set(id, invitation)
  }
  return Array.from(byPerson.values())
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'history': return { ...state, history: mergeHistory(state.history, action.invitations) }
    case 'history-error': return { ...state, historyError: action.failed }
    case 'query': return { ...state, query: action.query, users: [], loading: true, searchError: false }
    case 'loading': return { ...state, loading: true, searchError: false }
    case 'results': return { ...state, users: action.users, loading: false, searchError: action.failed }
    case 'busy': return {
      ...state,
      busy: { ...state.busy, [action.id]: action.busy },
      errors: { ...state.errors, [action.id]: action.error || '' }
    }
  }
}

export default function useHostInvitations(isOpen: boolean) {
  const context = usePartyContext()
  const [state, dispatch] = useReducer(reducer, {
    history: context.party.invitations || [], users: [], query: '', loading: true,
    searchError: false, historyError: false, busy: {}, errors: {}
  })
  const [attempt, retrySearch] = useReducer(value => value + 1, 0)
  const operations = useRef(new Set<string>())
  const presence = usePresence('presence-chat')
  const now = useNow({ interval: 1000 }).getTime()
  const channel = `private-party.${context.party.id}`

  async function refreshHistory() {
    const [error, response] = await axios.get(`/api/parties/${context.party.id}/invitations`)
    const failed = Boolean(error) || !Array.isArray(response?.data)
    dispatch({ type: 'history-error', failed })
    if (!failed) dispatch({ type: 'history', invitations: response.data })
  }
  useEffect(() => { refreshHistory() }, [context.party.id])
  useEffect(() => {
    dispatch({ type: 'history', invitations: context.party.invitations || [] })
  }, [context.party.invitations])

  useEffect(() => {
    if (!isOpen) return
    let active = true
    dispatch({ type: 'loading' })
    const timer = setTimeout(async () => {
      const [error, response] = await axios.get(`/api/parties/${context.party.id}/invitations/search`, {
        params: state.query.trim() ? { search: state.query.trim() } : {}
      })
      const failed = Boolean(error) || !Array.isArray(response?.data)
      if (active) dispatch({ type: 'results', users: failed ? [] : response.data, failed })
    }, state.query.trim() ? 250 : 0)
    return () => { active = false; clearTimeout(timer) }
  }, [context.party.id, isOpen, state.query, attempt])

  usePusher(channel, 'pusher:subscription_succeeded', refreshHistory)
  usePusher(channel, 'invitation.sent', (event: { invitation: AppPartyInvitation }) => {
    dispatch({ type: 'history', invitations: [event.invitation] })
    context.onInvite(event.invitation)
  })
  usePusher(channel, 'invitation.cancelled', (event: { invitation: AppPartyInvitation }) => {
    dispatch({ type: 'history', invitations: [event.invitation] })
    context.onCancel(event.invitation)
  })
  usePusher(channel, 'invitation.declined', (event: { invitation: AppPartyInvitation }) => {
    dispatch({ type: 'history', invitations: [event.invitation] })
    context.onDecline(event.invitation)
  })
  usePusher(channel, 'invitation.accepted', (event: { invitation: AppPartyInvitation; member: AppPartyMember }) => {
    dispatch({ type: 'history', invitations: [event.invitation] })
    context.onAccept(event.invitation, event.member)
  })

  const history = useMemo(() => new Map(state.history.map(invitation => [String(invitation.recipient.id), invitation])), [state.history])
  const members = new Set(context.party.members.map(member => String(member.id)))
  const pending = state.history.filter(invitation => invitation.action === 'pending' &&
    Date.parse(invitation.expires_at) > now && !members.has(String(invitation.recipient.id)))
  const outcomes = state.history.filter(invitation => !members.has(String(invitation.recipient.id)) &&
    (invitation.action === 'declined' || (invitation.action === 'pending' && Date.parse(invitation.expires_at) <= now)))

  async function invite(user: AppUser) {
    const id = String(user.id)
    if (operations.current.has(id) || members.has(id) || pending.some(invitation => String(invitation.recipient.id) === id)) return
    operations.current.add(id)
    dispatch({ type: 'busy', id, busy: true })
    const [error, response] = await axios.post(`/api/parties/${context.party.id}/invitations/send`, { recipient_id: user.id })
    operations.current.delete(id)
    dispatch({ type: 'busy', id, busy: false, error: error ? 'Couldn’t send. Try again.' : '' })
    if (!error) {
      dispatch({ type: 'history', invitations: [response.data] })
      context.onInvite(response.data)
    }
  }

  async function cancel(invitation: AppPartyInvitation) {
    const id = String(invitation.recipient.id)
    if (operations.current.has(id)) return
    operations.current.add(id)
    dispatch({ type: 'busy', id, busy: true })
    const [error, response] = await axios.post(`/api/invitations/${invitation.id}/cancel`)
    operations.current.delete(id)
    dispatch({ type: 'busy', id, busy: false, error: error ? 'Couldn’t cancel. Try again.' : '' })
    if (error) { refreshHistory(); return }
    dispatch({ type: 'history', invitations: [response.data] })
    context.onCancel(response.data)
  }

  return {
    ...state, now, pending, outcomes, history, invite, cancel, refreshHistory, retrySearch,
    setQuery: (query: string) => dispatch({ type: 'query', query: query.slice(0, 100) }),
    withPresence: (user: AppUser) => presence ? { ...user, is_online: presence.has(String(user.id)) } : user
  }
}

export type HostInvitations = ReturnType<typeof useHostInvitations>

export function remainingTime(invitation: AppPartyInvitation, now: number) {
  const seconds = Math.min(invitation.duration || 1800, Math.max(0, Math.ceil((Date.parse(invitation.expires_at) - now) / 1000)))
  return seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`
}
