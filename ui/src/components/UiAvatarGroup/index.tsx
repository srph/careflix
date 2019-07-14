import './style.css'
import * as React from 'react'
import cx from 'classnames'
import UiAvatar from '~/components/UiAvatar'

interface Props {
  images: string[]
  size?: 'sm' | 'm' | 'l' | 'xl'
}

function UiAvatarGroup(props: Props) {
  return (
    <div className={cx('ui-avatar-group', {
      'is-sm': props.size === 'sm',
      'is-m': props.size === 'm',
      'is-l': props.size === 'l',
      'is-xl': props.size === 'xl'
    })}>
      {props.images.slice(0, 4).map((image, i) =>
        <div className="avatar" key={i}>
          <UiAvatar img={image} />
        </div>
      )}

      {props.images.length > 5 && <div className="more">
        <h6 className="ui-subheading">+{props.images.length - 5} more</h6>
      </div>}
    </div>
  )
}

export default UiAvatarGroup