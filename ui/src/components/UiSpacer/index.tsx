import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface Props {
  size?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
}

function UiSpacer({ size = 1 }: Props) {
  return (
    <div className={cx('ui-spacer', {
      'is-size-1': size === 1,
      'is-size-2': size === 2,
      'is-size-3': size === 3,
      'is-size-4': size === 4,
      'is-size-5': size === 5,
      'is-size-6': size === 6,
      'is-size-7': size === 7,
      'is-size-8': size === 8,
      'is-size-9': size === 9,
      'is-size-10': size === 10
    })} />
  )
}

export default UiSpacer