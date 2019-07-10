import { AxiosRequestConfig as BaseAxiosRequestConfig, AxiosError as BaseAxiosError, AxiosResponse } from 'axios';

export interface AxiosRequestConfig extends BaseAxiosRequestConfig {
  app?: {
    validation?: string | boolean
  }
}

export interface AxiosError<T = { [key: string]: any }> extends BaseAxiosError {
  response: AxiosResponse<T>
  config: AxiosRequestConfig
}