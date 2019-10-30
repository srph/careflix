import './style.css'
import * as React from 'react'
import asset_logo from './logo.svg'

function UiLogo() {
  return (
    <div className="ui-logo">
      <img src={asset_logo} />
    </div>
  )
}

export default UiLogo