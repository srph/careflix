import './style.css'

import * as React from 'react'
import InvitationModal from './InvitationModal'
import { InvitationOverlayProvider } from './InvitationModal/Context'
import AppHeading from './AppHeading'

import { useCallback } from 'react'
import { usePusher } from '~/hooks/usePusher'
import { useAuth } from '~/contexts/Auth'

function App(props: ReactComponentWrapper) {
  const auth = useAuth()

  const noop = useCallback(() => {}, [])

  // We don't really care about `random-event`, we just want to subscribe to `presence-chat`.
  usePusher('presence-chat', 'random-event', noop, auth.isGuest)

  return (
    <InvitationOverlayProvider>
      {auth.isAuthenticated && (
        <React.Fragment>
          <AppHeading />
          <InvitationModal key={auth.data.id} />
        </React.Fragment>
      )}
      
      {props.children}
    </InvitationOverlayProvider>
  )
}

export default App