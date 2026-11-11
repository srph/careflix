import useLocalStorageState from '~/hooks/useLocalStorageState'

/**
 * What the picture shows from the room while chat is closed:
 * everything, just joins and pauses, or nothing. Chosen from the bell in the player controls.
 */
export const ACTIVITY_LEVELS = ['all', 'activity', 'off'] as const

export type ActivityLevel = typeof ACTIVITY_LEVELS[number]

export const ACTIVITY_COPY: Record<ActivityLevel, { label: string, description: string, toast: string, icon: string }> = {
  all: { label: 'Everything', description: 'Messages, reactions, joins and pauses.', toast: 'Showing everything', icon: 'fa-bell' },
  activity: { label: 'Just joins and pauses', description: 'Who came in and who paused. No messages or reactions.', toast: 'Showing joins and pauses only', icon: 'fa-bell-o' },
  off: { label: 'Off', description: 'Nothing on the picture while chat is closed.', toast: 'Activity off', icon: 'fa-bell-slash' }
}

export const isActivityLevel =(value: unknown): value is ActivityLevel => ACTIVITY_LEVELS.includes(value as ActivityLevel)

// "Just joins and pauses"
const KEY_KINDS: AppPartyActivityKind[] = ['joined', 'joined_code', 'paused']
// "Everything" adds the rest of what the room does. Starting the room is old news by the time anyone sees it.
const ALL_KINDS: AppPartyActivityKind[] = [...KEY_KINDS, 'played', 'seeked', 'switched']

export function logUser(log: AppPartyLog): AppUser | null {
  return (log.type === 'message' ? log.message?.user : log.activity?.user) ?? null
}

/**
 * Whether a log that just came in belongs on the picture at this level. Your own never do.
 */
export function showsOnOverlay(log: AppPartyLog, level: ActivityLevel, meId: AppId): boolean {
  if (level === 'off') return false
  const user = logUser(log)
  if (!user || String(user.id) === String(meId)) return false
  if (log.type === 'message') return level === 'all' && Boolean(log.message?.text)
  const kind = log.activity?.kind
  if (!kind) return false
  return (level === 'all' ? ALL_KINDS : KEY_KINDS).includes(kind)
}

/**
 * Other people's reaction floats, which only the sidebar can send.
 * With the sidebar open you always see them; with it closed, only at "Everything".
 */
export function showsReactions(level: ActivityLevel, isChatOpen: boolean): boolean {
  return isChatOpen || level === 'all'
}

/**
 * The level, remembered per account on this device.
 */
export function useActivityLevel(userId: AppId) {
  return useLocalStorageState<ActivityLevel>(`care.activity-overlay.${userId}`, 'all', isActivityLevel)
}
