import Pusher = require('pusher-js')
import config from '~/config'
import { AuthContext } from '~/contexts/Auth'

let instance: Pusher.Pusher | null = null

function pusher() {
  return instance
}

pusher.set = function(auth: AuthContext) {
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

pusher.unset = function() {
  instance = null
}

export default pusher
