import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiNavigation from '~/components/UiNavigation'
import InvitationModal from './InvitationModal'
import { Link } from 'react-router-dom'

function App(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <UiNavigation>
        <UiNavigation.Action />

        <UiNavigation.Logo />

        <UiNavigation.Action>
          <Link to="/settings">
            <UiAvatar img="https://caretv.sgp1.digitaloceanspaces.com/app-pulse/user-avatars/qHp1NtCQ2YbbD1tL.jpg" />
          </Link>
        </UiNavigation.Action>
      </UiNavigation>

      <InvitationModal />

      {props.children}
    </React.Fragment>
  )
}

export default App