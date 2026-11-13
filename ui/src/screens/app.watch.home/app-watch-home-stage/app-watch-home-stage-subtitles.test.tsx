import { act, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { axios } from '~/lib/axios/axios'
import { PlayaProvider } from '~/components/playa/playa'
import type { Playa } from '~/components/playa/use-playa'
import { AppWatchHomeStageSubtitles } from './app-watch-home-stage-subtitles'

vi.mock('~/lib/axios/axios', () => ({ axios: { get: vi.fn() } }))

let party: AppParty
vi.mock('~/screens/app.watch/use-party', () => ({ useParty: () => party }))

const video = { id: 1, subtitle_url: 'https://media.example.test/1.srt' } as AppShowVideo
const cue = (text: string) => `1\n00:00:00,000 --> 00:00:05,000\n${text}\n\n`
// Ready, a second in, subtitles on, controls down.
const playa = { state: { time: 1, isReady: true, isSubtitlesOn: true, isOverlayOpen: false } } as Playa
const Subtitles = (props: { video: AppShowVideo }) => {
  party = { video: props.video } as AppParty
  return (
    <PlayaProvider playa={playa}>
      <AppWatchHomeStageSubtitles />
    </PlayaProvider>
  )
}

let client: QueryClient
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={client}>{children}</QueryClientProvider>
)

beforeEach(() => {
  vi.mocked(axios.get).mockReset()
  client = new QueryClient()
})

describe('subtitle loading', () => {
  it('requests the API from the root of a nested watch URL and displays its cue', async () => {
    window.history.replaceState({}, '', '/watch/77')
    vi.mocked(axios.get).mockResolvedValue([null, { data: { subtitle: cue('Hello together') } }] as any)
    render(<Subtitles video={video} />, { wrapper })
    expect(axios.get).toHaveBeenCalledWith('/api/videos/1/subtitle', { app: { validation: false } })
    await screen.findByText('Hello together')
    window.history.replaceState({}, '', '/')
  })

  it.each(['<html>SPA fallback</html>', {}, { subtitle: null }, { subtitle: '' }, { subtitle: 'Malformed cue\n\n' }])(
    'ignores an invalid or empty subtitle response: %j',
    async (data) => {
      vi.mocked(axios.get).mockResolvedValue([null, { data }] as any)
      const { container } = render(<Subtitles video={video} />, { wrapper })
      await act(async () => {})
      expect(container.innerHTML).toBe('')
    }
  )

  it('handles a failed request without rejecting the effect', async () => {
    vi.mocked(axios.get).mockRejectedValue(new Error('Network unavailable'))
    const { container } = render(<Subtitles video={video} />, { wrapper })
    await act(async () => {})
    expect(container.innerHTML).toBe('')
  })

  it('loads changed subtitles and ignores an older response that arrives afterward', async () => {
    let finishOldRequest: (value: any) => void
    vi.mocked(axios.get)
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            finishOldRequest = resolve
          })
      )
      .mockResolvedValueOnce([null, { data: { subtitle: cue('Current subtitles') } }] as any)
    const { rerender } = render(<Subtitles video={video} />, { wrapper })
    rerender(<Subtitles video={{ ...video, id: 2 }} />)
    await screen.findByText('Current subtitles')
    await act(async () => finishOldRequest([null, { data: { subtitle: cue('Stale subtitles') } }]))
    expect(screen.queryByText('Stale subtitles')).toBeNull()
    expect(screen.getByText('Current subtitles')).toBeTruthy()

    rerender(<Subtitles video={{ ...video, id: 3, subtitle_url: null as unknown as string }} />)
    await waitFor(() => expect(screen.queryByText('Current subtitles')).toBeNull())
    expect(axios.get).toHaveBeenCalledTimes(2)
  })
})
