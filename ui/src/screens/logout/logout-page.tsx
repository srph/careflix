import { useEffect } from 'react'
import { useAuth } from '~/contexts/auth/auth'

export function LogoutPage() {
  const auth = useAuth()

  useEffect(() => {
    auth.logout()
  }, [])

  return null
}
