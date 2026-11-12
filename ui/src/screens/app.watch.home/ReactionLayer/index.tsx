import * as React from 'react'
import { cn } from '~/utils/cn'
import type { ReactionFloat } from '../useReactions'

interface Props {
  floats: ReactionFloat[]
  // The player controls are up, so floats start above the seek bar.
  isLifted: boolean
  onDone: (id: string) => void
}

/**
 * Emoji float up the right side of the picture, each with the sender's name in a white pill.
 * The path (--x, --d, --rise and the rest) is set per float; the keyframes are in tailwind.css.
 * With reduced motion a float still fades, since that is what clears it, but it doesn't rise, drift or pop.
 */
function ReactionLayer(props: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-(--zindex-player-reactions) overflow-hidden" aria-hidden="true">
      {/* The lane is the space floats rise through; it shrinks from below while the controls are up. */}
      <div className={cn('[container-type:size] absolute inset-0 transition-[bottom] duration-200', props.isLifted && 'bottom-18 sm:bottom-24')}>
        {props.floats.map(float => (
          <div
            key={float.id}
            className="absolute right-[calc(24px+var(--x)*min(260px,35cqw))] bottom-4.5 animate-reaction motion-reduce:animate-reaction-fade" data-testid="reaction-float"
            style={{
              '--x': float.path.x,
              '--d': `${float.path.duration}s`,
              '--rise': float.path.rise,
              '--size': `${float.path.size}px`,
              '--drift': `${float.path.drift}px`,
              '--drift-end': `${float.path.driftEnd}px`,
              '--tilt': `${float.path.tilt}deg`,
              '--ease': float.path.ease
            } as React.CSSProperties}
            onAnimationEnd={event => {
              if (event.target === event.currentTarget) props.onDone(float.id)
            }}>
            <span className="flex animate-reaction-drift flex-col items-center motion-reduce:animate-none">
              <span className="block animate-reaction-pop text-(length:--size) leading-none drop-shadow-[0_3px_8px_#0008] motion-reduce:animate-none" data-testid="reaction-emoji">{float.emoji}</span>
              <span className="mt-1.25 max-w-30 animate-reaction-name truncate rounded-full bg-white px-2.25 py-0.75 text-11 leading-tight font-bold text-neutral-950 shadow-[0_3px_10px_-2px_#0008] motion-reduce:animate-none">{float.name}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReactionLayer
