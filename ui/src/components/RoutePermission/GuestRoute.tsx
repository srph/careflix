import * as React from 'react'
import { useAuth } from '~/contexts/Auth'
import { Route, Redirect } from 'react-router-dom'
import { RouteProps } from 'react-router'

function GuestRoute({ component: Component, render, ...rest }: RouteProps) {
  const auth = useAuth()

  return (
    <Route {...rest} render={(props) => (
      auth.isGuest
      ? (Component ? <Component {...props}  /> : render(props))
        : <Redirect to='/' />
    )} />
  )
}

export default GuestRoute