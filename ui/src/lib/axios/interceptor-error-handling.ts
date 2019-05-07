import { AxiosError } from 'axios'
import instance from './instance'
import { ErrorContainer }  from '~/containers'

instance.interceptors.response.use(null, (error: AxiosError) => {
  if (error.config.method === 'get' && !error.config.url.includes('me') && error.response) {
    const { status } = error.response
    ErrorContainer.set(status === 404 || status === 403 ? 404 : 500)
  }

  return Promise.reject(error);
})