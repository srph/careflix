import * as React from 'react'
import './style'

/**
 * Use this to create a route instead of typing everything down
 */
function DummyRoute(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      {props.children}
    </React.Fragment>
  )
}

export default DummyRoute