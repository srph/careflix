import 'sanitize.css'
import 'font-awesome/css/font-awesome.css'
import './global.css'

import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { PrivateRoute, GuestRoute } from '~/components/RoutePermission'
import { Toast } from '~/components/Toast'
import { AuthProvider } from '~/contexts/Auth'
import { AxiosManager } from '~/lib/axios/AxiosManager'
import { PusherManager } from '~/lib/pusher/PusherManager'
import WindowVhSetter from '~/components/WindowVhSetter'
import App from '~/screens/app'
import AppHome from '~/screens/app.home'
import AppWatch from '~/screens/app.watch'
import AppWatchHome from '~/screens/app.watch.home'
import AppSettings from '~/screens/app.settings'
import AppSettingsProfile from '~/screens/app.settings-profile'
import AppSettingsPassword from '~/screens/app.settings-password'
import AppSettingsFaq from '~/screens/app.settings-faq'
import AppDownload from '~/screens/app.download'
import Login from '~/screens/login'
import Logout from '~/screens/logout'
import Register from '~/screens/register'

function RootLayout() {
  return (
    <>
      <WindowVhSetter />
      <AuthProvider>
        <PusherManager>
          <AxiosManager><Outlet /></AxiosManager>
        </PusherManager>
      </AuthProvider>
      <Toast />
    </>
  )
}

const router = createBrowserRouter([{
  element: <RootLayout />,
  children: [
    { element: <GuestRoute />, children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ] },
    { path: '/logout', element: <Logout /> },
    { element: <App><Outlet /></App>, children: [
      { path: '/', element: <AppHome /> },
      { path: '/download', element: <AppDownload /> },
      { element: <PrivateRoute />, children: [
        { path: '/settings', element: <AppSettings /> },
        { path: '/settings/profile', element: <AppSettingsProfile /> },
        { path: '/settings/password', element: <AppSettingsPassword /> },
        { path: '/settings/faq', element: <AppSettingsFaq /> },
        { path: '/watch/:partyId', element: <AppWatch><AppWatchHome /></AppWatch> },
      ] },
      // The previous router kept the app shell for unmatched URLs.
      { path: '*', element: null },
    ] },
  ],
}])

createRoot(document.getElementById('mount')!).render(<RouterProvider router={router} />)
