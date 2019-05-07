import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import UiNavigation from '~/components/UiNavigation'
import { Route } from 'react-router-dom'

import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'
import GatewayDestWithFallback from '~/components/GatewayDestWithFallback'
import constants from '../constants'

function AppHeading() {
  const auth = useUnstated(AuthContainer)

  return <Route render={() => (
    auth.isAuthenticated() && <UiNavigation>
      <GatewayDestWithFallback name={constants.gateway.backUrl} fallback={<UiNavigation.Action />} />

      <GatewayDestWithFallback name={constants.gateway.title} fallback={<UiNavigation.Logo />} />

      <UiNavigation.Action to="settings">
        <UiAvatar img="https://caretv.sgp1.digitaloceanspaces.com/app-pulse/user-avatars/qHp1NtCQ2YbbD1tL.jpg" />
      </UiNavigation.Action>
    </UiNavigation>
  )} />
}

export default AppHeading