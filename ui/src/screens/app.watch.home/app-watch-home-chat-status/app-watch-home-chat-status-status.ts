type ActivityLog = AppPartyActivity

const STATUS_KINDS: AppPartyActivityKind[] = ['played', 'paused', 'seeked', 'switched', 'created']

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
