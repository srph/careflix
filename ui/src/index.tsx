
import 'sanitize.css'
import 'font-awesome/css/font-awesome.css'
import './global.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import { Router, Route, Switch } from 'react-router-dom'
import { PrivateRoute, GuestRoute } from '~/components/RoutePermission'
import { QueryParamProvider } from 'use-query-params';
import history from '~/lib/history'

import { GatewayProvider } from 'react-gateway'
import { Toast } from '~/components/Toast'
import { AuthProvider } from '~/contexts/Auth'
import { AxiosManager } from '~/lib/axios/AxiosManager'
import { PusherManager } from '~/lib/pusher/PusherManager'
import WindowVhSetter from '~/components/WindowVhSetter'

import App from '~/screens/app'
import AppHome from '~/screens/app.home'
import AppWatch from '~/screens/app.watch'
import AppWatchHome from '~/screens/app.watch.home'
import AppSettings from '~/screens/app.settings'
import AppSettingsProfile from '~/screens/app.settings-profile'
import AppSettingsPassword from '~/screens/app.settings-password'
import AppSettingsFaq from '~/screens/app.settings-faq'
import AppDownload from '~/screens/app.download'
import Login from '~/screens/login'
import Logout from '~/screens/logout'
import Register from '~/screens/register'

function Mount() {
  return (
    <React.Fragment>
      <Helmet titleTemplate="%s - Care.tv" />

      <WindowVhSetter />

      <GatewayProvider>
          <Router history={history}>
            <QueryParamProvider ReactRouterRoute={Route}>
              <AuthProvider>
                <PusherManager>
                  <AxiosManager>
                    <Switch>
                      <GuestRoute path="/login" exact component={Login} />
                      <GuestRoute path="/register" exact component={Register} />
                      <Route path="/logout" exact component={Logout} />

                      <Route
                        path="/"
                        render={() => (
                          <App>
                            <Switch>
                              <Route path="/" exact component={AppHome} />
                              <Route path="/download" exact component={AppDownload} />
                              <PrivateRoute path="/settings" exact component={AppSettings} />
                              <PrivateRoute path="/settings/profile" exact component={AppSettingsProfile} />
                              <PrivateRoute path="/settings/password" exact component={AppSettingsPassword} />
                              <PrivateRoute path="/settings/faq" exact component={AppSettingsFaq} />
                              <PrivateRoute
                                path="/watch/:partyId"
                                render={matchProps => (
                                  <AppWatch {...matchProps}>
                                    <Route path="/watch/:partyId" exact component={AppWatchHome} />
                                  </AppWatch>
                                )}
                              />
                            </Switch>
                          </App>
                        )}
                      />
                    </Switch>
                  </AxiosManager>
                </PusherManager>
              </AuthProvider>
            </QueryParamProvider>
          </Router>
      </GatewayProvider>

      <Toast />
    </React.Fragment>
  )
}

ReactDOM.render(<Mount />, document.getElementById('mount'))
