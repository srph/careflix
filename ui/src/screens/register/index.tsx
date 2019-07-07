import './style'

import * as React from 'react'
import UiNavigation from '~/components/UiNavigation'
import UiFormGroup from '~/components/UiFormGroup'
import UiInput from '~/components/UiInput'
import UiFormSpacer from '~/components/UiFormSpacer'
import UiContainer from '~/components/UiContainer'
import UiButtonLoader from '~/components/UiButtonLoader'
import { Link } from 'react-router-dom'
import Helmet from 'react-helmet'

import axios from '~/lib/axios'
import history from '~/lib/history'
import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'
import useFormState from '~/hooks/useFormState'
import { toast } from '~/components/Toast'

const reducer = (state, action) => {
  switch(action.type) {
    case 'request': {
      return {
        ...state,
        isLoading: true,
        isError: false
      }
    }

    case 'success': {
      return {
        ...state,
        isLoading: false
      }
    }

    case 'error': {
      return {
        ...state,
        isLoading: false,
        isError: true
      }
    }
  }

  return state
}

/**
 * Use this to create a route instead of typing everything down
 */
function Register(props: ReactComponentWrapper) {
  const auth = useUnstated(AuthContainer)

  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: false,
    isError: false
  })

  const form = useFormState({
    email: '',
    name: '',
    password: '',
    password_confirmation: ''
  })

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    if (state.isLoading) {
      return
    }

    dispatch({ type: 'request' })

    const [err] = await axios.post('/api/register', {
      email: form.state.email,
      name: form.state.name,
      password: form.state.password,
      password_confirmation: form.state.password_confirmation
    })

    if (err) {
      return dispatch({ type: 'error' })
    }

    const [err2] = await auth.login({
      username: form.state.email,
      password: form.state.password
    })

    if (err2) {
      return dispatch({ type: 'error' })
    }

    toast('Your account was created successfully!')
    
    dispatch({ type: 'success' })

    history.push('/')
  }

  return (
    <React.Fragment>
      <Helmet title="Create a new account" />

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

        <form onSubmit={handleSubmit}>
          <UiFormGroup label="Email">
            <UiInput type="email" placeholder="johndoe@email.com" name="email" value={form.state.email} onChange={form.set('email')} />
          </UiFormGroup>

          <UiFormSpacer />

          <UiFormGroup label="Name">
            <UiInput placeholder="johndoe" name="name" value={form.state.name} onChange={form.set('name')} />
          </UiFormGroup>

          <UiFormSpacer />

          <UiFormGroup label="Password">
            <UiInput type="password" placeholder="********" name="password" value={form.state.password} onChange={form.set('password')} />
          </UiFormGroup>

          <UiFormSpacer />

          <UiFormGroup label="Confirm Password">
            <UiInput type="password" placeholder="********" name="password_confirmation" value={form.state.password_confirmation} onChange={form.set('password_confirmation')} />
          </UiFormGroup>

          <UiFormSpacer />

          <div className="registration-action">
            <UiButtonLoader variant="primary" block size="l" isLoading={state.isLoading}>
              Register
            </UiButtonLoader>
          </div>

          <div className="registration-byline">
            <h5 className="ui-subheading">
              Existing user? <Link to="/login">Sign in</Link>
            </h5>
          </div>
        </form>
      </UiContainer>
    </React.Fragment>
  )
}

export default Register