import './style.css'
import * as React from 'react'

function UiShowCardDetailText(props: ReactComponentWrapper) {
  return (
    <span className="ui-show-card-detail-text">
      {props.children}
    </span>
  )
}

export default UiShowCardDetailText