import * as React from 'react'
import { createContext, useEffect, useState, useContext, useRef } from 'react'
import * as cookie from 'cookie-machine'
import immer from 'immer'
import axios from '~/lib/axios'
import { useNavigate } from 'react-router'
import { toast } from '~/components/Toast'
import { beginDiscord, clearDiscordFlow, pendingOnboarding, saveOnboarding, verifier, type DiscordAuthResult, type Onboarding } from '~/lib/auth/discord'
import { readDeclinedInvitations, rememberDeclinedInvitation } from './declinedInvitations'

export interface AuthContext {
  data: AppUser | null
  token: string | null
  isAuthenticated: boolean
  isGuest: boolean
  onboarding: Onboarding | null
  startDiscord: (returnTo?: string) => Promise<void>
  exchangeDiscord: (ticket: string) => Promise<AsyncGoReturn<DiscordAuthResult>>
  requestAccess: (code: string) => Promise<AsyncGoReturn<DiscordAuthResult>>
  logout: (notify?: boolean) => Promise<void>
  updateUserData: (payload: Partial<AppUser>) => void
  shiftInvitations: () => void
  removeInvitation: (id: AppId) => void
  declineInvitation: (invitation: AppPartyInvitation) => void
  receiveInvitation: (invitation: AppPartyInvitation) => void
  cancelInvitation: (invitation: AppPartyInvitation) => void
}

const Context = createContext<AuthContext>({
  data: null,
  token: null,
  isAuthenticated: false,
  isGuest: false,
  onboarding: null,
  startDiscord: beginDiscord,
  exchangeDiscord: async () => [],
  requestAccess: async () => [],
  logout: async () => {},
  updateUserData: () => {},
  shiftInvitations: () => {},
  removeInvitation: () => {},
  declineInvitation: () => {},
  receiveInvitation: () => {},
  cancelInvitation: () => {}
})

function AuthProvider({ children }: ReactComponentWrapper) {
  const navigate = useNavigate()
  const [data, setData] = useState<AppUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const removedInvitations = useRef(new Set<string>())
  const [onboarding, setOnboarding] = useState<Onboarding | null>(pendingOnboarding)
  const exchanges = useRef(new Map<string, Promise<AsyncGoReturn<DiscordAuthResult>>>())

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
        cookie.remove('app_token', { path: '/' })
        setIsLoading(false)
        return [err]
      }

      setToken(token)
      setData(withoutDeclined(res.data))
      setIsLoading(false)
      return []
    }

    getUserData()
  }, [])

  const acceptResult = (result: DiscordAuthResult) => {
    if (result.requires_request_access) {
      const pending = { ticket: result.onboarding_ticket!, name: result.name!, expiresAt: result.expires_at }
      saveOnboarding(pending)
      setOnboarding(pending)
      return
    }
    cookie.set('app_token', result.access_token!, {
      path: '/',
      expires: new Date(result.expires_at),
      secure: window.location.protocol === 'https:',
      sameSite: 'lax',
    })
    clearDiscordFlow()
    setOnboarding(null)
    setToken(result.access_token!)
    setData(withoutDeclined(result.user!))
  }

  const exchangeDiscord = (ticket: string): Promise<AsyncGoReturn<DiscordAuthResult>> => {
    if (!exchanges.current.has(ticket)) {
      exchanges.current.set(ticket, (async () => {
        const [err, response] = await axios.post('/api/auth/discord/exchange', { ticket, verifier: verifier() }, { app: { validation: false } })
        if (err) return [err] as AsyncGoReturn<DiscordAuthResult>
        acceptResult(response.data)
        return [null, response.data] as AsyncGoReturn<DiscordAuthResult>
      })())
    }
    return exchanges.current.get(ticket)!
  }

  const requestAccess = async (code: string): Promise<AsyncGoReturn<DiscordAuthResult>> => {
    const [err, response] = await axios.post('/api/auth/request', {
      ticket: onboarding?.ticket, verifier: verifier(), request_access: code,
    }, { app: { validation: false } })
    if (err) return [err]
    acceptResult(response.data)
    return [null, response.data]
  }

  const startDiscord = async (returnTo = '/') => {
    await beginDiscord(returnTo)
  }

  const logout = async (notify = true) => {
    const revocation = token ? axios.post('/api/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }, app: { validation: false }, timeout: 5000,
    }) : Promise.resolve()
    removedInvitations.current.clear()
    exchanges.current.clear()
    clearDiscordFlow()
    setOnboarding(null)
    if (notify) toast('You have been logged out.')
    cookie.remove('app_token', { path: '/' })
    setData(null)
    setToken(null)
    navigate('/login')
    await revocation
  }

  // A decline that hasn't reached the API yet must not bring its invite back on reload.
  const withoutDeclined = (user: AppUser): AppUser => {
    if (!user) return user
    for (const entry of readDeclinedInvitations(user.id)) removedInvitations.current.add(entry.id)
    if (!user.invitations?.length) return user
    return { ...user, invitations: user.invitations.filter(invitation => !removedInvitations.current.has(String(invitation.id))) }
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

  const declineInvitation = (invitation: AppPartyInvitation) => {
    if (data) rememberDeclinedInvitation(data.id, invitation)
    removeInvitation(invitation.id)
  }

  return (
    <Context.Provider
      value={{
        data,
        token,
        isAuthenticated: data != null,
        isGuest: data == null,
        onboarding,
        startDiscord,
        exchangeDiscord,
        requestAccess,
        logout,
        updateUserData,
        shiftInvitations,
        removeInvitation,
        declineInvitation,
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
