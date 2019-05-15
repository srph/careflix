import * as React from 'react'
import GuestHome from './GuestHome'
import AuthHome from './AuthHome'

import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'


function AppHome() {
  const auth = useUnstated(AuthContainer)

  if (auth.isGuest()) {
    return <GuestHome />
  }

  return <AuthHome />
}

export default AppHome