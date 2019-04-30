import './style.css'
import * as React from 'react'

type Props = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'>

function UiButton(props: Props) {
  return (
    <button {...props} className="ui-plain-button">
      {props.children}
    </button>
  )
}

export default UiButton