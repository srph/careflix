import 'sanitize.css'
import 'font-awesome/css/font-awesome.css'
import './global.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
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
import Register from '~/screens/register'

function Mount() {
  return (
    <React.Fragment>
      <GatewayProvider>
        <Router history={history}>
          <Switch>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            
            <Route path="/" render={() => (
              <App>
                <Switch>
                  <Route path="/" exact component={AppHome} />
                  <Route path="/settings" exact component={AppSettings} />
                  <Route path="/settings/profile" exact component={AppSettingsProfile} />
                  <Route path="/settings/password" exact component={AppSettingsPassword} />
                  <Route path="/watch/:id" render={(matchProps) => (
                    <AppWatch {...matchProps}>
                      <Route path="/watch/:id" exact component={AppWatchHome} />
                      <Route path="/watch/:id/invite" exact component={AppWatchInvite} />
                    </AppWatch>
                  )} />
                </Switch>
              </App>
            )} />
          </Switch>
        </Router>
      </GatewayProvider>
    </React.Fragment>
  )
}

ReactDOM.render(
  <Mount />,
  document.getElementById('mount')
)