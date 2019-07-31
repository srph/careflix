import './style.css'
import * as React from 'react'
import cx from 'classnames'
import { getInitials, getBgFromInitials } from './utils'

interface Props {
  img?: string
  user?: AppUser
  size?: 'sm' | 'm' | 'l' | 'xl'
}

function UiAvatar(props: Props) {
  const className = cx('ui-avatar', {
    'is-sm': props.size === 'sm',
    'is-m': props.size === 'm',
    'is-l': props.size === 'l',
    'is-xl': props.size === 'xl'
  })

  if (props.user && !props.user.avatar) {
    const initials = getInitials(props.user.name)

    return (
      <div className={className} style={{ backgroundColor: getBgFromInitials(initials) }}>
        {initials}
      </div>
    )
  }

  return <img src={props.img || props.user.avatar} alt="Avatar" className={className} />
}

export default UiAvatar
