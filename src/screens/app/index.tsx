import * as React from 'react'
import './style'

function App(props: ReactComponentWrapper) {
  console.log('tite', props)
  return (
    <React.Fragment>
      <div className="main-heading">
        <div className="action">
          &nbsp;
        </div>

        <div className="logo">Care.tv</div>

        <div className="action">
          <img className="ui-avatar" src="https://caretv.sgp1.digitaloceanspaces.com/app-pulse/user-avatars/qHp1NtCQ2YbbD1tL.jpg" alt="Avatar" />
        </div>
      </div>

      {props.children}
    </React.Fragment>
  )
}

export default App