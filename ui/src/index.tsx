import './tailwind.css'

import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { PrivateRoute } from '~/components/private-route/private-route'
import { GuestRoute } from '~/components/guest-route/guest-route'
import { Toast } from '~/components/toast/toast'
import { AuthProvider } from '~/contexts/auth/auth'
import { QueryProvider } from '~/lib/query/query-provider'
import { AxiosManager } from '~/lib/axios/axios-manager'
import { PusherManager } from '~/lib/pusher/pusher-manager'
import { WindowVhSetter } from '~/components/window-vh-setter/window-vh-setter'
import App from '~/screens/app'
import { AppHomePage } from '~/screens/app.home/app-home-page'
import AppWatch from '~/screens/app.watch'
import { AppWatchHomePage } from '~/screens/app.watch.home/app-watch-home-page'
import AppSettings from '~/screens/app.settings'
import AppSettingsProfile from '~/screens/app.settings-profile'
import AppSettingsFaq from '~/screens/app.settings-faq'
import AppDownload from '~/screens/app.download'
import Login from '~/screens/login'
import Logout from '~/screens/logout'
import AuthCallback from '~/screens/auth.callback'
import Onboarding from '~/screens/onboarding'

function RootLayout() {
  return (
    <>
      <WindowVhSetter />
      <AuthProvider>
        <AxiosManager><Outlet /></AxiosManager>
      </AuthProvider>
      <Toast />
    </>
  )
}

function ApplicationLayout() {
  return <QueryProvider><PusherManager><App><Outlet /></App></PusherManager></QueryProvider>
}

const router = createBrowserRouter([{
  element: <RootLayout />,
  children: [
    { element: <GuestRoute />, children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Navigate to="/login" replace /> },
    ] },
    { path: '/auth/callback', element: <AuthCallback /> },
    { path: '/onboarding', element: <Onboarding /> },
    { path: '/request-access', element: <Navigate to="/onboarding" replace /> },
    { path: '/logout', element: <Logout /> },
    { element: <ApplicationLayout />, children: [
      { path: '/', element: <AppHomePage /> },
      { path: '/download', element: <AppDownload /> },
      { element: <PrivateRoute />, children: [
        { path: '/settings', element: <AppSettings /> },
        { path: '/settings/profile', element: <AppSettingsProfile /> },
        { path: '/settings/password', element: <Navigate to="/settings" replace /> },
        { path: '/settings/faq', element: <AppSettingsFaq /> },
        { path: '/watch/:partyId', element: <AppWatch><AppWatchHomePage /></AppWatch> },
      ] },
      // The previous router kept the app shell for unmatched URLs.
      { path: '*', element: null },
    ] },
  ],
}])

createRoot(document.getElementById('mount')!).render(<RouterProvider router={router} />)
