import * as React from 'react'
import { cn } from '~/utils/cn'

function UiLogo({ className }: { className?: string }) {
  return <div className={cn('font-label text-base leading-none text-pink-500', className)}>Care.tv</div>
}

export default UiLogo
