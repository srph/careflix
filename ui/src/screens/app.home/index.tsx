import * as React from 'react'
import GuestHome from './GuestHome'
import AuthHome from './AuthHome'
import { useAuth } from '~/contexts/Auth'

function AppHome() {
  const auth = useAuth()
  return auth.isGuest ? <GuestHome /> : <AuthHome />
}

export default AppHome
