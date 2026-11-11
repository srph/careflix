import './style.css'

import * as React from 'react'
import { useEffect, useState } from 'react'
import cx from 'classnames'
import { AnimatePresence, motion } from 'motion/react'
import UiAvatar from '~/components/UiAvatar'
import usePusher from '~/hooks/usePusher'
import usePropRef from '~/hooks/usePropRef'
import useTransientState from '~/hooks/useTransientState'
import useUpdateEffect from '~/hooks/useUpdateEffect'
import { easeOutSoft } from '~/utils/motion'
import useTypingStatus from '../ChatWidget/useTypingStatus'
import { hypeFor, isJoinActivity, typingLabel } from '../ChatStatus/status'
import { ActivitySaid, activityIcon } from '../ChatStatus/ActivitySaid'
import { ACTIVITY_COPY, type ActivityLevel, showsOnOverlay } from '../activityLevel'

interface Props {
  party: AppParty
  me: AppUser
  level: ActivityLevel
  isChatOpen: boolean
  // The player controls are up, so lines sit above the seek bar.
  isLifted: boolean
  onOpenChat: () => void
}

interface Line {
  id: string
  log: AppPartyLog
  until: number
}

// Each line stays this long, then fades.
export const LINE_MS = 8000
// Older lines make way once a burst fills the corner.
export const MAX_LINES = 4
const TOAST_MS = 2200

/**
 * The room over the bottom-left of the picture while chat is closed: new messages, joins and
 * playback, and who's typing, filtered by the level chosen from the bell. Clicking a line opens chat.
 * Also owns the note at the top of the picture when the level changes.
 */
function ActivityOverlay(props: Props) {
  const [lines, setLines] = useState<Line[]>([])
  const typing = useTypingStatus(props.party.id, props.me)
  const latest = usePropRef(props)
  const [toast, showToast] = useTransientState<ActivityLevel | null>(null, TOAST_MS)

  usePusher(`private-party.${props.party.id}`, 'log', (event: { log?: AppPartyLog }) => {
    const log = event?.log
    if (!log) return
    if (log.type === 'message' && log.message?.user) typing.clear(log.message.user.id)
    const { isChatOpen, level, me } = latest.current
    if (isChatOpen || !showsOnOverlay(log, level, me.id)) return
    setLines(current => [...current, { id: String(log.id), log, until: Date.now() + LINE_MS }].slice(-MAX_LINES))
  })

  useEffect(() => {
    if (!lines.length) return
    const soonest = Math.min(...lines.map(line => line.until))
    const timer = setTimeout(() => setLines(current => current.filter(line => line.until > Date.now())), Math.max(0, soonest - Date.now()) + 10)
    return () => clearTimeout(timer)
  }, [lines])

  // Chat opening takes over the conversation; a stricter level drops lines that no longer belong.
  useEffect(() => {
    setLines(current => {
      const kept = props.isChatOpen ? [] : current.filter(line => showsOnOverlay(line.log, props.level, props.me.id))
      return kept.length === current.length ? current : kept
    })
  }, [props.isChatOpen, props.level, props.me.id])

  useUpdateEffect(() => showToast(props.level), [props.level])

  const typer = !props.isChatOpen && props.level === 'all' ? typingLabel(typing.names) : null
  const count = lines.length + (typer ? 1 : 0)

  return (
    <>
      <div className={cx('activity-overlay', { 'is-lifted': props.isLifted })} role="log" aria-label="Room activity">
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <motion.div
              key={line.id}
              className="item"
              layout="position"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 0.32, ease: easeOutSoft }}>
              <button type="button" className="line" data-testid="activity-line" data-age={count - 1 - i} onClick={props.onOpenChat}>
                <LineContent log={line.log} />
              </button>
            </motion.div>
          ))}

          {typer && (
            <motion.div
              key="typing"
              className="item"
              layout="position"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.32, ease: easeOutSoft }}>
              <button type="button" className="line is-typing" data-testid="activity-line" data-age={0} onClick={props.onOpenChat}>
                <span className="dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="text" data-testid="activity-text"><b>{typer.subject}</b> {typer.verb}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className="activity-overlay-toast" data-testid="activity-toast"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOutSoft }}>
            <i className={cx('fa', ACTIVITY_COPY[toast].icon)} aria-hidden="true" />
            {ACTIVITY_COPY[toast].toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function LineContent({ log }: { log: AppPartyLog }) {
  if (log.type === 'message') {
    return <>
      <UiAvatar user={log.message.user} />
      <span className="text" data-testid="activity-text"><b>{log.message.user.name}</b> {log.message.text}</span>
    </>
  }

  const activity = log.activity
  if (isJoinActivity(activity)) {
    return <>
      <UiAvatar user={activity.user} />
      <span className="text" data-testid="activity-text"><b>{activity.user.name}</b> {hypeFor(activity.user.id)[0]}</span>
    </>
  }

  return <>
    <span className="icon" aria-hidden="true"><i className={cx('fa', activityIcon(activity))} /></span>
    <span className="text" data-testid="activity-text"><b>{activity.user.name}</b> <ActivitySaid activity={activity} /></span>
  </>
}

export default ActivityOverlay
