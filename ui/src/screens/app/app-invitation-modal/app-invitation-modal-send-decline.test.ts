import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { axios } from '~/lib/axios/axios'
import { sendDecline } from './app-invitation-modal-send-decline'

vi.mock('~/lib/axios/axios', () => ({ axios: { post: vi.fn() } }))

const failure = (status?: number) => [Object.assign(new Error('Request failed'), status ? { response: { status } } : {})]
const ok = [null, { data: {} }]
const invitation = (minutes: number) => ({ id: 7, expires_at: new Date(Date.now() + minutes * 60_000).toISOString() }) as AppPartyInvitation

describe('sendDecline', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.clearAllMocks())

  it('declines quietly, without the global error toasts', async () => {
    vi.mocked(axios.post).mockResolvedValue(ok as any)
    await expect(sendDecline(invitation(30))).resolves.toBe('declined')
    expect(axios.post).toHaveBeenCalledWith('/api/invitations/7/decline', {}, { app: { validation: false } })
  })

  it('retries server and network failures until one lands', async () => {
    vi.mocked(axios.post)
      .mockResolvedValueOnce(failure(500) as any)
      .mockResolvedValueOnce(failure() as any)
      .mockResolvedValue(ok as any)
    const result = sendDecline(invitation(30))
    await vi.advanceTimersByTimeAsync(1000)
    expect(axios.post).toHaveBeenCalledTimes(2)
    await vi.advanceTimersByTimeAsync(3000)
    await expect(result).resolves.toBe('declined')
    expect(axios.post).toHaveBeenCalledTimes(3)
  })

  it('stops after three retries', async () => {
    vi.mocked(axios.post).mockResolvedValue(failure(503) as any)
    const result = sendDecline(invitation(30))
    await vi.advanceTimersByTimeAsync(14_000)
    await expect(result).resolves.toBe('gave-up')
    expect(axios.post).toHaveBeenCalledTimes(4)
  })

  it.each([401, 403, 404])('treats %i as already resolved', async status => {
    vi.mocked(axios.post).mockResolvedValue(failure(status) as any)
    await expect(sendDecline(invitation(30))).resolves.toBe('resolved')
    expect(axios.post).toHaveBeenCalledTimes(1)
  })

  it('does not wait past the invitation expiring', async () => {
    vi.mocked(axios.post).mockResolvedValue(failure(500) as any)
    const result = sendDecline({ id: 7, expires_at: new Date(Date.now() + 2000).toISOString() } as AppPartyInvitation)
    await vi.advanceTimersByTimeAsync(1000)
    await expect(result).resolves.toBe('gave-up')
    expect(axios.post).toHaveBeenCalledTimes(2)
  })
})
