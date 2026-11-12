import { useEffect } from 'react'
import { useAuth } from '~/contexts/auth/auth'

export function LogoutPage(): null {
  const auth = useAuth()

  useEffect(() => {
    auth.logout()
  }, [])

  return null
}
