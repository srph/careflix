import * as React from 'react'
import { cn } from '~/utils/cn'
import { usePlayaContext } from './playa'

// Oldest floats make way once a crowd laugh fills the picture.
export const MAX_FLOATS = 24

// Each float picks its own smooth path so a burst never looks copy-pasted.
export interface FloatPath {
  // 0–1 across the band on the right of the picture
  x: number
  // seconds
  duration: number
  // share of the lane's height to rise, in percent
  rise: number
  // px
  size: number
  drift: number
  driftEnd: number
  // degrees
  tilt: number
  ease: string
}

export interface PlayaFloat {
  id: string
  emoji: string
  name: string
  path: FloatPath
}

const EASES = ['cubic-bezier(.22,.61,.36,1)', 'cubic-bezier(.33,.7,.4,1)', 'cubic-bezier(.17,.5,.3,1)']

export function makePath(random: () => number = Math.random): FloatPath {
  const between = (a: number, b: number) => a + random() * (b - a)
  const side = random() < 0.5 ? -1 : 1
  return {
    x: random(),
    duration: between(2.6, 3.6),
    rise: between(50, 75),
    size: between(26, 34),
    drift: side * between(8, 22),
    driftEnd: -side * between(0, 16),
    tilt: side * between(0, 6),
    ease: EASES[Math.floor(random() * EASES.length)]
  }
}

/**
 * Emoji from `playa.react()` float up the right side of the picture, each with the sender's name in a white pill.
 * The path (--x, --d, --rise and the rest) is set per float; the keyframes are in tailwind.css.
 * With reduced motion a float still fades, since that is what clears it, but it doesn't rise, drift or pop.
 */
export function PlayaReactions() {
  const playa = usePlayaContext()

  return (
    <div
      className="pointer-events-none absolute inset-0 z-(--zindex-player-reactions) overflow-hidden"
      aria-hidden="true">
      {/* The lane is the space floats rise through; it shrinks from below while the controls are up. */}
      <div
        className={cn(
          '[container-type:size] absolute inset-0 transition-[bottom] duration-200',
          playa.state.isOverlayOpen && 'bottom-18 sm:bottom-24'
        )}>
        {playa.floats.map((float) => (
          <div
            key={float.id}
            className="absolute right-[calc(24px+var(--x)*min(260px,35cqw))] bottom-4.5 animate-reaction motion-reduce:animate-reaction-fade"
            data-testid="reaction-float"
            style={
              {
                '--x': float.path.x,
                '--d': `${float.path.duration}s`,
                '--rise': float.path.rise,
                '--size': `${float.path.size}px`,
                '--drift': `${float.path.drift}px`,
                '--drift-end': `${float.path.driftEnd}px`,
                '--tilt': `${float.path.tilt}deg`,
                '--ease': float.path.ease
              } as React.CSSProperties
            }
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) playa.dropFloat(float.id)
            }}>
            <span className="flex animate-reaction-drift flex-col items-center motion-reduce:animate-none">
              <span
                className="block animate-reaction-pop text-(length:--size) leading-none drop-shadow-[0_3px_8px_#0008] motion-reduce:animate-none"
                data-testid="reaction-emoji">
                {float.emoji}
              </span>
              <span className="mt-1.25 max-w-30 animate-reaction-name truncate rounded-full bg-white px-2.25 py-0.75 text-11 leading-tight font-bold text-neutral-950 shadow-[0_3px_10px_-2px_#0008] motion-reduce:animate-none">
                {float.name}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
