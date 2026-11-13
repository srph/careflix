import { useMutation, useQuery } from '@tanstack/react-query'
import { axios } from '~/lib/axios/axios'
import { get } from '~/lib/query/get'
import { queryKeys } from '~/query-keys'
import { pendingOnboarding, verifier, type DiscordAuthResult } from './discord'
import { clearToken, getToken, isRejectedToken, signIn } from './session'

export type Auth =
  | { status: 'authenticated'; user: AppUser }
  // pending: there's a token and /api/me is loading. error: /api/me couldn't be reached.
  | { status: 'pending' | 'error' | 'guest'; user: null }

/** Who's signed in: the user, or null without a token (no request) or with one the API turned down. */
async function fetchAuth({ signal }: { signal: AbortSignal }): Promise<AppUser | null> {
  if (!getToken()) return null
  try {
    return await get<AppUser>('/api/me', undefined, signal)
  } catch (error) {
    if (!isRejectedToken(error)) throw error // Offline or a server error: keep the token and retry.
    clearToken()
    return null
  }
}

function useAuthQuery() {
  return useQuery({
    queryKey: queryKeys.global.auth(),
    queryFn: fetchAuth,
    // A guest needs no request, so there's nothing to wait for.
    initialData: () => (getToken() ? undefined : null),
    // Only sign-in, logout and Retry change it.
    staleTime: Infinity
  })
}

export function useAuth(): Auth {
  const query = useAuthQuery()
  if (query.data) return { status: 'authenticated', user: query.data }
  if (query.data === null) return { status: 'guest', user: null }
  return { status: query.status === 'error' ? 'error' : 'pending', user: null }
}

/**
 * The signed-in user, for screens behind PrivateRoute: they never render without one,
 * because PrivateRoute swaps in its redirect in the same render that clears the user.
 */
export function useAuthUser(): AppUser {
  const auth = useAuth()
  if (auth.status !== 'authenticated') throw new Error('useAuthUser needs a signed-in user')
  return auth.user
}

async function post(url: string, payload: object): Promise<DiscordAuthResult> {
  const [error, response] = await axios.post(url, payload, { app: { validation: false } })
  if (error) throw error
  return response.data
}

/** Trade the code Discord sent back for a token, or an onboarding ticket. */
export function useDiscordExchangeMutation() {
  return useMutation({
    mutationFn: (code: string) => post('/api/auth/discord/exchange', { ticket: code, verifier: verifier() }),
    onSuccess: signIn
  })
}

/** Finish onboarding with an access code. */
export function useRequestAccessMutation() {
  return useMutation({
    mutationFn: (code: string) =>
      post('/api/auth/request', { ticket: pendingOnboarding()?.ticket, verifier: verifier(), request_access: code }),
    onSuccess: signIn
  })
}
