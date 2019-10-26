import * as React from 'react'
import { useEffect } from 'react'
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

    return () => {
      requests.forEach((interceptor) => {
        instance.interceptors.request.eject(interceptor)
      })

      responses.forEach((interceptor) => {
        instance.interceptors.response.eject(interceptor)
      })
    }
  }, [auth.token])

  return <React.Fragment>{children}</React.Fragment>
}

export { AxiosManager } 