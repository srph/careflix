import * as cookie from 'cookie-machine'
import type { AxiosError } from 'axios'
import { toast } from '~/components/toast/toast'
import { axios } from '~/lib/axios/axios'
import { queryClient } from '~/lib/query/client'
import { queryKeys } from '~/query-keys'
import { clearDiscordFlow, saveOnboarding, type DiscordAuthResult } from './discord'

// The Passport token lives in this cookie. It's only storage: requests send it as a Bearer header.
const TOKEN_COOKIE = 'app_token'

export function getToken(): string | null {
  return cookie.get(TOKEN_COOKIE) || null
}

export function clearToken() {
  cookie.remove(TOKEN_COOKIE, { path: '/' })
}

/** The API turned the token down: it expired, was revoked, or still needs an access code. */
export function isRejectedToken(error: unknown) {
  const response = (error as AxiosError | null)?.response
  return response?.status === 401 || (response?.status === 403 && response.data?.error === 'request_access_required')
}

/** Keep a Discord sign-in: the token and user, or the onboarding ticket while it still needs an access code. */
export function signIn(result: DiscordAuthResult) {
  if (result.requires_request_access) {
    saveOnboarding({ ticket: result.onboarding_ticket!, name: result.name!, expiresAt: result.expires_at })
    return
  }
  cookie.set(TOKEN_COOKIE, result.access_token!, {
    path: '/',
    expires: new Date(result.expires_at),
    secure: window.location.protocol === 'https:',
    sameSite: 'lax'
  })
  clearDiscordFlow()
  setUser(result.user!)
}

/** Sign out here right away; revoking the token on the API is best effort. */
export async function logout({ notify = true } = {}) {
  const token = getToken()
  const revocation = token
    ? axios.post(
        '/api/logout',
        {},
        { headers: { Authorization: `Bearer ${token}` }, app: { validation: false }, timeout: 5000 }
      )
    : Promise.resolve()
  clearToken()
  clearDiscordFlow()
  setUser(null)
  if (notify) toast('You have been logged out.')
  await revocation
}

// Drops every other query, then sets the user. The auth query itself stays, so whatever reads it
// re-renders with the new user, and the app routes (keyed by user id) remount on fresh queries.
function setUser(user: AppUser | null) {
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== queryKeys.global.auth()[0] })
  queryClient.setQueryData(queryKeys.global.auth(), user)
}
