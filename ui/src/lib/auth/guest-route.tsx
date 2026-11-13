import { Navigate, Outlet } from 'react-router'
import { useAuth } from './auth-queries'

export function GuestRoute() {
  return useAuth().status === 'authenticated' ? <Navigate to="/" replace /> : <Outlet />
}
