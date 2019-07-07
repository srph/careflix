import instance from './instance'
import goify from '~/utils/goify'
import './interceptor-app-init'
import './interceptor-oauth'
import './interceptor-expired-tokens'
import './interceptor-toast-errors'
// import './interceptor-error-handler'
import './interceptor-pusher'

export default {
  get(url: string, config?) {
    return goify(instance.get(url, config))
  },
  post(url: string, payload?, config?) {
    return goify(instance.post(url, payload, config))
  },
  put(url: string, payload?, config?) {
    return goify(instance.put(url, payload, config))
  },
  delete(url: string, config?) {
    return goify(instance.delete(url, config))
  }
}