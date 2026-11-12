import { useEffect, useMemo, useReducer, useRef } from 'react'
import { usePusher } from '~/hooks/use-pusher'
import { usePresence } from '~/hooks/use-presence'
import { useNow } from '~/hooks/use-now'
import { inOneRender } from '~/lib/query/in-one-render'
import { useParty } from '~/screens/app.watch/use-party'
import { useSetParty } from '~/screens/app.watch/queries/app-watch-party-queries'
import { addMember } from '~/screens/app.watch/app-watch-party-updates'
import {
  useCancelInviteMutation,
  useInvitationsChange,
  useInvitationsQuery,
  useMergeInvitations,
  useSendInviteMutation
} from '~/screens/app.watch/queries/app-watch-invitation-queries'

/** How long Joined, Declined or Expired shows before the row goes back to rest. */
export const ANSWER_MS = 4000

export type InviteAnswer = 'joined' | 'declined' | 'expired'

export type State = {
  /** Answers this tab saw arrive, by recipient id; each one shows for ANSWER_MS. */
  answers: Record<string, { kind: 'joined' | 'declined'; at: number }>
  busy: Record<string, boolean>
  errors: Record<string, string>
}
type Action =
  | { type: 'history'; previous: AppPartyInvitation[]; history: AppPartyInvitation[]; at: number }
  | { type: 'prune'; at: number }
  | { type: 'busy'; id: string; busy: boolean; error?: string }

// Note an answer when a waiting invite we already had turns into Joined or Declined; a new invite clears it.
export function noteAnswers(
  answers: State['answers'],
  before: AppPartyInvitation[],
  history: AppPartyInvitation[],
  at: number
) {
  const previous = new Map(before.map((invitation) => [String(invitation.recipient.id), invitation]))
  for (const invitation of history) {
    const id = String(invitation.recipient.id)
    const before = previous.get(id)
    if (!before || before === invitation) continue
    if (String(before.id) !== String(invitation.id)) {
      if (answers[id]) {
        answers = { ...answers }
        delete answers[id]
      }
    } else if (before.action === 'pending' && (invitation.action === 'accepted' || invitation.action === 'declined')) {
      answers = { ...answers, [id]: { kind: invitation.action === 'accepted' ? 'joined' : 'declined', at } }
    }
  }
  return answers
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'history':
      return { ...state, answers: noteAnswers(state.answers, action.previous, action.history, action.at) }
    case 'prune': {
      const answers = Object.fromEntries(
        Object.entries(state.answers).filter(([, answer]) => answer.at + ANSWER_MS > action.at)
      )
      return { ...state, answers }
    }
    case 'busy':
      return {
        ...state,
        busy: { ...state.busy, [action.id]: action.busy },
        errors: { ...state.errors, [action.id]: action.error || '' }
      }
  }
}

export function useHostInvitations() {
  const party = useParty()
  const setParty = useSetParty(party.id)
  const query = useInvitationsQuery(party)
  const merge = useMergeInvitations(party.id)
  const sendInvite = useSendInviteMutation(party.id)
  const cancelInvite = useCancelInviteMutation()
  const [state, dispatch] = useReducer(reducer, { answers: {}, busy: {}, errors: {} })
  // Answers come from each change to the list, and land in the same render as it.
  useInvitationsChange(party.id, (previous, history) =>
    dispatch({ type: 'history', previous, history, at: Date.now() })
  )
  const operations = useRef(new Set<string>())
  const sendingTo = useRef(new Map<string, AppUser>())
  const presence = usePresence('presence-chat')
  const now = useNow({ interval: 1000 }).getTime()
  const channel = `private-party.${party.id}`

  function refreshHistory() {
    void query.refetch()
  }

  usePusher(channel, 'pusher:subscription_succeeded', refreshHistory)
  usePusher(channel, 'invitation.sent', (event: { invitation: AppPartyInvitation }) => {
    merge([event.invitation])
  })
  usePusher(channel, 'invitation.cancelled', (event: { invitation: AppPartyInvitation }) => {
    merge([event.invitation])
  })
  usePusher(channel, 'invitation.declined', (event: { invitation: AppPartyInvitation }) => {
    merge([event.invitation])
  })
  usePusher(channel, 'invitation.accepted', (event: { invitation: AppPartyInvitation; member: AppPartyMember }) => {
    // Joined and the new member show together.
    inOneRender(() => {
      merge([event.invitation])
      setParty((current) => addMember(current, event.member))
    })
  })

  const history = useMemo(
    () => new Map(query.data.map((invitation) => [String(invitation.recipient.id), invitation])),
    [query.data]
  )
  const members = new Set(party.members.map((member) => String(member.id)))
  const pending = query.data.filter(
    (invitation) =>
      invitation.action === 'pending' &&
      Date.parse(invitation.expires_at) > now &&
      !members.has(String(invitation.recipient.id))
  )

  useEffect(() => {
    const ends = Object.values(state.answers).map((answer) => answer.at + ANSWER_MS)
    if (!ends.length) return
    const timer = setTimeout(
      () => dispatch({ type: 'prune', at: Date.now() }),
      Math.max(0, Math.min(...ends) - Date.now())
    )
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
  const answered = query.data.filter((invitation) => {
    const given = answer(String(invitation.recipient.id))
    return given === 'declined' || given === 'expired'
  })
  const pendingIds = new Set(pending.map((invitation) => String(invitation.recipient.id)))
  const sending = Array.from(sendingTo.current.values()).filter(
    (user) => state.busy[String(user.id)] && !pendingIds.has(String(user.id))
  )

  async function invite(user: AppUser) {
    const id = String(user.id)
    if (
      operations.current.has(id) ||
      members.has(id) ||
      pending.some((invitation) => String(invitation.recipient.id) === id)
    )
      return
    operations.current.add(id)
    sendingTo.current.set(id, user)
    dispatch({ type: 'busy', id, busy: true })
    const saved = await sendInvite.mutateAsync(user).catch(() => null)
    operations.current.delete(id)
    // The row leaves Sending in the same render its invite shows up.
    const settle = () => {
      sendingTo.current.delete(id)
      dispatch({ type: 'busy', id, busy: false, error: saved ? '' : 'Couldn’t send' })
    }
    if (saved) inOneRender(() => merge([saved]), settle)
    else settle()
  }

  async function cancel(invitation: AppPartyInvitation) {
    const id = String(invitation.recipient.id)
    if (operations.current.has(id)) return
    operations.current.add(id)
    dispatch({ type: 'busy', id, busy: true })
    const saved = await cancelInvite.mutateAsync(invitation).catch(() => null)
    operations.current.delete(id)
    if (!saved) {
      dispatch({ type: 'busy', id, busy: false, error: 'Couldn’t undo' })
      refreshHistory()
      return
    }
    inOneRender(
      () => merge([saved]),
      () => dispatch({ type: 'busy', id, busy: false, error: '' })
    )
  }

  return {
    ...state,
    historyError: query.isError,
    now,
    pending,
    answered,
    sending,
    history,
    answer,
    invite,
    cancel,
    refreshHistory,
    withPresence: (user: AppUser) => (presence ? { ...user, is_online: presence.has(String(user.id)) } : user)
  }
}

export type HostInvitations = ReturnType<typeof useHostInvitations>

/** Whole minutes left on an invite, rounded up and never below 1m, e.g. "30m". */
export function minutesLeft(invitation: AppPartyInvitation, now: number) {
  const seconds = Math.min(invitation.duration || 1800, Math.max(0, (Date.parse(invitation.expires_at) - now) / 1000))
  return `${Math.max(1, Math.ceil(seconds / 60))}m`
}
