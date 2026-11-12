import Pusher from 'pusher-js'
import { config } from '~/config'
import { AuthContext } from '~/contexts/auth/auth'

let instance: Pusher.Pusher | null = null

export function pusher() {
  return instance
}

pusher.set = function (auth: AuthContext) {
  instance = new Pusher(config.api.pusherKey, {
    cluster: config.api.pusherCluster,
    encrypted: true,
    authEndpoint: `${config.api.baseUrl}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }
  })
}

pusher.unset = function () {
  instance?.disconnect()
  instance = null
}
