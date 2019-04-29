import './style.css'
import * as React from 'react'

interface Props {
  children?: React.ReactNode
}

function UiDummy(props: Props) {
  return (
    <div className="ui-spacer">
      {props.children}
    </div>
  )
}

export default UiDummy