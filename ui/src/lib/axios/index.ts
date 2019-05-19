import instance from './instance'
import goify from '~/utils/goify'
import './interceptor-oauth'
import './interceptor-expired-tokens'
// import './interceptor-toast-errors'
// import './interceptor-error-handler'
import './interceptor-pusher'

export default {
  get(url: string, config?) {
    return goify(instance.get(url, config))
  },
  post(url: string, payload?) {
    return goify(instance.post(url, payload))
  },
  put(url: string, payload?) {
    return goify(instance.put(url, payload))
  },
  delete(url: string, config?) {
    return goify(instance.delete(url, config))
  }
}