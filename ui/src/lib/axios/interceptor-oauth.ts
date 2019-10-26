import instance from './instance'
import { AuthContext } from '~/contexts/Auth'

export default {
  setup: (auth: AuthContext): number => {
    return instance.interceptors.request.use((config) => {
      if (auth.token != null) {
        config.headers['Authorization'] = `Bearer ${auth.token}`;
      }

      return config;
    })
  }
}