import * as React from 'react'
import { cn } from '~/utils/cn'

type ElementProps = Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'className'>

interface OwnProps {
  mode?: 'dark' | 'light'
  /** The wrapper: how wide the control is. */
  className?: string
  selectClassName?: string
  caretClassName?: string
}

type Props = ElementProps & OwnProps

export function UiSelect({ mode, className, selectClassName, caretClassName, ...props }: Props) {
  const light = mode === 'light'
  return (
    <div className={cn('relative', className)}>
      <select
        {...props}
        className={cn(
          'block h-10 w-full cursor-pointer appearance-none rounded-sm border px-3',
          light ? 'border-neutral-300 text-neutral-700' : 'border-neutral-400 text-white',
          selectClassName
        )}
      />
      <span
        className={cn(
          'pointer-events-none absolute top-3 right-3',
          light ? 'text-neutral-500' : 'text-white',
          caretClassName
        )}>
        <i className="fa fa-angle-down" />
      </span>
    </div>
  )
}
