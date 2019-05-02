import './style'

import * as React from 'react'
import GuestHome from './GuestHome'

function AppHome() {
  return <GuestHome />
  
  return (
    <React.Fragment>
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

export default AppHome