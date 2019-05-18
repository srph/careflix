import Pusher = require('pusher-js')
import config from '~/config'
import { AuthContainer } from '~/containers'

// Pusher.logToConsole = true

let instance: Pusher.Pusher | null = null

function pusher() {
  return instance = instance || new Pusher(config.api.pusherKey, {
    cluster: config.api.pusherCluster,
    encrypted: true,
    authEndpoint: `${config.api.baseUrl}/broadcasting/auth`,
    auth: {
      headers: {
        'Authorization': `Bearer ${AuthContainer.state.token}`
      }
    }
  })
}

pusher.unset = function() {
  instance = null
}

export default pusher