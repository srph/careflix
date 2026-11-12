import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import { cn } from '~/utils/cn'

interface Props {
  user: AppUser
  size?: 'sm' | 'm' | 'l' | 'xl'
  // Used to check if a user is active in the party
  isActive?: boolean
  className?: string
  avatarClassName?: string
  /** The presence dot: its size and position, or `hidden`. */
  statusClassName?: string
}

function UiPresenceAvatar(props: Props) {
  const isActive = props.isActive != null ? props.isActive : props.user.is_online

  return (
    <div
      data-testid="presence-avatar"
      data-online={Boolean(isActive)}
      className={cn('relative', isActive ? 'opacity-100 transition-all duration-200' : 'opacity-50', props.className)}>
      <UiAvatar user={props.user} size={props.size} className={props.avatarClassName} />
      <div
        className={cn(
          'absolute -right-1 -bottom-1 rounded-full border-2 border-neutral-900',
          props.size === 'm' ? 'size-5' : 'size-4',
          isActive ? 'bg-emerald-300' : 'bg-neutral-400',
          props.statusClassName
        )}
      />
    </div>
  )
}

export default UiPresenceAvatar
