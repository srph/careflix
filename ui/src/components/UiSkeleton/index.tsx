import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import { cn } from '~/utils/cn'

type Props = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
}

// Announce loading once on the containing region; individual shapes are decorative.
export default function UiSkeleton({ className, width, height, radius, style, ...props }: Props) {
  return (
    <div
      data-testid="skeleton"
      {...props}
      className={cn(
        'block h-[1em] shrink-0 animate-skeleton rounded-sm bg-neutral-800 motion-reduce:animate-none',
        className
      )}
      style={{ width, height, borderRadius: radius, ...style }}
      aria-hidden="true"
    />
  )
}
