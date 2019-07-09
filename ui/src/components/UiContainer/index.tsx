import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface Props {
  children?: React.ReactNode
  size?: 'sm' | 'md'
}

function UiContainer(props: Props) {
  return (
    <div className={cx('ui-container', {
      'is-sm': props.size === 'sm'
    })}>
      {props.children}
    </div>
  )
}

export default UiContainer