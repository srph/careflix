import * as React from 'react'

/** Phones stack the picture, title bar and chat. From `sm` the picture fills the window and the sidebar slides in beside it. */
export function AppWatchHomeShell(props: ReactComponentWrapper) {
  return (
    <div className="flex h-(--window-vh) w-screen flex-col overflow-hidden sm:relative sm:flex-row">
      {props.children}
    </div>
  )
}
