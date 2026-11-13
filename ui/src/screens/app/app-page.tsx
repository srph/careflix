import * as React from 'react'
import { AppInvitationModal } from './app-invitation-modal/app-invitation-modal'
import { InvitationOverlayProvider } from './app-invitation-modal/app-invitation-modal-context'
import { AppHeading } from './app-heading'

import { useCallback } from 'react'
import { usePusher } from '~/hooks/use-pusher'
import { useAuth } from '~/lib/auth/auth-queries'

export function AppPage(props: ReactComponentWrapper) {
  const auth = useAuth()

  const noop = useCallback(() => {}, [])

  // We don't really care about `random-event`, we just want to subscribe to `presence-chat`.
  usePusher('presence-chat', 'random-event', noop, auth.status !== 'authenticated')

  return (
    <InvitationOverlayProvider>
      {auth.status === 'authenticated' && (
        <React.Fragment>
          <AppHeading />
          <AppInvitationModal key={auth.user.id} />
        </React.Fragment>
      )}

      {props.children}
    </InvitationOverlayProvider>
  )
}
