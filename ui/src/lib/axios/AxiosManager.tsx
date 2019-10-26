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
 * Setups the 
 * @param param0
 */
function AxiosManager({ children }: ReactComponentWrapper) {
  const auth = useAuth()
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

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