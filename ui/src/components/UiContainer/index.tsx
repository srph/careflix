import './style.css'
import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

function UiContainer(props: Props) {
  return (
    <div className="ui-container">
      {props.children}
    </div>
  )
}

export default UiContainer