import * as React from 'react'
import { cn } from '~/utils/cn'
import { getInitials, getBgFromInitials } from './ui-avatar-utils'

interface Props {
  img?: string
  user?: Pick<AppUser, 'name' | 'avatar'> | null
  size?: 'sm' | 'm' | 'l' | 'xl'
  className?: string
}

const SIZES: Partial<Record<NonNullable<Props['size']>, string>> = { sm: 'size-4 text-[8px] font-normal', m: 'size-12', l: 'size-20' }

export function UiAvatar(props: Props) {
  const className = cn(
    'inline-flex size-8 items-center justify-center overflow-hidden rounded-full font-bold text-white select-none',
    SIZES[props.size],
    props.className
  )

  const src = props.img || props.user?.avatar
  if (src) return <img data-testid="avatar" src={src} alt="Avatar" className={className} />

  // A missing user (signed out mid-render, deleted account) gets a blank circle instead of crashing the route.
  const initials = props.user?.name ? getInitials(props.user.name) : ''
  return (
    <div
      data-testid="avatar"
      className={className}
      style={{ backgroundColor: initials ? getBgFromInitials(initials) : 'var(--color-neutral-700)' }}>
      {initials}
    </div>
  )
}
