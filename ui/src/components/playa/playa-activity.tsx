import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '~/utils/cn'
import { easeOutSoft } from '~/utils/motion'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { usePlayaContext } from './playa'
import type { PlayaPerson } from './use-playa'

/** Something someone did in the room. Each type carries what Playa needs to say it. */
export type PlayaActivity =
  | { id: string; type: 'joined'; by: PlayaPerson }
  | { id: string; type: 'played'; by: PlayaPerson }
  | { id: string; type: 'paused'; by: PlayaPerson; at?: number }
  | { id: string; type: 'seeked'; by: PlayaPerson; from?: number; to?: number }
  | { id: string; type: 'started'; by: PlayaPerson }
  | { id: string; type: 'switched'; by: PlayaPerson; text: string }
  | { id: string; type: 'message'; by: PlayaPerson; text: string }
  // Anything else, said as-is.
  | { id: string; type: 'note'; by: PlayaPerson; text: string }

// Each line stays this long, then fades.
export const LINE_MS = 8000
// Older lines make way once a burst fills the corner.
export const MAX_LINES = 4

// One line per friend so the same person always arrives the same way.
const HYPE: [string, string][] = [
  ['just joined.', 'Let’s fucking go.'],
  ['is here.', 'Let’s do this.'],
  ['is here.', 'Time to run it down.'],
  ['is here.', 'Game on.'],
  ['is here.', 'We are so back.']
]

export function hypeFor(personId: string | number): [string, string] {
  const key = String(personId)
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) | 0
  return HYPE[Math.abs(hash) % HYPE.length]
}

/** Movie time as the player shows it: 41:12, 1:02:15. */
export function movieTime(seconds: number): string {
  const total = Math.max(0, Math.round(seconds || 0))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = String(total % 60).padStart(2, '0')
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${rest}` : `${minutes}:${rest}`
}

export function seekDirection(activity: { from?: number; to?: number }): 'back' | 'ahead' | null {
  const { from, to } = activity
  if (from == null || to == null || from === to) return null
  return to < from ? 'back' : 'ahead'
}

export function typingLabel(names: string[]): { subject: string; verb: string } | null {
  if (!names.length) return null
  if (names.length === 1) return { subject: names[0], verb: 'is typing' }
  if (names.length === 2) return { subject: `${names[0]} and ${names[1]}`, verb: 'are typing' }
  return { subject: `${names.length} people`, verb: 'are typing' }
}

const ICONS: Partial<Record<PlayaActivity['type'], string>> = {
  played: 'fa-play',
  paused: 'fa-pause',
  started: 'fa-star',
  switched: 'fa-film'
}

/** The icon beside a playback line, e.g. pause for "paused at 41:12". */
export function activityIcon(activity: PlayaActivity): string | undefined {
  if (activity.type === 'seeked') return seekDirection(activity) === 'back' ? 'fa-backward' : 'fa-forward'
  return ICONS[activity.type]
}

/** Three dots that bob in turn while someone types. `dot` sizes and colours each one. */
export function TypingDots({ className, dot }: { className?: string; dot: string }) {
  return (
    <span className={cn('inline-flex flex-none', className)} aria-hidden="true">
      {[0, 0.15, 0.3].map((delay) => (
        <i
          key={delay}
          className={cn('animate-typing-dot rounded-full motion-reduce:animate-none', dot)}
          style={{ animationDelay: `${delay}s` }}
        />
      ))}
    </span>
  )
}

/** What someone did, after their name: "paused at 41:12", "skipped ahead to 1:02:15". */
export function PlayaActivityText({ activity }: { activity: PlayaActivity }) {
  switch (activity.type) {
    case 'joined':
      return <>{hypeFor(activity.by.id)[0]}</>
    case 'played':
      return <>pressed play</>
    case 'paused':
      return activity.at == null ? <>paused</> : <>paused at {at(activity.at)}</>
    case 'seeked': {
      if (activity.to == null) return <>skipped</>
      const direction = seekDirection(activity)
      const verb = direction === 'back' ? 'jumped back' : direction === 'ahead' ? 'skipped ahead' : 'skipped'
      return (
        <>
          {verb} to {at(activity.to)}
        </>
      )
    }
    case 'started':
      return <>started the room</>
    default:
      return <>{activity.text}</>
  }
}

const at = (seconds: number) => <span className="tabular-nums">{movieTime(seconds)}</span>

// A line is a pill over the picture. Newest is brightest; older lines step back.
const LINE =
  'pointer-events-auto flex max-w-full cursor-pointer items-center gap-2 rounded-2xl bg-black/42 py-1.25 pr-3.5 pl-1.25 text-left text-base/snug text-neutral-200 transition-[opacity,background-color] duration-[.3s,.15s] text-shadow-default hover:bg-black/62 data-[age="1"]:opacity-88 data-[age="2"]:opacity-74 data-[age="3"]:opacity-60 data-[age="4"]:opacity-50'
const TEXT = 'line-clamp-2 min-w-0 wrap-anywhere'
const NAME = 'font-bold text-white'
// The avatar, the icon disc and the typing dots all fill the same 24px slot, so names line up.
const SLOT = 'inline-flex size-6 flex-none items-center justify-center'
const AVATAR = 'size-6 flex-none text-11'

interface Props {
  // Names of people typing; shown as the newest line.
  typing?: string[]
  onLineClick?: () => void
}

/**
 * Lines from `playa.activity()` over the bottom-left of the picture, from 640px up, plus who's typing.
 * They sit above the seek bar while the controls are up.
 */
export function PlayaActivity(props: Props) {
  const playa = usePlayaContext()
  const typer = typingLabel(props.typing ?? [])
  const count = playa.lines.length + (typer ? 1 : 0)

  return (
    // Sits above the controls so its lines stay clickable while they're up.
    <div
      role="log"
      aria-label="Room activity"
      className={cn(
        'pointer-events-none absolute bottom-8 left-8 z-[calc(var(--zindex-player-reactions)+1)] hidden max-w-[min(440px,40%)] flex-col items-start gap-2 transition-[translate] duration-200 motion-reduce:[transition:none] sm:flex',
        playa.state.isOverlayOpen && '-translate-y-28'
      )}>
      <AnimatePresence initial={false}>
        {playa.lines.map((activity, i) => (
          <motion.div
            key={activity.id}
            className="max-w-full"
            layout="position"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -24, transition: { duration: 0.26, ease: [0.4, 0, 1, 1] } }}
            transition={{ duration: 0.32, ease: easeOutSoft }}>
            <button
              type="button"
              className={LINE}
              data-testid="activity-line"
              data-age={count - 1 - i}
              onClick={props.onLineClick}>
              <LineContent activity={activity} />
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
            <button type="button" className={LINE} data-testid="activity-line" data-age={0} onClick={props.onLineClick}>
              <TypingDots className={`${SLOT} gap-0.5`} dot="size-1 bg-neutral-200" />
              <span className={TEXT} data-testid="activity-text">
                <b className={NAME}>{typer.subject}</b> {typer.verb}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LineContent({ activity }: { activity: PlayaActivity }) {
  const person = { name: activity.by.name, avatar: activity.by.avatar ?? '' }
  const name = <b className={NAME}>{activity.by.name}</b>

  if (activity.type === 'message' || activity.type === 'joined') {
    return (
      <>
        <UiAvatar user={person} className={AVATAR} />
        <span className={TEXT} data-testid="activity-text">
          {name} <PlayaActivityText activity={activity} />
        </span>
      </>
    )
  }

  return (
    <>
      <span className={`${SLOT} rounded-full bg-white/12 text-10 text-white`} aria-hidden="true">
        <i className={cn('fa', activityIcon(activity))} />
      </span>
      <span className={TEXT} data-testid="activity-text">
        {name} <PlayaActivityText activity={activity} />
      </span>
    </>
  )
}
