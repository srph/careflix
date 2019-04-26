import './global.css'
import 'sanitize.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

function App() {
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

      <div className="show-list">
        <h5 className="ui-subheading">
          New Releases
        </h5>

        <div className="show-carousel">
          <div className="inner">
            <div className="card">
              <div className="show-carousel-card">
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('mount')
)