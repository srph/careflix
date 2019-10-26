import * as React from 'react'
import { useEffect, useState } from 'react'
import { useAuth } from '~/contexts/Auth'

import instance from './instance'
import appInit from './interceptor-app-init'
import oauth from './interceptor-oauth'
import expiredTokens from './interceptor-expired-tokens'
import toastErrors from './interceptor-toast-errors'
import pusher from './interceptor-pusher'

/**
 * Setup axios interceptors
 */
function AxiosManager({ children }: ReactComponentWrapper) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const auth = useAuth()

  useEffect(() => {
    const requests = [
      appInit.setup(),
      oauth.setup(auth),
      pusher.setup(auth)
    ]

    const responses = [
      expiredTokens.setup(auth),
      toastErrors.setup()
    ]

    setIsInitialized(true)

    return () => {
      requests.forEach((interceptor) => {
        instance.interceptors.request.eject(interceptor)
      })

      responses.forEach((interceptor) => {
        instance.interceptors.response.eject(interceptor)
      })

      setIsInitialized(false)
    }
  }, [auth.token])

  return <React.Fragment>{isInitialized ? children : null}</React.Fragment>
}

export { AxiosManager } 