import * as React from 'react'

/**
 * Use this to create a route instead of typing everything down
 */
export function DummyRoutePage(props: ReactComponentWrapper) {
  return <React.Fragment>{props.children}</React.Fragment>
}
