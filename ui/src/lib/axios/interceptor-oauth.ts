import { instance } from './instance'
import { getToken } from '~/lib/auth/session'

export const interceptorOauth = {
  setup: (): number => {
    return instance.interceptors.request.use((config) => {
      const token = getToken()
      if (token != null) {
        config.headers['Authorization'] = `Bearer ${token}`
      }

      return config
    })
  }
}
