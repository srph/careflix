import Pusher from 'pusher-js'
import { config } from '~/config'

let instance: Pusher.Pusher | null = null

export function pusher() {
  return instance
}

pusher.set = function (token: string) {
  instance = new Pusher(config.api.pusherKey, {
    cluster: config.api.pusherCluster,
    encrypted: true,
    authEndpoint: `${config.api.baseUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  })
}

pusher.unset = function () {
  instance?.disconnect()
  instance = null
}
