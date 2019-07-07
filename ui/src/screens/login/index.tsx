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
import useFormState from '~/hooks/useFormState';

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

function Login(props: ReactComponentWrapper) {
  const auth = useUnstated(AuthContainer)

  const [state, dispatch] = React.useReducer(reducer, {
    isLoading: false,
    isError: false
  })

  const form = useFormState({
    username: '',
    password: ''
  })

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    if (state.isLoading) {
      return
    }

    dispatch({ type: 'request' })

    const [err] = await auth.login({
      username: form.state.username,
      password: form.state.password
    })

    if (err) {
      return dispatch({ type: 'error' })
    }
    
    dispatch({ type: 'success' })

    history.push('/')
  }

  return (
    <React.Fragment>
      <Helmet title="Welcome back" />
      
      <UiNavigation>
        <UiNavigation.Action to="/">
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

        <form onSubmit={handleSubmit}>
          <UiFormGroup label="Email">
            <UiInput value={form.state.username} onChange={form.set('username')} type="email" placeholder="johndoe" name="email" />
          </UiFormGroup>

          <UiFormSpacer />

          <UiFormGroup label="Password">
            <UiInput value={form.state.password} onChange={form.set('password')} type="password" placeholder="********" name="password" />
          </UiFormGroup>

          <UiFormSpacer />

          <div className="login-action">
            <UiButtonLoader variant="primary" block size="l" isLoading={state.isLoading}>
              Login
            </UiButtonLoader>
          </div>

          <div className="login-byline">
            <h5 className="ui-subheading">
              New here? <Link to="/register">Sign up</Link>
            </h5>
          </div>
        </form>
      </UiContainer>
    </React.Fragment>
  )
}

export default Login