import * as React from 'react'
import { cn } from '~/utils/cn'
import { movieTime, seekDirection } from './app-watch-home-chat-status-status'

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
 * Three dots that bob in turn while someone types. `dot` sizes and colours each one.
 */
export function TypingDots({ className, dot }: { className?: string; dot: string }) {
  return <span className={cn('inline-flex flex-none', className)} aria-hidden="true">
    {[0, 0.15, 0.3].map(delay => <i key={delay} className={cn('animate-typing-dot rounded-full motion-reduce:animate-none', dot)} style={{ animationDelay: `${delay}s` }} />)}
  </span>
}

/**
 * What someone did to the room, after their name: "paused at 41:12", "skipped ahead to 1:02:15".
 */
export function AppWatchHomeChatStatusActivitySaid({ activity }: { activity: Activity }) {
  const seconds = activity.meta?.seconds
  const at = seconds == null ? null : <span className="tabular-nums">{movieTime(seconds)}</span>
  const direction = activity.kind === 'seeked' ? seekDirection(activity) : null
  switch (activity.kind) {
    case 'played': return <>pressed play</>
    case 'paused': return at ? <>paused at {at}</> : <>paused</>
    case 'seeked': return at ? <>{direction === 'back' ? 'jumped back' : direction === 'ahead' ? 'skipped ahead' : 'skipped'} to {at}</> : <>skipped</>
    case 'created': return <>started the room</>
    default: return <>{activity.text}</>
  }
}
