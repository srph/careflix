import * as React from 'react'
import Login from '~/screens/login'
import AuthHome from './AuthHome'
import { useAuth } from '~/contexts/Auth'

function AppHome() {
  const auth = useAuth()
  return auth.isGuest ? <Login /> : <AuthHome />
}

export default AppHome
