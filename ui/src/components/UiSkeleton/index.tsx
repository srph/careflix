import './style.css'
import type { ComponentPropsWithoutRef, CSSProperties } from 'react'
import cx from 'classnames'

type Props = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
}

// Announce loading once on the containing region; individual shapes are decorative.
export default function UiSkeleton({ className, width, height, radius, style, ...props }: Props) {
  return <div data-testid="skeleton" {...props} className={cx('ui-skeleton', className)}
    style={{ width, height, borderRadius: radius, ...style }} aria-hidden="true" />
}
