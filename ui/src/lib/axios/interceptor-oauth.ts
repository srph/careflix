import instance from './instance'
import cookie from 'cookie-machine'

instance.interceptors.request.use((config) => {
  const token: string = cookie.get('app_token') || ''

  if (token.length) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
})