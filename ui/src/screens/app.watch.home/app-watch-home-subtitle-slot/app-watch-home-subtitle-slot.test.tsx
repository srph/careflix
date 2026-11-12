import { act, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axios } from '~/lib/axios/axios'
import { AppWatchHomeSubtitleSlot } from './app-watch-home-subtitle-slot'

vi.mock('~/lib/axios/axios', () => ({ axios: { get: vi.fn() } }))

const video = { id: 1, subtitle_url: 'https://media.example.test/1.srt' } as AppShowVideo
const cue = (text: string) => `1\n00:00:00,000 --> 00:00:05,000\n${text}\n\n`
const props = { video, time: 1, isEnabled: true, isPlayerOpen: false }

beforeEach(() => { vi.mocked(axios.get).mockReset() })

describe('subtitle loading', () => {
  it('requests the API from the root of a nested watch URL and displays its cue', async () => {
    window.history.replaceState({}, '', '/watch/77')
    vi.mocked(axios.get).mockResolvedValue([null, { data: { subtitle: cue('Hello together') } }] as any)
    render(<AppWatchHomeSubtitleSlot {...props} />)
    expect(axios.get).toHaveBeenCalledWith('/api/videos/1/subtitle', { app: { validation: false } })
    await screen.findByText('Hello together')
    window.history.replaceState({}, '', '/')
  })

  it.each([
    '<html>SPA fallback</html>',
    {},
    { subtitle: null },
    { subtitle: '' },
    { subtitle: 'Malformed cue\n\n' }
  ])('ignores an invalid or empty subtitle response: %j', async data => {
    vi.mocked(axios.get).mockResolvedValue([null, { data }] as any)
    const { container } = render(<AppWatchHomeSubtitleSlot {...props} />)
    await act(async () => {})
    expect(container.innerHTML).toBe('')
  })

  it('handles a failed request without rejecting the effect', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network unavailable'))
    const { container } = render(<AppWatchHomeSubtitleSlot {...props} />)
    await act(async () => {})
    expect(container.innerHTML).toBe('')
  })

  it('loads changed subtitles and ignores an older response that arrives afterward', async () => {
    let finishOldRequest: (value: any) => void
    vi.mocked(axios.get)
      .mockImplementationOnce(() => new Promise(resolve => { finishOldRequest = resolve }))
      .mockResolvedValueOnce([null, { data: { subtitle: cue('Current subtitles') } }] as any)
    const { rerender } = render(<AppWatchHomeSubtitleSlot {...props} />)
    rerender(<AppWatchHomeSubtitleSlot {...props} video={{ ...video, id: 2 }} />)
    await screen.findByText('Current subtitles')
    await act(async () => finishOldRequest([null, { data: { subtitle: cue('Stale subtitles') } }]))
    expect(screen.queryByText('Stale subtitles')).toBeNull()
    expect(screen.getByText('Current subtitles')).toBeTruthy()

    rerender(<AppWatchHomeSubtitleSlot {...props} video={{ ...video, id: 3, subtitle_url: null }} />)
    await waitFor(() => expect(screen.queryByText('Current subtitles')).toBeNull())
    expect(axios.get).toHaveBeenCalledTimes(2)
  })
})
