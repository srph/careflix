import { parse } from 'date-fns-v1'

export function invitationStatus(invitation: AppPartyInvitation, now: Date) {
  if (invitation.action === 'cancelled') return 'withdrawn'
  if (parse(invitation.expires_at).getTime() <= now.getTime()) return 'expired'
  return invitation.action === 'pending' ? 'pending' : 'answered'
}

export interface State {
  action: 'accept' | 'decline' | null
  joined: AppPartyInvitation | null
  phase: 'respond' | 'joining' | 'docked'
  error: string | null
  answered: number
}

export const initialState: State = { action: null, joined: null, phase: 'respond', error: null, answered: 0 }

type Action =
  | { type: 'request'; action: 'accept' | 'decline' }
  | { type: 'error'; message: string }
  | { type: 'advance' }
  | { type: 'joined'; invitation: AppPartyInvitation }
  | { type: 'docked' }
  | { type: 'reset' }

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'request': return { ...state, action: action.action, error: null }
    case 'error': return { ...state, action: null, error: action.message }
    case 'advance': return { ...state, action: null, error: null, answered: state.answered + 1 }
    case 'joined': return { ...state, action: null, phase: 'joining', joined: action.invitation }
    case 'docked': return { ...state, phase: 'docked' }
    case 'reset': return initialState
  }
}
