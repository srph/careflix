import { renderHook, waitFor } from '@testing-library/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { createQueryClient } from '~/lib/query/client'
import { axios } from '~/lib/axios/axios'
import { useInviteRecentsQuery, useInviteSearchQuery } from './app-watch-home-chat-invitation-panel-queries'

vi.mock('~/lib/axios/axios', () => ({ axios: { get: vi.fn() } }))
const clients: ReturnType<typeof createQueryClient>[] = []
function setup({ retry = true } = {}) {
  const client = createQueryClient()
  if (!retry) client.setDefaultOptions({ queries: { ...client.getDefaultOptions().queries, retry: false } })
  clients.push(client)
  return ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
afterEach(() => { clients.forEach(client => client.clear()); clients.length = 0; vi.clearAllMocks() })
const theo = { id: 2, name: 'Theo' }

describe('invite queries', () => {
  it('loads recents without a search term', async () => {
    vi.mocked(axios.get).mockResolvedValue([null, { data: [theo] }] as any)
    const hook = renderHook(() => useInviteRecentsQuery(9), { wrapper: setup() })
    await waitFor(() => expect(hook.result.current.data).toEqual([theo]))
    expect(axios.get).toHaveBeenCalledWith('/api/parties/9/invitations/search', expect.objectContaining({ params: undefined }))
  })

  it('searches only with a term, and caches each term', async () => {
    vi.mocked(axios.get).mockResolvedValue([null, { data: [theo] }] as any)
    const wrapper = setup()
    const hook = renderHook(({ term }) => useInviteSearchQuery(9, term), { wrapper, initialProps: { term: '' } })
    expect(axios.get).not.toHaveBeenCalled()
    hook.rerender({ term: 'th' })
    await waitFor(() => expect(hook.result.current.data).toEqual([theo]))
    expect(axios.get).toHaveBeenCalledWith('/api/parties/9/invitations/search', expect.objectContaining({ params: { search: 'th' } }))
    hook.rerender({ term: '' })
    hook.rerender({ term: 'th' })
    expect(hook.result.current.data).toEqual([theo])
    expect(axios.get).toHaveBeenCalledTimes(1)
  })

  it('fails on a response that is not a list', async () => {
    vi.mocked(axios.get).mockResolvedValue([null, { data: { message: 'nope' } }] as any)
    const hook = renderHook(() => useInviteSearchQuery(9, 'th'), { wrapper: setup({ retry: false }) })
    await waitFor(() => expect(hook.result.current.isError).toBe(true))
  })
})
