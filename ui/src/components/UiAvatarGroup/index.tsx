import './style.css'
import * as React from 'react'
import cx from 'classnames'
import UiAvatar from '~/components/UiAvatar'

interface Props {
  users?: AppUser[]
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
      {props.users.slice(0, 4).map((user, i) =>
        <div className="avatar" key={i}>
          <UiAvatar user={user} />
        </div>
      )}

      {props.users.length > 5 && <div className="more">
        <h6 className="ui-subheading">+{props.users.length - 5} more</h6>
      </div>}
    </div>
  )
}

export default UiAvatarGroup