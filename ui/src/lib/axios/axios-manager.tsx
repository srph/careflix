import * as React from 'react'
import { useLayoutEffect, useState } from 'react'
import { useAuth } from '~/contexts/auth/auth'

import { instance } from './instance'
import { interceptorAppInit } from './interceptor-app-init'
import { interceptorOauth } from './interceptor-oauth'
import { interceptorExpiredTokens } from './interceptor-expired-tokens'
import { interceptorToastErrors } from './interceptor-toast-errors'
import { interceptorPusher } from './interceptor-pusher'

/**
 * Setup axios interceptors
 */
function AxiosManager({ children }: ReactComponentWrapper) {
  const [isInitialized, setIsInitialized] = useState<boolean>(false)
  const auth = useAuth()

  useLayoutEffect(() => {
    const requests = [interceptorAppInit.setup(), interceptorOauth.setup(auth), interceptorPusher.setup(auth)]

    const responses = [interceptorExpiredTokens.setup(auth), interceptorToastErrors.setup()]

    setIsInitialized(true)

    return () => {
      requests.forEach((interceptor) => {
        instance.interceptors.request.eject(interceptor)
      })

      responses.forEach((interceptor) => {
        instance.interceptors.response.eject(interceptor)
      })
    }
  }, [auth.token])

  return <React.Fragment>{isInitialized ? children : null}</React.Fragment>
}

export { AxiosManager }
