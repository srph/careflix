import * as React from 'react'
import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'
import { Route, Redirect } from 'react-router-dom'
import { RouteProps } from 'react-router'

function GuestRoute({ component, render, ...rest }: RouteProps) {
  const Component = this.props.component
  const auth = useUnstated(AuthContainer)

  return (
    <Route {...rest} render={(props) => (
      auth.isGuest()
      ? (Component ? <Component {...props}  /> : render(props))
        : <Redirect to='/' />
    )} />
  )
}

export default GuestRoute