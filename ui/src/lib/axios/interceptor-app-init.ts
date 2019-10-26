import instance from './instance'
import { AxiosRequestConfig as BaseAxiosRequestConfig } from 'axios'
import { AxiosRequestConfig } from './types'

export default {
  setup: () => {
    return instance.interceptors.request.use((config: BaseAxiosRequestConfig) => {
      if (!('app' in config)) {
        (<AxiosRequestConfig>config).app = {}
      }
    
      return config as AxiosRequestConfig
    })
  }
}