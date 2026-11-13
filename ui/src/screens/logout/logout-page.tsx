import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { logout } from '~/lib/auth/session'

export function LogoutPage(): null {
  const navigate = useNavigate()

  useEffect(() => {
    void logout()
    navigate('/login', { replace: true })
  }, [])

  return null
}
