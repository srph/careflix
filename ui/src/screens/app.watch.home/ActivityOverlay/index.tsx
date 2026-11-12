import * as React from 'react'
import { useEffect, useState } from 'react'
import { cn } from '~/utils/cn'
import { AnimatePresence, motion } from 'motion/react'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { usePusher } from '~/hooks/use-pusher'
import { usePropRef } from '~/hooks/use-prop-ref'
import { useTransientState } from '~/hooks/use-transient-state'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import { easeOutSoft } from '~/utils/motion'
import useTypingStatus from '../ChatWidget/useTypingStatus'
import { hypeFor, isJoinActivity, typingLabel } from '../ChatStatus/status'
import { ActivitySaid, TypingDots, activityIcon } from '../ChatStatus/ActivitySaid'
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

// A line is a pill over the picture. Newest is brightest; older lines step back.
const LINE = 'pointer-events-auto flex max-w-full cursor-pointer items-center gap-2 rounded-2xl bg-black/42 py-1.25 pr-3.5 pl-1.25 text-left text-base/snug text-neutral-200 transition-[opacity,background-color] duration-[.3s,.15s] text-shadow-default hover:bg-black/62 data-[age="1"]:opacity-88 data-[age="2"]:opacity-74 data-[age="3"]:opacity-60 data-[age="4"]:opacity-50'
const TEXT = 'line-clamp-2 min-w-0 wrap-anywhere'
const NAME = 'font-bold text-white'
// The avatar, the icon disc and the typing dots all fill the same 24px slot, so names line up.
const SLOT = 'inline-flex size-6 flex-none items-center justify-center'
const AVATAR = 'size-6 flex-none text-11'

/**
 * The room over the bottom-left of the picture while chat is closed, from 640px up: new messages, joins and
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
      {/* Sits above the player overlay so its lines stay clickable while the controls are up. */}
      <div role="log" aria-label="Room activity"
        className={cn('pointer-events-none absolute bottom-8 left-8 z-[calc(var(--zindex-player-reactions)+1)] hidden max-w-[min(440px,40%)] flex-col items-start gap-2 transition-[translate] duration-200 motion-reduce:[transition:none] sm:flex', props.isLifted && '-translate-y-28')}>
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <motion.div
              key={line.id}
              className="max-w-full"
              layout="position"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -24, transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } }}
              transition={{ duration: 0.32, ease: easeOutSoft }}>
              <button type="button" className={LINE} data-testid="activity-line" data-age={count - 1 - i} onClick={props.onOpenChat}>
                <LineContent log={line.log} />
              </button>
            </motion.div>
          ))}

          {typer && (
            <motion.div
              key="typing"
              className="max-w-full"
              layout="position"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
              transition={{ duration: 0.32, ease: easeOutSoft }}>
              <button type="button" className={LINE} data-testid="activity-line" data-age={0} onClick={props.onOpenChat}>
                <TypingDots className={`${SLOT} gap-0.5`} dot="size-1 bg-neutral-200" />
                <span className={TEXT} data-testid="activity-text"><b className={NAME}>{typer.subject}</b> {typer.verb}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className="pointer-events-none absolute inset-x-0 top-6 z-(--zindex-player-tooltip) mx-auto hidden w-max items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-13/4 font-semibold text-white shadow-pop sm:flex" data-testid="activity-toast"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOutSoft }}>
            <i className={cn('fa', ACTIVITY_COPY[toast].icon)} aria-hidden="true" />
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
      <UiAvatar user={log.message.user} className={AVATAR} />
      <span className={TEXT} data-testid="activity-text"><b className={NAME}>{log.message.user.name}</b> {log.message.text}</span>
    </>
  }

  const activity = log.activity
  if (isJoinActivity(activity)) {
    return <>
      <UiAvatar user={activity.user} className={AVATAR} />
      <span className={TEXT} data-testid="activity-text"><b className={NAME}>{activity.user.name}</b> {hypeFor(activity.user.id)[0]}</span>
    </>
  }

  return <>
    <span className={`${SLOT} rounded-full bg-white/12 text-10 text-white`} aria-hidden="true"><i className={cn('fa', activityIcon(activity))} /></span>
    <span className={TEXT} data-testid="activity-text"><b className={NAME}>{activity.user.name}</b> <ActivitySaid activity={activity} /></span>
  </>
}

export default ActivityOverlay
