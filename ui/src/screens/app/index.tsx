import './style'

import * as React from 'react'
import InvitationModal from './InvitationModal'
import AppHeading from './AppHeading'

import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'

function App(props: ReactComponentWrapper) {
  const auth = useUnstated(AuthContainer)

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