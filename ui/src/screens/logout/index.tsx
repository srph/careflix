import { useEffect } from 'react'
import { useAuth } from '~/contexts/auth/auth'

function Logout() {
  const auth = useAuth()

  useEffect(() => {
    auth.logout()
  }, [])

  return null
}

export default Logout