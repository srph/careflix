import './style.css'
import * as React from 'react'
import cx from 'classnames'

type Props = React.HTMLAttributes<HTMLDivElement>

function StandardAspectRatioBox(props: Props) {
  const className = cx(['c-standard-aspect-ratio-box-inner', props.className])
  
  return (
    <div className="c-standard-aspect-ratio-box">
      <div {...props} className={className}>
        {props.children}
      </div>
    </div>
  )
}

export default StandardAspectRatioBox