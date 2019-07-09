import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface Props {
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

function UiContainer(props: Props) {
  return (
    <div className={cx('ui-container', {
      'is-xl': props.size === 'xl',
      'is-lg': props.size === 'lg',
      'is-md': props.size ==='md',
      'is-sm': props.size === 'sm'
    })}>
      {props.children}
    </div>
  )
}

export default UiContainer