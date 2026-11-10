import { useEffect, useMemo, useReducer, useRef } from 'react'
import axios from '~/lib/axios'
import { usePusher } from '~/hooks/usePusher'
import usePresence from '~/hooks/usePresence'
import { useNow } from '~/hooks/useNow'
import { usePartyContext } from '~/screens/app.watch/Context'

/** How long Joined, Declined or Expired shows before the row goes back to rest. */
export const ANSWER_MS = 4000

export type InviteAnswer = 'joined' | 'declined' | 'expired'

export type State = {
  history: AppPartyInvitation[]
  /** Answers this tab saw arrive, by recipient id; each one shows for ANSWER_MS. */
  answers: Record<string, { kind: 'joined' | 'declined'; at: number }>
  historyError: boolean
  busy: Record<string, boolean>
  errors: Record<string, string>
}
type Action =
  | { type: 'history'; invitations: AppPartyInvitation[]; at: number }
  | { type: 'prune'; at: number }
  | { type: 'history-error'; failed: boolean }
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

// Note an answer when a waiting invite we already had turns into Joined or Declined; a new invite clears it.
function noteAnswers(state: State, history: AppPartyInvitation[], at: number) {
  const previous = new Map(state.history.map(invitation => [String(invitation.recipient.id), invitation]))
  let answers = state.answers
  for (const invitation of history) {
    const id = String(invitation.recipient.id)
    const before = previous.get(id)
    if (!before || before === invitation) continue
    if (String(before.id) !== String(invitation.id)) {
      if (answers[id]) { answers = { ...answers }; delete answers[id] }
    } else if (before.action === 'pending' && (invitation.action === 'accepted' || invitation.action === 'declined')) {
      answers = { ...answers, [id]: { kind: invitation.action === 'accepted' ? 'joined' : 'declined', at } }
    }
  }
  return answers
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'history': {
      const history = mergeHistory(state.history, action.invitations)
      return { ...state, history, answers: noteAnswers(state, history, action.at) }
    }
    case 'prune': {
      const answers = Object.fromEntries(Object.entries(state.answers).filter(([, answer]) => answer.at + ANSWER_MS > action.at))
      return { ...state, answers }
    }
    case 'history-error': return { ...state, historyError: action.failed }
    case 'busy': return {
      ...state,
      busy: { ...state.busy, [action.id]: action.busy },
      errors: { ...state.errors, [action.id]: action.error || '' }
    }
  }
}

export default function useHostInvitations() {
  const context = usePartyContext()
  const [state, dispatch] = useReducer(reducer, {
    history: context.party.invitations || [], answers: {}, historyError: false, busy: {}, errors: {}
  })
  const operations = useRef(new Set<string>())
  const sendingTo = useRef(new Map<string, AppUser>())
  const presence = usePresence('presence-chat')
  const now = useNow({ interval: 1000 }).getTime()
  const channel = `private-party.${context.party.id}`

  async function refreshHistory() {
    const [error, response] = await axios.get(`/api/parties/${context.party.id}/invitations`)
    const failed = Boolean(error) || !Array.isArray(response?.data)
    dispatch({ type: 'history-error', failed })
    if (!failed) dispatch({ type: 'history', at: Date.now(), invitations: response.data })
  }
  useEffect(() => { refreshHistory() }, [context.party.id])
  useEffect(() => {
    dispatch({ type: 'history', at: Date.now(), invitations: context.party.invitations || [] })
  }, [context.party.invitations])

  usePusher(channel, 'pusher:subscription_succeeded', refreshHistory)
  usePusher(channel, 'invitation.sent', (event: { invitation: AppPartyInvitation }) => {
    dispatch({ type: 'history', at: Date.now(), invitations: [event.invitation] })
    context.onInvite(event.invitation)
  })
  usePusher(channel, 'invitation.cancelled', (event: { invitation: AppPartyInvitation }) => {
    dispatch({ type: 'history', at: Date.now(), invitations: [event.invitation] })
    context.onCancel(event.invitation)
  })
  usePusher(channel, 'invitation.declined', (event: { invitation: AppPartyInvitation }) => {
    dispatch({ type: 'history', at: Date.now(), invitations: [event.invitation] })
    context.onDecline(event.invitation)
  })
  usePusher(channel, 'invitation.accepted', (event: { invitation: AppPartyInvitation; member: AppPartyMember }) => {
    dispatch({ type: 'history', at: Date.now(), invitations: [event.invitation] })
    context.onAccept(event.invitation, event.member)
  })

  const history = useMemo(() => new Map(state.history.map(invitation => [String(invitation.recipient.id), invitation])), [state.history])
  const members = new Set(context.party.members.map(member => String(member.id)))
  const pending = state.history.filter(invitation => invitation.action === 'pending' &&
    Date.parse(invitation.expires_at) > now && !members.has(String(invitation.recipient.id)))

  useEffect(() => {
    const ends = Object.values(state.answers).map(answer => answer.at + ANSWER_MS)
    if (!ends.length) return
    const timer = setTimeout(() => dispatch({ type: 'prune', at: Date.now() }), Math.max(0, Math.min(...ends) - Date.now()))
    return () => clearTimeout(timer)
  }, [state.answers])

  /** Joined, Declined or Expired while it's fresh; an expiry counts from expires_at, so an old one never shows. */
  function answer(id: string): InviteAnswer | null {
    if (state.answers[id]) return state.answers[id].kind
    const invitation = history.get(id)
    if (invitation?.action !== 'pending' || members.has(id)) return null
    const end = Date.parse(invitation.expires_at)
    return end <= now && now - end < ANSWER_MS ? 'expired' : null
  }
  // Fresh Declined and Expired answers, for the chat strip.
  const answered = state.history.filter(invitation => ['declined', 'expired'].includes(answer(String(invitation.recipient.id))))
  const pendingIds = new Set(pending.map(invitation => String(invitation.recipient.id)))
  const sending = Array.from(sendingTo.current.values()).filter(user => state.busy[String(user.id)] && !pendingIds.has(String(user.id)))

  async function invite(user: AppUser) {
    const id = String(user.id)
    if (operations.current.has(id) || members.has(id) || pending.some(invitation => String(invitation.recipient.id) === id)) return
    operations.current.add(id)
    sendingTo.current.set(id, user)
    dispatch({ type: 'busy', id, busy: true })
    const [error, response] = await axios.post(`/api/parties/${context.party.id}/invitations/send`, { recipient_id: user.id })
    operations.current.delete(id)
    sendingTo.current.delete(id)
    dispatch({ type: 'busy', id, busy: false, error: error ? 'Couldn’t send' : '' })
    if (!error) {
      dispatch({ type: 'history', at: Date.now(), invitations: [response.data] })
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
    dispatch({ type: 'busy', id, busy: false, error: error ? 'Couldn’t undo' : '' })
    if (error) { refreshHistory(); return }
    dispatch({ type: 'history', at: Date.now(), invitations: [response.data] })
    context.onCancel(response.data)
  }

  return {
    ...state, now, pending, answered, sending, history, answer, invite, cancel, refreshHistory,
    withPresence: (user: AppUser) => presence ? { ...user, is_online: presence.has(String(user.id)) } : user
  }
}

export type HostInvitations = ReturnType<typeof useHostInvitations>

/** Whole minutes left on an invite, rounded up and never below 1m, e.g. "30m". */
export function minutesLeft(invitation: AppPartyInvitation, now: number) {
  const seconds = Math.min(invitation.duration || 1800, Math.max(0, (Date.parse(invitation.expires_at) - now) / 1000))
  return `${Math.max(1, Math.ceil(seconds / 60))}m`
}
