import * as React from 'react'
import { createContext, useEffect, useState, useContext } from 'react'
import useUpdateEffect from 'react-use/lib/useUpdateEffect'
import * as cookie from 'cookie-machine'
import immer from 'immer'
import axios from '~/lib/axios'
import history from '~/lib/history'
import config from '~/config'
import { addYears } from 'date-fns'
import { toast } from '~/components/Toast'

export interface AuthContext {
  data: AppUser | null
  token: string | null
  isAuthenticated: boolean
  isGuest: boolean
  login: (credentials: { username: string; password: string }) => Promise<AsyncGoReturn>
  logout: () => void
  updateUserData: (payload: Partial<AppUser>) => void
  shiftInvitations: () => void
  receiveInvitation: (invitation: AppPartyInvitation) => void
  cancelInvitation: (invitation: AppPartyInvitation) => void
}

const Context = createContext<AuthContext>({
  data: null,
  token: null,
  isAuthenticated: false,
  isGuest: false,
  login: async () => new Promise(() => {}),
  logout: () => {},
  updateUserData: () => {},
  shiftInvitations: () => {},
  receiveInvitation: () => {},
  cancelInvitation: () => {}
})

function AuthProvider({ children }: ReactComponentWrapper) {
  const [data, setData] = useState<AppUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

/**
 * Block rendering and load the user data
 */
  useEffect(() => {
    const getUserData = async (): Promise<AsyncGoReturn> => {
      const token: string = cookie.get('app_token') || ''
  
      if (!token.length) {
        return []
      }
  
      setToken(token)
  
      const [err, res] = await axios.get('/api/me')
  
      if (err) {
        return [err]
      }
  
      setData(res.data)
      setIsLoading(false)
      return []
    }

    getUserData()
  }, [])

  useUpdateEffect(() => {

  }, [token])

  const login = async (credentials: { username: string; password: string }): Promise<AsyncGoReturn> => {
    const [err, tokenResponse] = await axios.post(
      '/oauth/token',
      {
        username: credentials.username,
        password: credentials.password,
        client_id: config.api.clientId,
        client_secret: config.api.clientSecret,
        grant_type: 'password'
      },
      {
        app: { validation: false }
      }
    )
    if (err) {
      return [err]
    }
    const token = tokenResponse.data.access_token
    await this.setState({
      token
    })
    cookie.set('app_token', token, {
      path: '/',
      expires: addYears(new Date(), 1)
    })
    const [err2, dataResponse] = await axios.get('/api/me', {
      app: { validation: false }
    })
    if (err2) {
      return [err2]
    }
    const data = dataResponse.data
    setData(data)
    setToken(token)
    return []
  }

  const logout = () => {
    toast('You have been logged out.')
    cookie.remove('app_token', { path: '/' })
    setData(null)
    setToken(null)
    history.push('/login')
  }

  const updateUserData = (payload: Partial<AppUser>) => {
    setData(data => ({
      ...data,
      ...payload
    }))
  }

  /**
   * Remove the first invitation (called after accepted / declined / expired)
   */
  const shiftInvitations = () => {
    const update = immer(draft => {
      draft.invitations.shift()
    })(data)

    setData(update)
  }

  /**
   * Push the received invitation
   */
  const receiveInvitation = (invitation: AppPartyInvitation) => {
    const update = immer(draft => {
      draft.invitations.push(invitation)
    })(data)

    setData(update)
  }

  /**
   * Push the received invitation
   */
  const cancelInvitation = (particular: AppPartyInvitation) => {
    const update = immer(draft => {
      const invitation = draft.invitations.find(invitation => invitation.id === particular.id)
      invitation.action = 'cancelled'
    })(data)

    setData(update)
  }

  return (
    <Context.Provider
      value={{
        data,
        token,
        isAuthenticated: data != null,
        isGuest: data == null,
        login,
        logout,
        updateUserData,
        shiftInvitations,
        receiveInvitation,
        cancelInvitation
      }}>
      {isLoading ? <div /> : <React.Fragment>{props.children}</React.Fragment>}
    </Context.Provider>
  )
}

function useAuth() {
  return useContext(Context)
}

export {
  AuthProvider,
  useAuth
}