import './style.css'
import * as React from 'react'
import cx from 'classnames'

type HTMLProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>

interface OwnProps {
  isDark?: boolean
  isRound?: boolean
}

type Props = HTMLProps & OwnProps

function UiInput({ isDark, isRound, ...props }: Props, ref: React.MutableRefObject<HTMLInputElement>) {
  return (
    <input {...props} ref={ref} className={cx('ui-input', {
      'is-dark': isDark,
      'is-round': isRound
    })} />
  )
}

export default React.forwardRef(UiInput)