import './style.css'
import * as React from 'react'
import cx from 'classnames'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

function UiButton({ className, ...props }: Props) {
  return (
    <button {...props} className={cx('ui-plain-button', [className])}>
      {props.children}
    </button>
  )
}

export default UiButton
