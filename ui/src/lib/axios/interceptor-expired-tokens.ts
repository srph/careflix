import { instance } from './instance'
import { AuthContext } from '~/contexts/auth/auth'
import { AxiosError } from 'axios'

export const interceptorExpiredTokens = {
  setup: (auth: AuthContext): number => {
    return instance.interceptors.response.use(undefined, (err: AxiosError) => {
      const url = err.config?.url || ''
      if (
        err.response &&
        !url.startsWith('/api/auth/') &&
        url !== '/api/logout' &&
        (err.response.status === 401 ||
          (err.response.status === 403 && (err.response.data as any)?.error === 'request_access_required'))
      ) {
        void auth.logout(false)
      }

      return Promise.reject(err)
    })
  }
}
