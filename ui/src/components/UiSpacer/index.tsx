import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface Props {
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

function UiSpacer(props: Props) {
  return (
    <div className={cx('ui-spacer', {
      'is-size-1': props.size === 1,
      'is-size-2': props.size === 2,
      'is-size-3': props.size === 3,
      'is-size-4': props.size === 4,
      'is-size-5': props.size === 5,
      'is-size-6': props.size === 6,
      'is-size-7': props.size === 7,
      'is-size-8': props.size === 8,
      'is-size-9': props.size === 9,
      'is-size-10': props.size === 10
    })} />
  )
}

UiSpacer.defaultProps = {
  size: 1
}

export default UiSpacer