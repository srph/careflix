import './style.css'
import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import cx from 'classnames'

interface Props {
  user: AppUser
  size?: 'sm' | 'm' | 'l' | 'xl'
  // Used to check if a user is active in the party
  isActive?: boolean
}

function UiPresenceAvatar(props: Props) {
  const isActive = props.isActive != null ? props.isActive : props.user.is_online

  return (
    <div
      className={cx('ui-presence-avatar', {
        'is-sm': props.size === 'sm',
        'is-m': props.size === 'm',
        'is-l': props.size === 'l',
        'is-xl': props.size === 'xl',
        'is-online': isActive
      })}>
      <UiAvatar user={props.user} size={props.size} />
      <div className="status" />
    </div>
  )
}

export default UiPresenceAvatar
