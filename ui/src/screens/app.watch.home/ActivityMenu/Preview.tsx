import * as React from 'react'
import type { ActivityLevel } from '../activityLevel'

/**
 * A close-up of the picture's bottom-left corner at each level, drawn at size.
 * The people are stand-ins, the same in every room.
 */
function Preview({ level }: { level: ActivityLevel }) {
  return (
    <span className="activity-menu-preview" aria-hidden="true">
      {level === 'all' && (
        <span className="reaction">
          <span className="emoji">😂</span>
          <span className="name">Joyce</span>
        </span>
      )}

      {level !== 'off' && (
        <span className="lines">
          {level === 'all' && (
            <span className="line"><span className="face is-leo">L</span><b>Leo</b>&nbsp;ok who picked this</span>
          )}
          <span className="line"><span className="face is-wave">👋</span><b>Joyce</b>&nbsp;is here.</span>
          {level === 'activity' && (
            <span className="line"><span className="face is-pause"><i className="fa fa-pause" /></span><b>Mira</b>&nbsp;paused at 41:12</span>
          )}
        </span>
      )}
    </span>
  )
}

export default Preview
