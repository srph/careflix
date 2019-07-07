import instance from './instance'
import { AxiosError } from './types';
import { toast }  from '~/components/Toast'

/**
 * @example Disable the default validation toast
 * axios({ appValidationError: false })
 * 
 * @example Provide a custom error message
 * axios({ appValidationError: 'An error occured trying to create a contact })
 */
instance.interceptors.response.use(null, (err: AxiosError) => {
  if (err.config.method === 'get') {
    return Promise.reject(err)
  }

  const cfg = err.config.app.validation

  if (cfg === false) {
    return Promise.reject(err)
  }
  
  if (!err.response) {
    toast('We couldn\'t quite reach the servers. Please try refreshing the page.')
  } else if (err.response.status === 500) {
    toast('An error occurred with the server. Try again.')
  } else if (err.response.status === 422) {
    const cfg = err.config.app.validation

    if (cfg == null) {
      toast('Some fields were not properly provided.')
    } else if (typeof cfg === 'string') {
      toast(cfg)
    }
  } else if (err.response.status === 403) {
    toast('You\'re not authorized to perform this action.')
  }

  return Promise.reject(err)
})