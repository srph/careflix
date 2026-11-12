import * as React from 'react'
import { LoginPage } from '~/screens/login/login-page'
import { AppHomeAuth } from './app-home-auth'
import { useAuth } from '~/contexts/auth/auth'

export function AppHomePage() {
  const auth = useAuth()
  return auth.isGuest ? <LoginPage /> : <AppHomeAuth />
}
