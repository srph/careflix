import * as React from 'react'
import { useLayoutEffect, useState } from 'react'

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

  useLayoutEffect(() => {
    const requests = [interceptorAppInit.setup(), interceptorOauth.setup(), interceptorPusher.setup()]

    const responses = [interceptorExpiredTokens.setup(), interceptorToastErrors.setup()]

    setIsInitialized(true)

    return () => {
      requests.forEach((interceptor) => {
        instance.interceptors.request.eject(interceptor)
      })

      responses.forEach((interceptor) => {
        instance.interceptors.response.eject(interceptor)
      })
    }
  }, [])

  return <React.Fragment>{isInitialized ? children : null}</React.Fragment>
}

export { AxiosManager }
