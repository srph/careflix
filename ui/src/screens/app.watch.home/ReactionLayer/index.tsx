import './style.css'

import * as React from 'react'
import cx from 'classnames'
import type { ReactionFloat } from '../useReactions'

interface Props {
  floats: ReactionFloat[]
  // The player controls are up, so floats start above the seek bar.
  isLifted: boolean
  onDone: (id: string) => void
}

function ReactionLayer(props: Props) {
  return (
    <div className={cx('reaction-layer', { 'is-lifted': props.isLifted })} aria-hidden="true">
      <div className="lane">
        {props.floats.map(float => (
          <div
            key={float.id}
            className="reaction-float" data-testid="reaction-float"
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
            <span className="drift">
              <span className="emoji" data-testid="reaction-emoji">{float.emoji}</span>
              <span className="name">{float.name}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReactionLayer
