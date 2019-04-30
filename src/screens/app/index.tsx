import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import InvitationModal from './InvitationModal'
import { Link } from 'react-router-dom'

function App(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <div className="main-heading">
        <div className="action">
          &nbsp;
        </div>

        <div className="logo">
          <Link to="/">Care.tv</Link>
        </div>

        <div className="action">
          <Link to="/settings">
            <UiAvatar img="https://caretv.sgp1.digitaloceanspaces.com/app-pulse/user-avatars/qHp1NtCQ2YbbD1tL.jpg" />
          </Link>
        </div>
      </div>

      <InvitationModal />

      {props.children}
    </React.Fragment>
  )
}

export default App