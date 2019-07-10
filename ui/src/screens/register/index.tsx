import './style'

import * as React from 'react'
import UiNavigation from '~/components/UiNavigation'
import UiFormGroup from '~/components/UiFormGroup'
import UiInput from '~/components/UiInput'
import UiFormSpacer from '~/components/UiFormSpacer'
import UiSpacer from '~/components/UiSpacer'
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
import { useQueryParam, StringParam } from 'use-query-params'

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

interface FormState {
  email: string,
  name: string,
  password: string,
  password_confirmation: string,
  request_access_code: string
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

  const [initialRequestAccessCode] = useQueryParam('request_access_code', StringParam)

  const form = useFormState<FormState>(() => ({
    email: '',
    name: '',
    password: '',
    password_confirmation: '',
    request_access_code: initialRequestAccessCode || ''
  }))

  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    if (state.isLoading) {
      return
    }

    dispatch({ type: 'request' })

    const [err] = await axios.post('/api/register', form.state)

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
        <UiNavigation.BackAction to="/" />

        <UiNavigation.Title>
          Create a new account
        </UiNavigation.Title>

        <UiNavigation.Action />
      </UiNavigation>

      <UiContainer size="sm">
        <div className="registration-container">
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

            <UiFormGroup label="Request Access Code" hint={<span>Care.tv is a <strong>personal</strong> streaming platform. Please ask me directly for this.</span>}>
              <UiInput type="text" placeholder="XXXXX-XXXXX" name="request_access_code" value={form.state.request_access_code} onChange={form.set('request_access_code')} />
            </UiFormGroup>

            <UiSpacer size={3} />

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
        </div>
      </UiContainer>
    </React.Fragment>
  )
}

export default Register