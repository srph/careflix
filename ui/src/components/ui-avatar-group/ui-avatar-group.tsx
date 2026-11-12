import * as React from 'react'
import { cn } from '~/utils/cn'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { UiPresenceAvatar } from '~/components/ui-presence-avatar/ui-presence-avatar'
import { useAuth } from '~/contexts/auth/auth'

interface Props {
  users: AppUser[] | AppPartyMember[]
  size?: 'sm' | 'm' | 'l' | 'xl'
  className?: string
  /** The wrapper around each avatar: its spacing, or a border that cuts it out of the next one. */
  itemClassName?: string
  avatarClassName?: string
  statusClassName?: string
}

export function UiAvatarGroup(props: Props) {
  const auth = useAuth()

  return (
    <div className={cn('flex items-center', props.className)}>
      {props.users.slice(0, 4).map((user, i) => (
        <div className={cn('not-last:mr-0.5', props.itemClassName)} key={i}>
          {auth.data?.id !== user.id && 'pivot' in user ? (
            <UiPresenceAvatar
              user={user}
              isActive={(user as AppPartyMember).pivot.is_active}
              avatarClassName={props.avatarClassName}
              statusClassName={props.statusClassName}
            />
          ) : (
            <UiAvatar user={user} className={props.avatarClassName} />
          )}
        </div>
      ))}

      {props.users.length > 5 && (
        <div className="ml-2 shrink-0">
          <h6 className="font-label text-xs font-bold tracking-label uppercase">+{props.users.length - 5} more</h6>
        </div>
      )}
    </div>
  )
}
