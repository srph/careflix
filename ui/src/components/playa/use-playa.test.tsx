import * as React from 'react'
import { act, render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { type Playa, type PlayaOptions, usePlaya } from './use-playa'
import { MAX_FLOATS, makePath } from './playa-reactions'
import { LINE_MS, MAX_LINES, type PlayaActivity } from './playa-activity'

const joyce = { id: 2, name: 'Joyce' }

// usePlaya needs its <video> in the page, like PlayaElement gives it.
function renderPlaya(options: Partial<PlayaOptions> = {}) {
  const result = { current: null as unknown as Playa }
  function Harness() {
    result.current = usePlaya({ src: 'movie.mp4', duration: 100, ...options })
    return <video ref={result.current.$video} {...result.current.events} />
  }
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Harness />
    </QueryClientProvider>
  )
  return result
}

const line = (id: string, type: 'paused' | 'message' = 'paused'): PlayaActivity =>
  type === 'message' ? { id, type, by: joyce, text: 'hi' } : { id, type, by: joyce }

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('playa playback', () => {
  it('calls back for your moves and never for synced ones', () => {
    const onPlayback = vi.fn()
    const playa = renderPlaya({ onPlayback, initialTime: 30 })

    act(() => playa.current.play())
    expect(onPlayback).toHaveBeenLastCalledWith({ time: 30, isPlaying: true })
    act(() => playa.current.seek(50))
    expect(onPlayback).toHaveBeenLastCalledWith({ time: 50, isPlaying: true })
    act(() => playa.current.toggle())
    expect(onPlayback).toHaveBeenLastCalledWith({ time: 50, isPlaying: false })
    expect(onPlayback).toHaveBeenCalledTimes(3)

    act(() => playa.current.sync({ time: 80, isPlaying: true }))
    expect(onPlayback).toHaveBeenCalledTimes(3)
    expect(playa.current.state).toMatchObject({ time: 80, isPlaying: true })
  })

  it('keeps skips inside the video and volume between 0 and 1', () => {
    const playa = renderPlaya({ initialTime: 95 })
    act(() => playa.current.skip(10))
    expect(playa.current.state.time).toBe(100)
    act(() => playa.current.skip(-200))
    expect(playa.current.state.time).toBe(0)
    act(() => playa.current.setVolume(1.4))
    expect(playa.current.state.volume).toBe(1)
    act(() => playa.current.setVolume(-1))
    expect(playa.current.state.volume).toBe(0)
  })
})

describe('playa reactions', () => {
  it('floats your own as "You" and sends it; someone else’s floats with their name and is never sent', () => {
    const onReact = vi.fn()
    const playa = renderPlaya({ onReact })
    act(() => playa.current.react('😂'))
    act(() => playa.current.react('🔥', { by: joyce }))
    expect(playa.current.floats).toMatchObject([
      { emoji: '😂', name: 'You' },
      { emoji: '🔥', name: 'Joyce' }
    ])
    expect(onReact).toHaveBeenCalledExactlyOnceWith('😂')
  })

  it('keeps only the newest floats and drops finished ones', () => {
    const playa = renderPlaya()
    for (let i = 0; i < MAX_FLOATS + 3; i++) act(() => playa.current.react('😭', { by: joyce }))
    expect(playa.current.floats).toHaveLength(MAX_FLOATS)
    act(() => playa.current.dropFloat(playa.current.floats[0].id))
    expect(playa.current.floats).toHaveLength(MAX_FLOATS - 1)
  })

  it('keeps every path inside its ranges', () => {
    for (const r of [0, 0.999]) {
      const path = makePath(() => r)
      expect(path.duration).toBeGreaterThanOrEqual(2.6)
      expect(path.duration).toBeLessThanOrEqual(3.6)
      expect(path.rise).toBeGreaterThanOrEqual(50)
      expect(path.rise).toBeLessThanOrEqual(75)
      expect(path.size).toBeGreaterThanOrEqual(26)
      expect(path.size).toBeLessThanOrEqual(34)
      expect(path.ease).toMatch(/^cubic-bezier/)
    }
  })
})

describe('playa activity', () => {
  it('stacks the newest lines and lets each go after its time', () => {
    vi.useFakeTimers()
    const playa = renderPlaya()
    for (let i = 0; i < MAX_LINES + 2; i++) act(() => playa.current.activity(line(String(i))))
    expect(playa.current.lines.map((line) => line.id)).toEqual(['2', '3', '4', '5'])
    act(() => vi.advanceTimersByTime(LINE_MS + 20))
    expect(playa.current.lines).toEqual([])
  })

  it('clears the lines a caller no longer wants, or all of them', () => {
    const playa = renderPlaya()
    act(() => playa.current.activity(line('a')))
    act(() => playa.current.activity(line('b', 'message')))
    act(() => playa.current.clearActivity((activity) => activity.type === 'paused'))
    expect(playa.current.lines.map((line) => line.id)).toEqual(['a'])
    act(() => playa.current.clearActivity())
    expect(playa.current.lines).toEqual([])
  })
})
