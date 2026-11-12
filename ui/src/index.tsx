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
import { AppPage } from '~/screens/app/app-page'
import { AppHomePage } from '~/screens/app.home/app-home-page'
import { AppWatchPage } from '~/screens/app.watch/app-watch-page'
import { AppWatchHomePage } from '~/screens/app.watch.home/app-watch-home-page'
import { AppSettingsPage } from '~/screens/app.settings/app-settings-page'
import { AppSettingsProfilePage } from '~/screens/app.settings-profile/app-settings-profile-page'
import { AppSettingsFaqPage } from '~/screens/app.settings-faq/app-settings-faq-page'
import { AppDownloadPage } from '~/screens/app.download/app-download-page'
import { LoginPage } from '~/screens/login/login-page'
import { LogoutPage } from '~/screens/logout/logout-page'
import { AuthCallbackPage } from '~/screens/auth.callback/auth-callback-page'
import { OnboardingPage } from '~/screens/onboarding/onboarding-page'

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
  return <QueryProvider><PusherManager><AppPage><Outlet /></AppPage></PusherManager></QueryProvider>
}

const router = createBrowserRouter([{
  element: <RootLayout />,
  children: [
    { element: <GuestRoute />, children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <Navigate to="/login" replace /> },
    ] },
    { path: '/auth/callback', element: <AuthCallbackPage /> },
    { path: '/onboarding', element: <OnboardingPage /> },
    { path: '/request-access', element: <Navigate to="/onboarding" replace /> },
    { path: '/logout', element: <LogoutPage /> },
    { element: <ApplicationLayout />, children: [
      { path: '/', element: <AppHomePage /> },
      { path: '/download', element: <AppDownloadPage /> },
      { element: <PrivateRoute />, children: [
        { path: '/settings', element: <AppSettingsPage /> },
        { path: '/settings/profile', element: <AppSettingsProfilePage /> },
        { path: '/settings/password', element: <Navigate to="/settings" replace /> },
        { path: '/settings/faq', element: <AppSettingsFaqPage /> },
        { path: '/watch/:partyId', element: <AppWatchPage><AppWatchHomePage /></AppWatchPage> },
      ] },
      // The previous router kept the app shell for unmatched URLs.
      { path: '*', element: null },
    ] },
  ],
}])

createRoot(document.getElementById('mount')!).render(<RouterProvider router={router} />)
