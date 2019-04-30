import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface OwnProps {
  variant?: 'default' | 'primary'
  size?: 's' | 'l'
  block?: boolean
}

type Props = OwnProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

function UiButton({ variant, size, block, ...props }: Props) {
  return (
    <button {...props} className={cx("ui-button", {
      'is-primary': variant === 'primary',
      'is-block': block,
      'is-l': size === 'l',
    })}>
      {props.children}
    </button>
  )
}

export default UiButton