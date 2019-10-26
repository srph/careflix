import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '~/contexts/Auth'
import pusher from './'

/**
 * Setups the pusher instance
 */
function PusherManager({ children }: ReactComponentWrapper) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const auth = useAuth()

  useEffect(() => {
    if (auth.token) {
      pusher.set(auth)
      setIsInitialized(true)
    } else {
      pusher.unset()
      setIsInitialized(false)
    }

    return () => {
      pusher.unset()
    }
  }, [auth.token])

  console.log(isInitialized)

  return <React.Fragment>{isInitialized ? children : null}</React.Fragment>
}

export { PusherManager }
