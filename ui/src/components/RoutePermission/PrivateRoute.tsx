import * as React from 'react'
import { useUnstated } from '@gitbook/unstated'
import { AuthContainer } from '~/containers'
import { Route, Redirect } from 'react-router-dom'
import { RouteProps } from 'react-router'

function PrivateRoute({ component, render, ...rest }: RouteProps) {
  const Component = this.props.component
  const auth = useUnstated(AuthContainer)

  return (
    <Route {...rest} render={(props) => (
      auth.isAuthenticated()
        ? (Component ? <Component {...props}  /> : render(props))
        : <Redirect to='/login' />
    )} />
  )
}

export default PrivateRoute