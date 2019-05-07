import instance from './instance'
import goify from '~/utils/goify'
import './interceptor-oauth'
import './interceptor-expired-tokens'
// import './interceptor-toast-errors'
// import './interceptor-error-handler'

export default {
  get(url, query?) {
    return goify(instance.get(url, query))
  },
  post(url, payload?) {
    return goify(instance.post(url, payload))
  },
  put(url, payload?) {
    return goify(instance.put(url, payload))
  },
  delete(url, config?) {
    return goify(instance.delete(url, config))
  }
}