import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiNavigation from '~/components/UiNavigation'
import InvitationModal from './InvitationModal'
import { Link, Route, RouteComponentProps } from 'react-router-dom'

import GatewayDestWithFallback from '~/components/GatewayDestWithFallback'
import constants from './constants'

function App(props: ReactComponentWrapper) {
  return (
    <React.Fragment>
      <Route render={(routeProps: RouteComponentProps) => (
        routeProps.location.pathname !=='/' && <UiNavigation>
          <GatewayDestWithFallback name={constants.gateway.backUrl} fallback={<UiNavigation.Action />} />

          <GatewayDestWithFallback name={constants.gateway.title} fallback={<UiNavigation.Logo />} />

          <UiNavigation.Action to="settings">
            <UiAvatar img="https://caretv.sgp1.digitaloceanspaces.com/app-pulse/user-avatars/qHp1NtCQ2YbbD1tL.jpg" />
          </UiNavigation.Action>
        </UiNavigation>
      )} />

      <InvitationModal />

      {props.children}
    </React.Fragment>
  )
}

export default App