import { parse } from 'date-fns-v1'

export function invitationStatus(invitation: AppPartyInvitation, now: Date) {
  if (invitation.action === 'cancelled') return 'withdrawn'
  if (parse(invitation.expires_at).getTime() <= now.getTime()) return 'expired'
  return invitation.action === 'pending' ? 'pending' : 'answered'
}

export interface State {
  action: 'accept' | null
  joined: AppPartyInvitation | null
  declined: AppPartyInvitation | null
  // Held while a dismissed toast fades out, so it keeps its content.
  dismissed: AppPartyInvitation | null
  phase: 'respond' | 'joining' | 'docked' | 'declined' | 'leaving'
  error: string | null
  answered: number
}

export const initialState: State = {
  action: null,
  joined: null,
  declined: null,
  dismissed: null,
  phase: 'respond',
  error: null,
  answered: 0
}

type Action =
  | { type: 'request' }
  | { type: 'error'; message: string }
  | { type: 'advance' }
  | { type: 'joined'; invitation: AppPartyInvitation }
  | { type: 'declined'; invitation: AppPartyInvitation }
  | { type: 'dismissed'; invitation: AppPartyInvitation }
  | { type: 'docked' }
  | { type: 'leave' }
  | { type: 'reset' }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'request':
      return { ...state, action: 'accept', error: null }
    case 'error':
      return { ...state, action: null, error: action.message }
    case 'advance':
      return { ...state, action: null, error: null, answered: state.answered + 1 }
    case 'joined':
      return { ...state, action: null, phase: 'joining', joined: action.invitation }
    case 'declined':
      return { ...state, action: null, phase: 'declined', declined: action.invitation }
    case 'dismissed':
      return { ...state, dismissed: action.invitation }
    case 'docked':
      return state.phase === 'joining' ? { ...state, phase: 'docked' } : state
    case 'leave':
      return { ...state, phase: 'leaving' }
    case 'reset':
      return initialState
  }
}
