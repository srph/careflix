import authorImg from './assets/author.jpg'

export interface User {
  id: number
  name: string
  avatar?: string
  /** Deterministic fallback background for initials-only avatars */
  color?: string
  isOnline?: boolean
}

export interface MessageLog {
  type: 'message'
  user: User
  texts: string[]
}

export interface ActivityLog {
  type: 'activity'
  user: User
  text: string
}

export type Log = MessageLog | ActivityLog

// The signed-in user (rendered without a presence dot, ember bubbles on the right).
export const self: User = {
  id: 1,
  name: 'Kier Borromeo',
  avatar: authorImg,
  isOnline: true
}

// Warm pastels — chosen to glow against the candlelit near-black.
export const marie: User = { id: 2, name: 'Marie Cruz', color: '#c084fc', isOnline: true }
export const jorenz: User = { id: 3, name: 'Jorenz Dela', color: '#f5c04a', isOnline: true }
export const paula: User = { id: 4, name: 'Paula Reyes', color: '#6ee7b7', isOnline: false }
export const aximil: User = { id: 5, name: 'Axel Mirandez', color: '#7dd3fc', isOnline: false }
export const nina: User = { id: 6, name: 'Nina Torres', color: '#fb7185', isOnline: false }
export const ramon: User = { id: 7, name: 'Ramon Silva', color: '#fdba74', isOnline: false }

// Members shown as presence avatars in the sidebar canopy.
export const members: User[] = [self, marie, jorenz, paula, aximil, nina, ramon]

// The chat transcript, already grouped the way the app groups succeeding logs.
export const logs: Log[] = [
  { type: 'activity', user: marie, text: 'joined the party' },
  {
    type: 'message',
    user: marie,
    texts: ['omg the intro still hits every time 😭', "ok i'm ready — play it"]
  },
  {
    type: 'message',
    user: self,
    texts: ['hah knew you would say that', 'hitting play in 3… 2…']
  },
  { type: 'activity', user: jorenz, text: 'joined the party' },
  {
    type: 'message',
    user: jorenz,
    texts: ['wait let me grab snacks real quick']
  },
  {
    type: 'message',
    user: marie,
    texts: ['no we are NOT waiting for your snacks jorenz 💀']
  },
  {
    type: 'message',
    user: self,
    texts: ['😂😂']
  }
]

export const show = {
  title: 'The Bear',
  info: 'S2 · E7 · Forks',
  elapsed: '21:04',
  duration: '48:32',
  progress: 34
}

export const quickReactions = ['❤️', '😂', '🔥', '👏', '😭']
