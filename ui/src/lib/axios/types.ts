import { AxiosRequestConfig as BaseAxiosRequestConfig, AxiosError as BaseAxiosError } from 'axios';

export interface AxiosRequestConfig extends BaseAxiosRequestConfig {
  app?: {
    validation?: string | boolean
  }
}

export interface AxiosError extends BaseAxiosError {
  config: AxiosRequestConfig
}