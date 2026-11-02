import { act, renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '~/lib/query/client'
import { QueryProvider } from '~/lib/query/QueryProvider'
import { useCreatePartyMutation, useListingSearchQuery, useShowsQuery } from './queries'
import axios from '~/lib/axios'

const session = vi.hoisted(() => ({ user: { id: 1 }, navigate: vi.fn() }))
vi.mock('~/contexts/Auth', () => ({ useAuth: () => ({ data: session.user, isAuthenticated: true }) }))
vi.mock('react-router', () => ({ useNavigate: () => session.navigate }))
vi.mock('~/lib/axios', () => ({ default: { get: vi.fn(), post: vi.fn() } }))
const clients: ReturnType<typeof createQueryClient>[] = []
function setup() {
  const client = createQueryClient()
  clients.push(client)
  return { client, wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider> }
}
afterEach(() => { clients.forEach(client => client.clear()); clients.length = 0; vi.clearAllMocks(); session.user = { id: 1 } })
const page = { data: [{ id: 1 }], current_page: 1, last_page: 1 }

describe('listing queries', () => {
  it('reuses cached catalog data for 60 seconds, then refreshes on mount', async () => {
    vi.useFakeTimers({ toFake: ['Date'] })
    const start = Date.now()
    vi.mocked(axios.get).mockResolvedValue([null, { data: page }] as any)
    const { wrapper } = setup()
    const first = renderHook(() => useShowsQuery(), { wrapper })
    await waitFor(() => expect(first.result.current.isSuccess).toBe(true))
    first.unmount()
    vi.setSystemTime(start + 59_000)
    const second = renderHook(() => useShowsQuery(), { wrapper })
    expect(second.result.current.data.pages[0]).toEqual(page)
    expect(axios.get).toHaveBeenCalledTimes(1)
    second.unmount()
    vi.setSystemTime(start + 61_000)
    renderHook(() => useShowsQuery(), { wrapper })
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2))
  })

  it('reports Axios tuple errors as query failures and allows retry', async () => {
    const error = Object.assign(new Error('Unavailable'), { response: { status: 422 } })
    vi.mocked(axios.get).mockResolvedValueOnce([error] as any).mockResolvedValue([null, { data: page }] as any)
    const { wrapper } = setup()
    const hook = renderHook(() => useShowsQuery(), { wrapper })
    await waitFor(() => expect(hook.result.current.error).toBe(error))
    await act(async () => { await hook.result.current.refetch() })
    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true))
  })

  it('does not fetch search suggestions until enabled and supplies server-side limits', async () => {
    vi.mocked(axios.get).mockResolvedValue([null, { data: page }] as any)
    const { wrapper } = setup()
    const hook = renderHook(({ enabled }) => useListingSearchQuery('moon', enabled), { wrapper, initialProps: { enabled: false } })
    expect(axios.get).not.toHaveBeenCalled()
    hook.rerender({ enabled: true })
    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true))
    expect(axios.get).toHaveBeenCalledWith('/api/shows', expect.objectContaining({ params: { q: 'moon', per_page: 5 } }))
    expect(axios.get).toHaveBeenCalledWith('/api/me/parties', expect.objectContaining({ params: { q: 'moon', per_page: 4 } }))
  })

  it('invalidates history and search after creating a party, then enters its room', async () => {
    vi.mocked(axios.post).mockResolvedValue([null, { data: { id: 42 } }] as any)
    const { client, wrapper } = setup()
    client.setQueryData(['listing', 1, 'parties'], page)
    client.setQueryData(['listing', 1, 'search', 'moon'], {})
    const hook = renderHook(() => useCreatePartyMutation(), { wrapper })
    await act(async () => { await hook.result.current.mutateAsync({ id: 10 } as AppShowVideo) })
    expect(axios.post).toHaveBeenCalledWith('/api/parties', { show_video_id: 10 })
    expect(client.getQueryState(['listing', 1, 'parties']).isInvalidated).toBe(true)
    expect(client.getQueryState(['listing', 1, 'search', 'moon']).isInvalidated).toBe(true)
    expect(session.navigate).toHaveBeenCalledWith('/watch/42')
  })

  it('discards the previous account cache when the authenticated account changes', () => {
    const hook = renderHook(() => useQueryClient(), { wrapper: QueryProvider })
    const previous = hook.result.current
    previous.setQueryData(['private'], 'first account')
    session.user = { id: 2 }
    hook.rerender()
    expect(hook.result.current).not.toBe(previous)
    expect(hook.result.current.getQueryData(['private'])).toBeUndefined()
    expect(previous.getQueryData(['private'])).toBeUndefined()
  })
})
