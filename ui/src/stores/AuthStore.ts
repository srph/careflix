import { observable, action, runInAction, computed } from 'mobx'
import axios from '~/lib/axios'
import cookie from 'cookie-machine'
import config from '~/config'

interface Credentials {
  username: string
  password: string
}

class AuthStore {
  @observable data: AppUser | null = null

  @observable token: string | null = null

  @computed get isGuest() {
    return this.data == null
  }

  @computed get isAuthenticated() {
    return !this.isGuest
  }

  /**
   * @TODO Handle error
   */
  @action.bound
  public async getUserData(): Promise<AsyncGoReturn> {
    const token: string = cookie.get('app_token') || ''

    if (!token.length) {
      return []
    }

    const [err, res] = await axios.get('/api/me')

    if (err) {
      return [err]
    }
    
    runInAction(() => {
      this.token = token
      this.data = res.data
    })

    return []
  }

  /**
   * @TODO Handle error
   */
  @action.bound
  async login(credentials: Credentials) {
    const [err, res] = await axios.post('/oauth/token', {
      username: credentials.username,
      password: credentials.password,
      client_id: config.api.clientId,
      client_secret: config.api.clientSecret,
      grant_type: 'password'
    })

    if (err) {
      return [err]
    }

    const token = res.data.access_token

    cookie.set('app_token', token, {
      path: '/'
    })

    const [err2, res2] = await axios.get('/api/me')

    if (err2) {
      return [err2]
    }

    runInAction('login.success', () => {
      this.data = res2.data
      this.token = token
    })

    return []
  }

  @action.bound
  logout() {
    cookie.remove('app_token')
    this.data = null
    this.token = null
  }
}

const instance = new AuthStore()

export default instance