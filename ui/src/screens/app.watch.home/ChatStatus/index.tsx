import './style.css'
import * as React from 'react'
import cx from 'classnames'
import UiAvatar from '~/components/UiAvatar'
import { hypeFor, latestStatusActivity, typingLabel } from './status'
import { ActivitySaid, activityIcon } from './ActivitySaid'

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
      <UiAvatar user={joined} size="sm" />
      <span className="text"><b>{joined.name}</b> {lead} <span className="kicker">{kicker}</span></span>
    </>
  } else if (typer) {
    key = `typing:${typer.subject}`
    line = <>
      <span className="dots" aria-hidden="true"><i /><i /><i /></span>
      <span className="text"><b>{typer.subject}</b> {typer.verb}</span>
    </>
  } else if (activity) {
    key = `activity:${activity.id}`
    line = <>
      <i className={cx('fa', activityIcon(activity), 'icon', { 'is-playing': activity.kind === 'played' })} aria-hidden="true" />
      <span className="text"><b>{who(activity.user)}</b> <ActivitySaid activity={activity} /></span>
    </>
  }

  return (
    <div className="watch-screen-chat-status" role="status">
      {line && <div className="line" key={key}>{line}</div>}
    </div>
  )
}

export default ChatStatus
