
import * as React from 'react'
import { AppInvitationModal } from './app-invitation-modal/app-invitation-modal'
import { InvitationOverlayProvider } from './app-invitation-modal/app-invitation-modal-context'
import { AppHeading } from './app-heading'

import { useCallback } from 'react'
import { usePusher } from '~/hooks/use-pusher'
import { useAuth } from '~/contexts/auth/auth'

export function AppPage(props: ReactComponentWrapper) {
  const auth = useAuth()

  const noop = useCallback(() => {}, [])

  // We don't really care about `random-event`, we just want to subscribe to `presence-chat`.
  usePusher('presence-chat', 'random-event', noop, auth.isGuest)

  return (
    <InvitationOverlayProvider>
      {auth.isAuthenticated && (
        <React.Fragment>
          <AppHeading />
          <AppInvitationModal key={auth.data.id} />
        </React.Fragment>
      )}
      
      {props.children}
    </InvitationOverlayProvider>
  )
}
