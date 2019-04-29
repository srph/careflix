import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'

function App(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <div className="main-heading">
        <div className="action">
          &nbsp;
        </div>

        <div className="logo">Care.tv</div>

        <div className="action">
          <UiAvatar img="https://caretv.sgp1.digitaloceanspaces.com/app-pulse/user-avatars/qHp1NtCQ2YbbD1tL.jpg" />
        </div>
      </div>

      {props.children}
    </React.Fragment>
  )
}

export default App