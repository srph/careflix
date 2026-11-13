import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './auth-queries'

export function PrivateRoute() {
  const location = useLocation()
  return useAuth().status === 'authenticated' ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
  )
}
