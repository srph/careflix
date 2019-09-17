import './style.css'
import * as React from 'react'
import cx from 'classnames'
import UiAvatar from '~/components/UiAvatar'
import UiPresenceAvatar from '~/components/UiPresenceAvatar'

import { AuthContainer } from '~/containers'
import { useUnstated } from '~/lib/unstated'

interface Props {
  users?: AppUser[] | AppPartyMember[]
  size?: 'sm' | 'm' | 'l' | 'xl'
}

function UiAvatarGroup(props: Props) {
  const auth = useUnstated(AuthContainer)

  return (
    <div
      className={cx('ui-avatar-group', {
        'is-sm': props.size === 'sm',
        'is-m': props.size === 'm',
        'is-l': props.size === 'l',
        'is-xl': props.size === 'xl'
      })}>
      {props.users.slice(0, 4).map((user, i) => (
        <div className="avatar" key={i}>
          {auth.state.data.id !== user.id && ('pivot' in user) ? (
            <UiPresenceAvatar user={user} isActive={(user as AppPartyMember).pivot.is_active} />
          ) : (
            <UiAvatar user={user} />
          )}
        </div>
      ))}

      {props.users.length > 5 && (
        <div className="more">
          <h6 className="ui-subheading">+{props.users.length - 5} more</h6>
        </div>
      )}
    </div>
  )
}

export default UiAvatarGroup
