import { Navigate, Outlet } from 'react-router'
import { useAuth } from '~/contexts/Auth'

export function GuestRoute() {
  return useAuth().isGuest ? <Outlet /> : <Navigate to="/" replace />
}
