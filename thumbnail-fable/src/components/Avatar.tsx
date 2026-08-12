import type { User } from '../data'

type Size = 'sm' | 'md' | 'lg'

const sizeClasses: Record<Size, string> = {
  sm: 'h-5 w-5 text-[8px]',
  md: 'h-8 w-8 text-[11px]',
  lg: 'h-10 w-10 text-xs'
}

function getInitials(name: string) {
  const [f, l] = name.split(' ')
  return [f.charAt(0).toUpperCase(), (l || '').charAt(0).toUpperCase()].join('')
}

export function UiAvatar(props: { user: User; size?: Size }) {
  const size = props.size ?? 'md'
  const base = `${sizeClasses[size]} shrink-0 rounded-full`

  if (props.user.avatar) {
    return <img src={props.user.avatar} alt={props.user.name} className={`${base} object-cover`} />
  }

  return (
    <div
      className={`${base} flex items-center justify-center font-semibold text-ink-950`}
      style={{ backgroundColor: props.user.color }}>
      {getInitials(props.user.name)}
    </div>
  )
}

export function UiPresenceAvatar(props: { user: User; size?: Size; isActive?: boolean }) {
  const isActive = props.isActive ?? props.user.isOnline

  return (
    <div className="relative">
      <UiAvatar user={props.user} size={props.size} />
      {isActive && (
        <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-ink-950" />
      )}
    </div>
  )
}

const MAX_VISIBLE = 4

export function UiAvatarGroup(props: { users: User[] }) {
  const visible = props.users.slice(0, MAX_VISIBLE)
  const remaining = props.users.length - visible.length

  return (
    <div className="flex -space-x-2">
      {visible.map(user => (
        <div className="rounded-full ring-2 ring-ink-950" key={user.id}>
          <UiPresenceAvatar user={user} isActive={user.isOnline} />
        </div>
      ))}

      {remaining > 0 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-700 text-[11px] font-medium text-ink-200 ring-2 ring-ink-950">
          +{remaining}
        </div>
      )}
    </div>
  )
}
