import './style.css'
import * as React from 'react'
import cx from 'classnames'

interface OwnProps {
  variant?: 'default' | 'primary'
}

type Props = OwnProps & React.ButtonHTMLAttributes<HTMLButtonElement> 

function UiButton(props: Props) {
  return (
    <div className="ui-button">
      {props.children}
    </div>
  )
}

export default UiButton