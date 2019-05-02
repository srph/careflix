import './style'

import * as React from 'react'
import UiNavigation from '~/components/UiNavigation'
import UiFormGroup from '~/components/UiFormGroup'
import UiInput from '~/components/UiInput'
import UiFormSpacer from '~/components/UiFormSpacer'
import UiContainer from '~/components/UiContainer'
import UiButton from '~/components/UiButton'
import { Link } from 'react-router-dom'

function Login(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <UiNavigation>
        <UiNavigation.Action>
          <i className='fa fa-angle-left' />
        </UiNavigation.Action>

        <UiNavigation.Title>
          Welcome Back
        </UiNavigation.Title>

        <UiNavigation.Action />
      </UiNavigation>

      <UiContainer>
        <div className="login-image">
          <img src={require('~/assets/login-img.svg')} />
        </div>

        <h1 className="login-title">Watch. Together.</h1>

        <UiFormGroup label="Email">
          <UiInput type="email" placeholder="johndoe" name="email" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiFormGroup label="Password">
          <UiInput type="password" placeholder="********" name="password" />
        </UiFormGroup>

        <UiFormSpacer />

        <div className="login-action">
          <UiButton variant="primary" block size="l">
            Login
          </UiButton>
        </div>

        <div className="login-byline">
          <h5 className="ui-subheading">
            New here? <Link to="/register">Sign up</Link>
          </h5>
        </div>
      </UiContainer>
    </React.Fragment>
  )
}

export default Login