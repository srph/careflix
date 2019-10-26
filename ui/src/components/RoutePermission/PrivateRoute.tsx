import * as React from 'react'
import { useAuth } from '~/contexts/Auth'
import { Route, Redirect } from 'react-router-dom'
import { RouteProps } from 'react-router'

function PrivateRoute({ component: Component, render, ...rest }: RouteProps) {
  const auth = useAuth()

  return (
    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated ? Component ? <Component {...props} /> : render(props) : <Redirect to="/login" />
      }
    />
  )
}

export default PrivateRoute
