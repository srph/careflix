import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import * as cookie from 'cookie-machine'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { axios } from '~/lib/axios/axios'
import { queryClient } from '~/lib/query/client'
import { queryKeys } from '~/query-keys'
import { useAuth } from './auth-queries'
import { getToken, logout, signIn } from './session'

vi.mock('~/lib/axios/axios', () => ({ axios: { get: vi.fn(), post: vi.fn(() => Promise.resolve([null, {}])) } }))
vi.mock('~/components/toast/toast', () => ({ toast: vi.fn() }))
// Vitest resolves cookie-machine's server build, so keep cookies in memory.
vi.mock('cookie-machine', () => {
  const jar = new Map<string, string>()
  return {
    get: (key: string) => jar.get(key),
    set: (key: string, value: string) => jar.set(key, value),
    remove: (key: string) => jar.delete(key)
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
const rejected = (status: number, data = {}) => [{ response: { status, data } }, null] as any

afterEach(() => {
  queryClient.clear()
  cookie.remove('app_token', { path: '/' })
  vi.clearAllMocks()
})

describe('useAuth', () => {
  it('is a guest without a token, without asking the API', () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current).toEqual({ status: 'guest', user: null })
    expect(axios.get).not.toHaveBeenCalled()
  })

  it('loads the user for a token', async () => {
    cookie.set('app_token', 'token', { path: '/' })
    vi.mocked(axios.get).mockResolvedValue([null, { data: { id: 7 } }] as any)
    const { result } = renderHook(() => useAuth(), { wrapper })
    expect(result.current.status).toBe('pending')
    await waitFor(() => expect(result.current).toEqual({ status: 'authenticated', user: { id: 7 } }))
  })

  it('drops a token the API turns down and becomes a guest', async () => {
    cookie.set('app_token', 'expired', { path: '/' })
    vi.mocked(axios.get).mockResolvedValue(rejected(401))
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.status).toBe('guest'))
    expect(getToken()).toBeNull()
  })

  it('keeps the token when the API cannot be reached', async () => {
    cookie.set('app_token', 'token', { path: '/' })
    queryClient.setQueryDefaults(queryKeys.global.auth(), { retry: false })
    vi.mocked(axios.get).mockResolvedValue(rejected(503))
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.status).toBe('error'))
    expect(getToken()).toBe('token')
  })
})

describe('session', () => {
  it('signs in with a fresh cache, then logs out to a guest', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    queryClient.setQueryData(['home-shows', 'all'], 'previous account')

    act(() =>
      signIn({
        requires_request_access: false,
        access_token: 'new',
        expires_at: '2099-01-01',
        user: { id: 2 } as AppUser
      })
    )
    await waitFor(() => expect(result.current).toEqual({ status: 'authenticated', user: { id: 2 } }))
    expect(getToken()).toBe('new')
    expect(queryClient.getQueryData(['home-shows', 'all'])).toBeUndefined()

    await act(() => logout({ notify: false }))
    await waitFor(() => expect(result.current).toEqual({ status: 'guest', user: null }))
    expect(getToken()).toBeNull()
    expect(axios.post).toHaveBeenCalledWith(
      '/api/logout',
      {},
      expect.objectContaining({ headers: { Authorization: 'Bearer new' } })
    )
  })
})
