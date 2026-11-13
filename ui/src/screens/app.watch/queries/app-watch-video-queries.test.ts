import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axios } from '~/lib/axios/axios'
import { loadSubtitle } from './app-watch-video-queries'

vi.mock('~/lib/axios/axios', () => ({ axios: { get: vi.fn() } }))

beforeEach(() => {
  vi.mocked(axios.get).mockReset()
})

describe('loading subtitles', () => {
  it('asks the API from its root, even on a nested watch URL, and returns the file', async () => {
    window.history.replaceState({}, '', '/watch/77')
    vi.mocked(axios.get).mockResolvedValue([null, { data: { subtitle: 'the file' } }] as any)
    await expect(loadSubtitle(1)).resolves.toBe('the file')
    expect(axios.get).toHaveBeenCalledWith('/api/videos/1/subtitle', { app: { validation: false } })
    window.history.replaceState({}, '', '/')
  })

  it.each(['<html>SPA fallback</html>', {}, { subtitle: null }])(
    'returns null for a response that isn’t a file: %j',
    async (data) => {
      vi.mocked(axios.get).mockResolvedValue([null, { data }] as any)
      await expect(loadSubtitle(1)).resolves.toBeNull()
    }
  )

  it('rejects when the request fails', async () => {
    const error = new Error('Network unavailable')
    vi.mocked(axios.get).mockResolvedValue([error, null] as any)
    await expect(loadSubtitle(1)).rejects.toBe(error)
  })
})
