import 'sanitize.css'
import 'font-awesome/css/font-awesome.css'
import './global.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import { PrivateRoute, GuestRoute } from '~/components/RoutePermission'
import history from '~/lib/history'
import { GatewayProvider } from 'react-gateway'

import App from '~/screens/app'
import AppHome from '~/screens/app.home'
import AppWatch from '~/screens/app.watch'
import AppWatchHome from '~/screens/app.watch.home'
import AppWatchInvite from '~/screens/app.watch.invite'
import AppSettings from '~/screens/app.settings'
import AppSettingsProfile from '~/screens/app.settings-profile'
import AppSettingsPassword from '~/screens/app.settings-password'
import Login from '~/screens/login'
import Logout from '~/screens/logout'
import Register from '~/screens/register'
import Helmet from 'react-helmet'

import { useAsyncEffect } from 'use-async-effect'
import { Provider as UnstatedProvider, useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'

function Root(props: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true)

  const auth: typeof AuthContainer = useUnstated(AuthContainer)

  useAsyncEffect(async () => {
    const [err] = await auth.getUserData()
    
    if (err) {
      throw err
    }

    setIsLoading(false)
  }, null, [])

  return isLoading ? <div /> : props.children
}

function Mount() {
  return (
    <React.Fragment>
      <Helmet titleTemplate="%s - Care.tv" />

      <GatewayProvider>
        <UnstatedProvider>
          <Root>
            <Router history={history}>
              <Switch>
                <GuestRoute path="/login" exact component={Login} />
                <GuestRoute path="/register" exact component={Register} />
                <Route path="/logout" exact component={Logout} />
                
                <Route path="/" render={() => (
                  <App>
                    <Switch>
                      <Route path="/" exact component={AppHome} />
                      <PrivateRoute path="/settings" exact component={AppSettings} />
                      <PrivateRoute path="/settings/profile" exact component={AppSettingsProfile} />
                      <PrivateRoute path="/settings/password" exact component={AppSettingsPassword} />
                      <PrivateRoute path="/watch/:partyId" render={(matchProps) => (
                        <AppWatch {...matchProps}>
                          <Route path="/watch/:partyId" exact component={AppWatchHome} />
                          <Route path="/watch/:partyId/invite" exact component={AppWatchInvite} />
                        </AppWatch>
                      )} />
                    </Switch>
                  </App>
                )} />
              </Switch>
            </Router>
          </Root>
        </UnstatedProvider>
      </GatewayProvider>
    </React.Fragment>
  )
}

ReactDOM.render(
  <Mount />,
  document.getElementById('mount')
)