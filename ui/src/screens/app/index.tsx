import './style'

import * as React from 'react'
import InvitationModal from './InvitationModal'
import AppHeading from './AppHeading'

import { useCallback } from 'react'
import { usePusher } from '~/hooks/usePusher'
import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'

function App(props: ReactComponentWrapper) {
  const auth = useUnstated(AuthContainer)

  const noop = useCallback(() => {}, [])

  // We don't really care about `random-event`, we just want to subscribe to `presence-chat`.
  usePusher('presence-chat', 'random-event', noop, auth.isGuest())

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