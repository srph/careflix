import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface OwnProps {
  variant?: 'default' | 'primary'
}

type Props = OwnProps & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

function UiButton(props: Props) {
  return (
    <button {...props} className={cx("ui-button", {
      'is-primary': props.variant === 'primary'
    })}>
      {props.children}
    </button>
  )
}

export default UiButton