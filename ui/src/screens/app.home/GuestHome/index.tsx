import './style'

import * as React from 'react'
import UiContainer from '~/components/UiContainer'
import UiButton from '~/components/UiButton'
import UiLogo from '~/components/UiLogo'
import { Link } from 'react-router-dom'

function GuestHome() {
  return (
    <React.Fragment>
      <UiContainer>
        <div className="guest-home-logo">
          <UiLogo />
        </div>

        <div className="guest-home-image">
          <img src={require('~/assets/login-img.svg')} />
        </div>

        <h1 className="guest-home-title">Build the hype!</h1>

        <p className="guest-home-copy">Care.tv makes it really easy to enjoy movies or watch TV shows with the people you care about, no matter how far!</p>

        <div className="guest-home-action">
          <UiButton variant="primary" block size="l" link to="/login">
            Sign In
          </UiButton>
        </div>

        <div className="guest-home-byline">
          <h5 className="ui-subheading">
            <Link to="/register">Create a new account</Link>
          </h5>
        </div>
      </UiContainer>
    </React.Fragment>
  )
}

export default GuestHome