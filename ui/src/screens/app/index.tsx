import './style'

import * as React from 'react'
import InvitationModal from './InvitationModal'
import AppHeading from './AppHeading'

import { usePusherPurePresence } from '~/hooks/usePusherPurePresence'
import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'

function App(props: ReactComponentWrapper) {
  const auth = useUnstated(AuthContainer)

  usePusherPurePresence('presence-chat', auth.isGuest())

  return (
    <React.Fragment>
      {auth.isAuthenticated() && (
        <React.Fragment>
          <AppHeading />
          <InvitationModal />
        </React.Fragment>
      )}
      
      {props.children}
    </React.Fragment>
  )
}

export default App