import { instance } from './instance'
import { AuthContext } from '~/contexts/auth/auth'

export const interceptorOauth = {
  setup: (auth: AuthContext): number => {
    return instance.interceptors.request.use((config) => {
      if (auth.token != null) {
        config.headers['Authorization'] = `Bearer ${auth.token}`
      }

      return config
    })
  }
}
