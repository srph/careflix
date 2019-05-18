import instance from './instance'
import pusher from '~/lib/pusher'
import { AuthContainer } from '~/containers';

instance.interceptors.request.use((config) => {
  if (AuthContainer.state.token != null) {
    config.headers['X-Socket-ID'] = pusher().connection.socket_id;
  }
  
  return config;
})