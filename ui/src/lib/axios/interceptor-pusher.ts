import { instance } from './instance'
import { pusher } from '~/lib/pusher/pusher'

export const interceptorPusher = {
  setup: (): number => {
    return instance.interceptors.request.use((config) => {
      // Pusher only connects for a signed-in user.
      const socketId = pusher()?.connection.socket_id
      if (socketId) config.headers['X-Socket-ID'] = socketId

      return config
    })
  }
}
