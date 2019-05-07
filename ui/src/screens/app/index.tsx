import './style'

import * as React from 'react'
import InvitationModal from './InvitationModal'
import AppHeading from './AppHeading'

function App(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <AppHeading />
      <InvitationModal />
      {props.children}
    </React.Fragment>
  )
}

export default App