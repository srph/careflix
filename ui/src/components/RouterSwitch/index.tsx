import * as React from 'react'
import { Switch } from 'react-router-dom'
// import Error404 from './Error404'

interface Props {
  children: React.ReactNode
}

/**
 * - Drills down the props (Switch doesn't).
 * - Provides an error 404 out of the box.
 */
class RouterSwitch extends React.Component<Props, {}> {
  render() {
    const {children, ...rest} = this.props

    return (
      <Switch>
        {React.Children.map(children, (child: any) =>
          React.cloneElement(child, rest)
        )}

        {/* <Route component={Error404} /> */}
      </Switch>
    )
  }
}

export default RouterSwitch