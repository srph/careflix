import './global.css'
import 'sanitize.css'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { Router, Route, Switch } from 'react-router-dom'
import history from '~/lib/history'

import App from '~/screens/app'
import AppHome from '~/screens/app.home'
import AppWatch from '~/screens/app.watch'

function Mount() {
  return (
    <React.Fragment>
      <Router history={history}>
        <Switch>
          <Route path="/" render={() => (
            <App>
              <Switch>
                <Route path="/" exact component={AppHome} />
                <Route path="/watch/:id" exact component={AppWatch} />
              </Switch>
            </App>
          )} />
        </Switch>
      </Router>
    </React.Fragment>
  )
}

ReactDOM.render(
  <Mount />,
  document.getElementById('mount')
)