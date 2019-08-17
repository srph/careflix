import './style.css'
import * as React from 'react'
import cx from 'classnames'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>

function UiPlainButton({ className, ...props }: Props, ref: React.MutableRefObject<HTMLButtonElement>) {
  return (
    <button {...props} ref={ref} className={cx('ui-plain-button', [className])}>
      {props.children}
    </button>
  )
}

export default React.forwardRef(UiPlainButton)
