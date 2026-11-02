import { Navigate, Outlet } from 'react-router'
import { useAuth } from '~/contexts/Auth'

export default function PrivateRoute() {
  return useAuth().isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}
