import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface Props {
  img: string
  size?: 'sm' | 'm' | 'l' | 'xl'
}

function UiAvatar(props: Props) {
  return (
    <img src={props.img} alt="Avatar" className={cx('ui-avatar', {
      'is-sm': props.size === 'sm',
      'is-m': props.size === 'm',
      'is-l': props.size === 'l',
      'is-xl': props.size === 'xl'
    })} />
  )
}

export default UiAvatar