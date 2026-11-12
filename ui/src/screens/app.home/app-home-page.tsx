import * as React from 'react'
import Login from '~/screens/login'
import { AppHomeAuth } from './app-home-auth'
import { useAuth } from '~/contexts/auth/auth'

export function AppHomePage() {
  const auth = useAuth()
  return auth.isGuest ? <Login /> : <AppHomeAuth />
}
