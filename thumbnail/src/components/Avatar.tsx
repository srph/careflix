import './Avatar.css'
import cx from 'classnames'
import type { User } from '../data'
import { self as currentUser } from '../data'

type Size = 'sm' | 'm' | 'l' | 'xl'

function getInitials(name: string) {
  const [f, l] = name.split(' ')
  return [f.charAt(0).toUpperCase(), (l || '').charAt(0).toUpperCase()].join('')
}

export function UiAvatar(props: { user: User; size?: Size }) {
  const className = cx('ui-avatar', {
    'is-sm': props.size === 'sm',
    'is-m': props.size === 'm',
    'is-l': props.size === 'l',
    'is-xl': props.size === 'xl'
  })

  if (!props.user.avatar) {
    const initials = getInitials(props.user.name)
    return (
      <div className={className} style={{ backgroundColor: props.user.color || 'var(--color-black-4)' }}>
        {initials}
      </div>
    )
  }

  return <img src={props.user.avatar} alt="Avatar" className={className} />
}

export function UiPresenceAvatar(props: { user: User; size?: Size; isActive?: boolean }) {
  const isActive = props.isActive != null ? props.isActive : props.user.isOnline

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

const MAX_VISIBLE = 4

export function UiAvatarGroup(props: { users: User[] }) {
  const visible = props.users.slice(0, MAX_VISIBLE)
  const remaining = props.users.length - visible.length

  return (
    <div className="ui-avatar-group">
      {/* Rendered in reverse DOM order (with flex-direction: row-reverse in CSS) so
          natural paint order does the stacking — leftmost avatar ends up on top,
          and the "+N" chip, being first in the DOM, stays behind everything. */}
      {remaining > 0 && (
        <div className="avatar">
          <div className="ui-avatar is-more">+{remaining}</div>
        </div>
      )}

      {visible
        .slice()
        .reverse()
        .map(user => (
          <div className="avatar" key={user.id}>
            {currentUser.id !== user.id ? (
              <UiPresenceAvatar user={user} isActive={user.isOnline} />
            ) : (
              <UiAvatar user={user} />
            )}
          </div>
        ))}
    </div>
  )
}
