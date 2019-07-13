import './style.css'
import * as React from 'react'
import cx from 'classnames'
import asset_loader from '~/assets/loader.svg'

interface Props {
  size?: 'medium' | 'large'
}

/**
 * @source https://projects.lukehaas.me/css-loaders/
 */
function UiLoader(props: Props) {
  return (
    <div className={cx('ui-loader', { 'is-large': props.size === 'large' })}>
      <img src={asset_loader} alt="Loading..." />
    </div>
  )
}

export default UiLoader
