import './style.css'
import * as React from 'react'

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'>

function UiInput(props: Props) {
  return (
    <input {...props} className="ui-input" />
  )
}

export default UiInput