import * as React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PlayaProvider } from './playa'
import { PlayaSubtitles } from './playa-subtitles'
import { usePlaya } from './use-playa'

const cue = (text: string) => `1\n00:00:00,000 --> 00:00:05,000\n${text}\n\n`

function Player(props: { src: string; subtitles: (() => Promise<string | null>) | null }) {
  // A second in, so the cue above is showing.
  const playa = usePlaya({ src: props.src, initialTime: 1, subtitles: props.subtitles })
  return (
    <PlayaProvider playa={playa}>
      <video data-testid="video" ref={playa.$video} {...playa.events} />
      <PlayaSubtitles />
    </PlayaProvider>
  )
}

let client: QueryClient
function renderPlayer(props: React.ComponentProps<typeof Player>) {
  const view = render(
    <QueryClientProvider client={client}>
      <Player {...props} />
    </QueryClientProvider>
  )
  // Subtitles wait for the first frame.
  fireEvent.loadedData(screen.getByTestId('video'))
  return {
    ...view,
    rerender: (next: React.ComponentProps<typeof Player>) =>
      view.rerender(
        <QueryClientProvider client={client}>
          <Player {...next} />
        </QueryClientProvider>
      )
  }
}

beforeEach(() => {
  client = new QueryClient()
})

describe('playa subtitles', () => {
  it('loads the file once and shows the cue at the current time', async () => {
    const load = vi.fn(async () => cue('Hello together'))
    renderPlayer({ src: 'a.mp4', subtitles: load })
    await screen.findByText('Hello together')
    expect(load).toHaveBeenCalledOnce()
  })

  it.each([null, '', 'Malformed cue\n\n'])('shows nothing for an empty or broken file: %j', async (file) => {
    renderPlayer({ src: 'a.mp4', subtitles: async () => file })
    await act(async () => {})
    expect(screen.queryByTestId('subtitle')).toBeNull()
  })

  it('shows nothing when loading fails', async () => {
    renderPlayer({ src: 'a.mp4', subtitles: () => Promise.reject(new Error('Network unavailable')) })
    await act(async () => {})
    expect(screen.queryByTestId('subtitle')).toBeNull()
  })

  it('never loads without a loader', async () => {
    renderPlayer({ src: 'a.mp4', subtitles: null })
    await act(async () => {})
    expect(screen.queryByTestId('subtitle')).toBeNull()
  })

  it('loads a new source’s file and ignores a slower answer for the last one', async () => {
    let finishOld!: (file: string) => void
    const { rerender } = renderPlayer({
      src: 'a.mp4',
      subtitles: () => new Promise<string>((resolve) => (finishOld = resolve))
    })
    rerender({ src: 'b.mp4', subtitles: async () => cue('Current subtitles') })
    fireEvent.loadedData(screen.getByTestId('video'))
    await screen.findByText('Current subtitles')
    await act(async () => finishOld(cue('Stale subtitles')))
    expect(screen.queryByText('Stale subtitles')).toBeNull()

    rerender({ src: 'c.mp4', subtitles: null })
    await waitFor(() => expect(screen.queryByText('Current subtitles')).toBeNull())
  })
})
