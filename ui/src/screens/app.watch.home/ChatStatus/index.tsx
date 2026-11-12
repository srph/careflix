import * as React from 'react'
import { cn } from '~/utils/cn'
import UiAvatar from '~/components/UiAvatar'
import { hypeFor, latestStatusActivity, typingLabel } from './status'
import { ActivitySaid, TypingDots, activityIcon } from './ActivitySaid'

const TEXT = 'truncate'
const NAME = 'font-semibold text-white'

interface Props {
  logs: AppPartyLog[]
  // Names of friends typing right now.
  typing: string[]
  // A friend who just arrived; shown briefly with their hype line.
  joined: AppUser | null
  meId: AppId
}

/**
 * The one line above the composer: who just arrived, who's typing, or what the room last did.
 * Activity lines live here instead of in the message list, so the list is only conversation.
 */
function ChatStatus({ logs, typing, joined, meId }: Props) {
  const who = (user: AppUser) => String(user.id) === String(meId) ? 'You' : user.name
  const typer = typingLabel(typing)
  const activity = latestStatusActivity(logs)
  let key: string
  let line: React.ReactNode = null

  // An arrival is brief, so it outranks typing; otherwise a busy chat could hide it entirely.
  if (joined) {
    const [lead, kicker] = hypeFor(joined.id)
    key = `joined:${joined.id}`
    line = <>
      <UiAvatar user={joined} size="sm" className="flex-none" />
      <span className={TEXT}><b className={NAME}>{joined.name}</b> {lead} <span className="text-pink-300">{kicker}</span></span>
    </>
  } else if (typer) {
    key = `typing:${typer.subject}`
    line = <>
      <TypingDots className="gap-0.75" dot="size-1.25 bg-neutral-400" />
      <span className={TEXT}><b className={NAME}>{typer.subject}</b> {typer.verb}</span>
    </>
  } else if (activity) {
    key = `activity:${activity.id}`
    line = <>
      <i className={cn('fa flex-none text-10 leading-none', activityIcon(activity), activity.kind === 'played' && 'text-pink-500')} aria-hidden="true" />
      <span className={TEXT}><b className={NAME}>{who(activity.user)}</b> <ActivitySaid activity={activity} /></span>
    </>
  }

  return (
    // The tray's header row. Its left edge lines up with the composer's placeholder.
    <div data-testid="chat-status" className="flex h-8 items-center overflow-hidden pr-3 pl-3.75 text-xs text-neutral-400" role="status">
      {line && <div className="flex min-w-0 animate-status-in items-center gap-1.75 whitespace-nowrap motion-reduce:animate-none" key={key}>{line}</div>}
    </div>
  )
}

export default ChatStatus
