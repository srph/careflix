import './global.css'
import 'sanitize.css'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { url } from 'inspector';

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

      {Array(10).fill(0).map((category, i) =>
        <div className="show-list" key={i}>
          <h5 className="ui-subheading">
            New Releases
          </h5>

          <div className="show-carousel">
            <div className="inner">
              {Array(10).fill(0).map((show, j) =>
                <div className="card" key={j}>
                  <div className="show-carousel-card" style={{ backgroundImage: `url(${require('~/assets/show-thumbnail-218x146.jpg')})` }}>
                    <div className="overlay" />

                    <div className="details">
                      <div className="tags">
                        <span className="tag">
                          2018
                        </span>

                        <span className="tag">
                        •
                        </span>

                        <span className="tag">
                          Anime
                        </span>
                      </div>

                      <h3 className="title">
                        My Hero Academia
                      </h3>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

ReactDOM.render(
  <App />,
  document.getElementById('mount')
)