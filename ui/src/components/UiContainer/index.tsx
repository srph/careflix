import * as React from 'react'
import { cn } from '~/utils/cn'

interface Props {
  children?: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

// 480, 768, 992 and 1200px.
const SIZES = { sm: 'max-w-120', md: 'max-w-3xl', lg: 'max-w-248', xl: 'max-w-300' }

function UiContainer(props: Props) {
  return <div className={cn('mx-auto w-full px-4', props.size && SIZES[props.size])}>{props.children}</div>
}

export default UiContainer
