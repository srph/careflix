import './style.css'
import * as React from 'react'
import UiButton, { UiButtonProps } from '~/components/UiButton'
import UiLoader from '~/components/UiLoader'

type Props = UiButtonProps & {
  isLoading?: boolean
}

function UiButtonLoader({ disabled, isLoading, children, ...props }: Props) {
  return (
    <UiButton {...props} disabled={disabled || isLoading}>
      {isLoading ? <UiLoader /> : children}
    </UiButton>
  )
}

export default UiButtonLoader