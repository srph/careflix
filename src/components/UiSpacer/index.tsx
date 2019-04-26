import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface Props {
  size?: 1 | 2 | 3 | 4 | 5
}

function UiSpacer(props: Props) {
  return (
    <div className={cx('ui-spacer', {
      'is-size-1': props.size === 1,
      'is-size-2': props.size === 2,
      'is-size-3': props.size === 3,
      'is-size-4': props.size === 4,
      'is-size-5': props.size === 5
    })} />
  )
}

UiSpacer.defaultProps = {
  size: 1
}

export default UiSpacer