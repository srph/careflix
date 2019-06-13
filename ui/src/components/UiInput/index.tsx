import './style.css'
import * as React from 'react'
import cx from 'classnames'

type HTMLProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>

interface OwnProps {
  isDark?: boolean
  isRound?: boolean
}

type Props = HTMLProps & OwnProps

function UiInput(props: Props) {
  return (
    <input {...props} className={cx('ui-input', {
      'is-dark': props.isDark,
      'is-round': props.isRound
    })} />
  )
}

export default UiInput