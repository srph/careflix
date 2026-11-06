import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '~/contexts/Auth'

export default function PrivateRoute() {
  const location = useLocation()
  return useAuth().isAuthenticated ? <Outlet /> : <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
}
