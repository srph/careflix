import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '~/lib/auth/auth-queries'
import { getToken } from '~/lib/auth/session'
import { pusher } from './pusher'

/**
 * Setup the pusher instance
 */
function PusherManager({ children }: ReactComponentWrapper) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const { user } = useAuth()

  useEffect(() => {
    const token = user && getToken()
    if (token) {
      pusher.set(token)
      setIsInitialized(true)
    } else {
      pusher.unset()
      setIsInitialized(false)
    }

    return () => {
      pusher.unset()
    }
  }, [user?.id])

  // For guests, we'll just show the view. Otherwise, we'll wait for Pusher to be initialized.
  return <React.Fragment>{!user || isInitialized ? children : null}</React.Fragment>
}

export { PusherManager }
