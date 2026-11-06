import instance from './instance'
import pusher from '~/lib/pusher'
import { AuthContext } from '~/contexts/Auth'

export default {
  setup: (auth: AuthContext): number => {
    return instance.interceptors.request.use((config) => {
      if (auth.token != null) {
        const socketId = pusher()?.connection.socket_id
        if (socketId) config.headers['X-Socket-ID'] = socketId
      }
      
      return config;
    })
  }
}
