import instance from './instance'
import { AuthContext } from '~/contexts/Auth'
import { AxiosError } from 'axios';

export default {
  setup: (auth: AuthContext): number => {
    return instance.interceptors.response.use(null, (err: AxiosError) => {
      if (err.response && !err.config.url.includes('/oauth/token') && err.response.status === 401) {
        auth.logout()
      }

      return Promise.reject(err)
    })
  }
}