import './style.css'
import * as React from 'react'
import asset_loader from '~/assets/loader.svg'

/**
 * @source https://projects.lukehaas.me/css-loaders/
 */
function UiLoader() {
  return (
    <div className="ui-loader">
      <img src={asset_loader} alt="Loading..." />
    </div>
  )
}

export default UiLoader