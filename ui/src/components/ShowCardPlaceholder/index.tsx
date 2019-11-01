import './style.css'
import * as React from 'react'
import StandardAspectRatioBox from '~/components/StandardAspectRatioBox'

function ShowCardPlaceholder() {
  return (
    <StandardAspectRatioBox className="c-show-card-placeholder">
      <div className="block"></div>
    </StandardAspectRatioBox>
  )
}

export default ShowCardPlaceholder