import * as React from 'react'
import { movieTime, seekDirection } from './status'

type Activity = AppPartyLog['activity']

const ICONS: Partial<Record<AppPartyActivityKind, string>> = {
  played: 'fa-play',
  paused: 'fa-pause',
  created: 'fa-star',
  switched: 'fa-film'
}

/**
 * The icon beside a playback line, e.g. pause for "paused at 41:12".
 */
export function activityIcon(activity: Activity): string | undefined {
  if (activity.kind === 'seeked') return seekDirection(activity) === 'back' ? 'fa-backward' : 'fa-forward'
  return ICONS[activity.kind]
}

/**
 * What someone did to the room, after their name: "paused at 41:12", "skipped ahead to 1:02:15".
 */
export function ActivitySaid({ activity }: { activity: Activity }) {
  const seconds = activity.meta?.seconds
  const at = seconds == null ? null : <span className="time">{movieTime(seconds)}</span>
  const direction = activity.kind === 'seeked' ? seekDirection(activity) : null
  switch (activity.kind) {
    case 'played': return <>pressed play</>
    case 'paused': return at ? <>paused at {at}</> : <>paused</>
    case 'seeked': return at ? <>{direction === 'back' ? 'jumped back' : direction === 'ahead' ? 'skipped ahead' : 'skipped'} to {at}</> : <>skipped</>
    case 'created': return <>started the room</>
    default: return <>{activity.text}</>
  }
}
