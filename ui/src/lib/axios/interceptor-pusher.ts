import instance from './instance'
import pusher from '~/lib/pusher'
import { AuthContext } from '~/contexts/Auth'

export default {
  setup: (auth: AuthContext) => {
    return instance.interceptors.request.use((config) => {
      if (auth.token != null) {
        config.headers['X-Socket-ID'] = pusher().connection.socket_id;
      }
      
      return config;
    })
  }
}