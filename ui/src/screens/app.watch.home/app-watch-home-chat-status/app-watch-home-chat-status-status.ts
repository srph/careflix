type ActivityLog = AppPartyActivity

const STATUS_KINDS: AppPartyActivityKind[] = ['played', 'paused', 'seeked', 'switched', 'created']

// One line per friend so the same person always arrives the same way.
const HYPE: [string, string][] = [
  ['just joined.', 'Let’s fucking go.'],
  ['is here.', 'Let’s do this.'],
  ['is here.', 'Time to run it down.'],
  ['is here.', 'Game on.'],
  ['is here.', 'We are so back.']
]

/**
 * Movie time as the player shows it: 41:12, 1:02:15.
 */
export function movieTime(seconds: number): string {
  const total = Math.max(0, Math.round(seconds || 0))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = String(total % 60).padStart(2, '0')
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`
}

/**
 * The activity the status row describes when nobody is typing or arriving:
 * the latest playback change, falling back to the latest video switch or the room's creation.
 */
export function latestStatusActivity(logs: AppPartyLog[]): ActivityLog | null {
  for (let i = logs.length - 1; i >= 0; i--) {
    const activity = logs[i].type === 'activity' ? logs[i].activity : null
    if (activity && activity.kind != null && STATUS_KINDS.includes(activity.kind)) return activity
  }
  return null
}

export function isJoinActivity(activity: ActivityLog | null | undefined): boolean {
  return activity?.kind === 'joined' || activity?.kind === 'joined_code'
}

export function seekDirection(activity: ActivityLog): 'back' | 'ahead' | null {
  const from = activity.meta?.from_seconds
  const to = activity.meta?.seconds
  if (from == null || to == null || from === to) return null
  return to < from ? 'back' : 'ahead'
}

export function hypeFor(userId: AppId): [string, string] {
  const key = String(userId)
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0
  return HYPE[Math.abs(hash) % HYPE.length]
}

export function typingLabel(names: string[]): { subject: string, verb: string } | null {
  if (!names.length) return null
  if (names.length === 1) return { subject: names[0], verb: 'is typing' }
  if (names.length === 2) return { subject: `${names[0]} and ${names[1]}`, verb: 'are typing' }
  return { subject: `${names.length} people`, verb: 'are typing' }
}
