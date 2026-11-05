import * as React from 'react'
import { createContext, useEffect, useState, useContext, useRef } from 'react'
import * as cookie from 'cookie-machine'
import immer from 'immer'
import axios from '~/lib/axios'
import { useNavigate } from 'react-router'
import config from '~/config'
import { addYears } from 'date-fns-v1'
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
  removeInvitation: (id: AppId) => void
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
  removeInvitation: () => {},
  receiveInvitation: () => {},
  cancelInvitation: () => {}
})

function AuthProvider({ children }: ReactComponentWrapper) {
  const navigate = useNavigate()
  const [data, setData] = useState<AppUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const removedInvitations = useRef(new Set<string>())

  /**
   * Block rendering and load the user data
   */
  useEffect(() => {
    const getUserData = async (): Promise<AsyncGoReturn> => {
      const token: string = cookie.get('app_token') || ''

      if (!token.length) {
        setIsLoading(false)
        return []
      }

      const [err, res] = await axios.get('/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (err) {
        return [err]
      }

      setToken(token)
      setData(res.data)
      setIsLoading(false)
      return []
    }

    getUserData()
  }, [])

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
    const [err2, dataResponse] = await axios.get('/api/me', {
      app: { validation: false },
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (err2) {
      return [err2]
    }
    const data = dataResponse.data
    cookie.set('app_token', token, {
      path: '/',
      expires: addYears(new Date(), 1)
    })
    setToken(token)
    setData(data)
    return []
  }

  const logout = () => {
    removedInvitations.current.clear()
    toast('You have been logged out.')
    cookie.remove('app_token', { path: '/' })
    setData(null)
    setToken(null)
    navigate('/login')
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
    setData(current => current && immer(current, draft => {
      draft.invitations.shift()
    }))
  }

  /**
   * Push the received invitation
   */
  const receiveInvitation = (invitation: AppPartyInvitation) => {
    if (removedInvitations.current.has(String(invitation.id))) return
    setData(current => current && immer(current, draft => {
      if (!draft.invitations) draft.invitations = []
      if (!draft.invitations.some(item => item.id === invitation.id)) {
        draft.invitations.push(invitation)
      }
    }))
  }

  /**
   * Push the received invitation
   */
  const cancelInvitation = (particular: AppPartyInvitation) => {
    setData(current => current && immer(current, draft => {
      const invitation = draft.invitations.find(invitation => invitation.id === particular.id)
      if (invitation) invitation.action = 'cancelled'
    }))
  }

  const removeInvitation = (id: AppId) => {
    // A resolved event can arrive before the original invitation on another tab.
    removedInvitations.current.add(String(id))
    setData(current => current && immer(current, draft => {
      draft.invitations = draft.invitations.filter(invitation => invitation.id !== id)
    }))
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
        removeInvitation,
        receiveInvitation,
        cancelInvitation
      }}>
      {<React.Fragment>{isLoading ? null : children}</React.Fragment>}
    </Context.Provider>
  )
}

function useAuth() {
  return useContext(Context)
}

export { AuthProvider, useAuth }
