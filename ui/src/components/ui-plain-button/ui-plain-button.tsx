import * as React from 'react'
import { cn } from '~/utils/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

export const UiPlainButton = React.forwardRef(function UiPlainButton({ className, ...props }: Props, ref: React.ForwardedRef<HTMLButtonElement>) {
  return (
    <button
      {...props}
      ref={ref}
      className={cn('inline-block cursor-pointer', className)}>
      {props.children}
    </button>
  )
})
