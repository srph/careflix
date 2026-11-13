import * as React from 'react'
import { LoginPage } from '~/screens/login/login-page'
import { AppHomeAuth } from './app-home-auth'
import { useAuth } from '~/lib/auth/auth-queries'

export function AppHomePage() {
  const auth = useAuth()
  return auth.status === 'authenticated' ? <AppHomeAuth /> : <LoginPage />
}
