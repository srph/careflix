import './style.css'
import * as React from 'react'
import UiButton, { UiButtonProps } from '~/components/UiButton'
import UiLoader from '~/components/UiLoader'

type Props = UiButtonProps & {
  // @TODO We need to remove this. UiButtonProps already has this
  //  but for some reason our typcheck won't work without this.
  disabled?: boolean
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