import './style'

import * as React from 'react'
import UiNavigation from '~/components/UiNavigation'
import UiFormGroup from '~/components/UiFormGroup'
import UiInput from '~/components/UiInput'
import UiFormSpacer from '~/components/UiFormSpacer'
import UiContainer from '~/components/UiContainer'
import UiButton from '~/components/UiButton'
import { Link } from 'react-router-dom'

/**
 * Use this to create a route instead of typing everything down
 */
function Login(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <UiNavigation>
        <UiNavigation.Action to="/">
          <i className='fa fa-angle-left' />
        </UiNavigation.Action>

        <UiNavigation.Title>
          Create a new account
        </UiNavigation.Title>

        <UiNavigation.Action />
      </UiNavigation>

      <UiContainer>
        <div className="registration-image">
          <img src={require('~/assets/register-img.svg')} />
        </div>

        <h1 className="registration-title">Join in the fun!</h1>

        <UiFormGroup label="Email">
          <UiInput type="email" placeholder="johndoe@email.com" name="email" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiFormGroup label="Name">
          <UiInput placeholder="johndoe" name="name" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiFormGroup label="Password">
          <UiInput type="password" placeholder="********" name="password" />
        </UiFormGroup>

        <UiFormSpacer />

        <UiFormGroup label="Confirm Password">
          <UiInput type="password" placeholder="********" name="password_confirmation" />
        </UiFormGroup>

        <UiFormSpacer />

        <div className="registration-action">
          <UiButton variant="primary" block size="l">
            Register
          </UiButton>
        </div>


        <div className="registration-byline">
          <h5 className="ui-subheading">
            Existing user? <Link to="/login">Sign in</Link>
          </h5>
        </div>
      </UiContainer>
    </React.Fragment>
  )
}

export default Login