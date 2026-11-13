import './tailwind.css'

import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, Outlet } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { PrivateRoute } from '~/lib/auth/private-route'
import { GuestRoute } from '~/lib/auth/guest-route'
import { Toast } from '~/components/toast/toast'
import { AuthBoundary } from '~/lib/auth/auth-boundary'
import { useAuth } from '~/lib/auth/auth-queries'
import { queryClient } from '~/lib/query/client'
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
      <QueryClientProvider client={queryClient}>
        <AxiosManager>
          <AuthBoundary>
            <Outlet />
          </AuthBoundary>
        </AxiosManager>
      </QueryClientProvider>
      <Toast />
    </>
  )
}

function ApplicationLayout() {
  const { user } = useAuth()
  // Another account starts the app over: no state carried across. Sign-in and logout clear the queries.
  return (
    <PusherManager key={user?.id ?? 'guest'}>
      <AppPage>
        <Outlet />
      </AppPage>
    </PusherManager>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          { path: '/login', element: <LoginPage /> },
          { path: '/register', element: <Navigate to="/login" replace /> }
        ]
      },
      { path: '/auth/callback', element: <AuthCallbackPage /> },
      { path: '/onboarding', element: <OnboardingPage /> },
      { path: '/request-access', element: <Navigate to="/onboarding" replace /> },
      { path: '/logout', element: <LogoutPage /> },
      {
        element: <ApplicationLayout />,
        children: [
          { path: '/', element: <AppHomePage /> },
          { path: '/download', element: <AppDownloadPage /> },
          {
            element: <PrivateRoute />,
            children: [
              { path: '/settings', element: <AppSettingsPage /> },
              { path: '/settings/profile', element: <AppSettingsProfilePage /> },
              { path: '/settings/password', element: <Navigate to="/settings" replace /> },
              { path: '/settings/faq', element: <AppSettingsFaqPage /> },
              {
                path: '/watch/:partyId',
                element: (
                  <AppWatchPage>
                    <AppWatchHomePage />
                  </AppWatchPage>
                )
              }
            ]
          },
          // The previous router kept the app shell for unmatched URLs.
          { path: '*', element: null }
        ]
      }
    ]
  }
])

createRoot(document.getElementById('mount')!).render(<RouterProvider router={router} />)
