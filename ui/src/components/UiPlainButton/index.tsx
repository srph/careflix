import * as React from 'react'
import { cn } from '~/utils/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

function UiPlainButton({ className, ...props }: Props, ref: React.MutableRefObject<HTMLButtonElement>) {
  return (
    <button
      {...props}
      ref={ref}
      className={cn('inline-block cursor-pointer', className)}>
      {props.children}
    </button>
  )
}

export default React.forwardRef(UiPlainButton)
