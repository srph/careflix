import * as React from 'react'
import { cn } from '~/utils/cn'

type HTMLProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>

interface OwnProps {
  isDark?: boolean
  isRound?: boolean
}

type Props = HTMLProps & OwnProps

export const UiInput = React.forwardRef(function UiInput(
  { isDark, isRound, ...props }: Props,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  return (
    <input
      {...props}
      ref={ref}
      className={cn(
        'block h-12.5 w-full border border-transparent px-4 py-0 text-sm text-neutral-400 focus:bg-neutral-950',
        isDark ? 'bg-neutral-950' : 'bg-neutral-900',
        isRound ? 'rounded-full' : 'rounded-sm'
      )}
    />
  )
})
