import './style.css'
import * as React from 'react'
import cx from 'classnames'
import { getInitials, getBgFromInitials } from './utils'

interface Props {
  img?: string
  user?: Pick<AppUser, 'name' | 'avatar'> | null
  size?: 'sm' | 'm' | 'l' | 'xl'
}

function UiAvatar(props: Props) {
  const className = cx('ui-avatar', {
    'is-sm': props.size === 'sm',
    'is-m': props.size === 'm',
    'is-l': props.size === 'l',
    'is-xl': props.size === 'xl'
  })

  const src = props.img || props.user?.avatar
  if (src) return <img data-testid="avatar" src={src} alt="Avatar" className={className} />

  // A missing user (signed out mid-render, deleted account) gets a blank circle instead of crashing the route.
  const initials = props.user?.name ? getInitials(props.user.name) : ''
  return (
    <div data-testid="avatar" className={className} style={{ backgroundColor: initials ? getBgFromInitials(initials) : 'var(--color-neutral-700)' }}>
      {initials}
    </div>
  )
}

export default UiAvatar
