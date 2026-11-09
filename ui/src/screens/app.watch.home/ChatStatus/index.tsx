import './style.css'
import * as React from 'react'
import cx from 'classnames'
import UiAvatar from '~/components/UiAvatar'
import { hypeFor, latestStatusActivity, movieTime, seekDirection, typingLabel } from './status'

interface Props {
  logs: AppPartyLog[]
  // Names of friends typing right now.
  typing: string[]
  // A friend who just arrived; shown briefly with their hype line.
  joined: AppUser | null
  meId: AppId
}

const ICONS: Partial<Record<AppPartyActivityKind, string>> = {
  played: 'fa-play',
  paused: 'fa-pause',
  created: 'fa-star',
  switched: 'fa-film'
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
    const seconds = activity.meta?.seconds
    const at = seconds == null ? null : <span className="time">{movieTime(seconds)}</span>
    const direction = activity.kind === 'seeked' ? seekDirection(activity) : null
    const icon = activity.kind === 'seeked' ? (direction === 'back' ? 'fa-backward' : 'fa-forward') : ICONS[activity.kind]
    const said = {
      played: <>pressed play</>,
      paused: at ? <>paused at {at}</> : <>paused</>,
      seeked: at ? <>{direction === 'back' ? 'jumped back' : direction === 'ahead' ? 'skipped ahead' : 'skipped'} to {at}</> : <>skipped</>,
      created: <>started the room</>,
      switched: <>{activity.text}</>
    }[activity.kind]
    key = `activity:${activity.id}`
    line = <>
      <i className={cx('fa', icon, 'icon', { 'is-playing': activity.kind === 'played' })} aria-hidden="true" />
      <span className="text"><b>{who(activity.user)}</b> {said}</span>
    </>
  }

  return (
    <div className="watch-screen-chat-status" role="status">
      {line && <div className="line" key={key}>{line}</div>}
    </div>
  )
}

export default ChatStatus
