import type { InviteAnswer } from './use-host-invitations'

export type InviteRowInput = {
  name: string
  online: boolean
  /** Already in the room. */
  member: boolean
  /** Started the room. */
  host?: boolean
  /** Has an invite still waiting on an answer. */
  waiting: boolean
  /** A send or undo is in flight. */
  busy: boolean
  /** The last send or undo failed with this message. */
  error: string
  answer: InviteAnswer | null
  /** Time left on the waiting invite, e.g. "30m". */
  minutes: string
}

export type InviteRow = {
  status: string
  tone: '' | 'pink' | 'error' | 'success'
  /** The button's job; null hides it. */
  action: 'invite' | 'undo' | 'retry' | null
  busy: boolean
  label: string
}

/** What one person's row says and offers in the host's invite panel. */
export function inviteRow({ name, online, member, host, waiting, busy, error, answer, minutes }: InviteRowInput): InviteRow {
  const presence = online ? 'Online' : 'Offline'
  if (member) return answer === 'joined'
    ? { status: 'Joined', tone: 'success', action: null, busy: false, label: `${name} joined` }
    : host ? { status: 'Host 👑', tone: '', action: null, busy: false, label: `${name}, host, in the room` }
    : { status: 'In the room', tone: '', action: null, busy: false, label: `${name}, in the room` }
  if (waiting) return {
    status: !busy && error ? error : `Invited (${minutes})`, tone: !busy && error ? 'error' : 'pink',
    action: 'undo', busy, label: busy ? `Undoing invite to ${name}` : `Undo invite to ${name}`
  }
  if (busy) return { status: presence, tone: '', action: 'invite', busy, label: `Sending invite to ${name}` }
  if (error) return { status: error, tone: 'error', action: 'retry', busy, label: `Retry invite to ${name}` }
  return {
    status: answer === 'declined' ? 'Declined' : answer === 'expired' ? 'Expired' : presence, tone: '',
    action: 'invite', busy, label: `Invite ${name}`
  }
}
