import instance from './instance'
import { AxiosError } from './types'
import { toast } from '~/components/Toast'

export default {
  setup: () => {
    /**
     * @example Disable the default validation toast
     * axios({ app: { validation: false } })
     *
     * @example Provide a custom error message
     * axios({ app: { validation: 'An error occured trying to create a contact } })
     */
    return instance.interceptors.response.use(null, (err: AxiosError<{ errors: AppValidationBag }>) => {
      if (err.config.method === 'get') {
        return Promise.reject(err)
      }

      const cfg = err.config.app.validation

      if (cfg === false) {
        return Promise.reject(err)
      }

      if (!err.response) {
        toast("We couldn't quite reach the servers. Please try refreshing the page.")
      } else if (err.response.status === 500) {
        toast('An error occurred with the server. Try again.')
      } else if (err.response.status === 422) {
        const cfg = err.config.app.validation

        if (cfg == null) {
          toast(getFirstValidationMessage(err.response.data.errors))
        } else if (typeof cfg === 'string') {
          toast(cfg)
        }
      } else if (err.response.status === 403) {
        toast("You're not authorized to perform this action.")
      }

      return Promise.reject(err)
    })
  }
}

function getFirstValidationMessage(errors: AppValidationBag) {
  const key = Object.keys(errors)[0]
  return errors[key] ? errors[key][0] : ''
}