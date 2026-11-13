import { instance } from './instance'
import { AxiosError } from 'axios'
import { isRejectedToken, logout } from '~/lib/auth/session'

export const interceptorExpiredTokens = {
  setup: (): number => {
    return instance.interceptors.response.use(undefined, (err: AxiosError) => {
      const url = err.config?.url || ''
      // /api/me handles its own: a rejected token there just means a guest (lib/auth/auth-queries.ts).
      if (isRejectedToken(err) && !url.startsWith('/api/auth/') && url !== '/api/logout' && url !== '/api/me') {
        void logout({ notify: false })
      }

      return Promise.reject(err)
    })
  }
}
