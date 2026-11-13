import * as React from 'react'
import { act, render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { Playa } from '~/components/playa/use-playa'
import { REACTION_EVENT, usePartyPlaya } from './use-party-playa'

const { client, channel, layout, syncState } = vi.hoisted(() => {
  const channel = { subscribed: true, bind: vi.fn(), unbind: vi.fn(), trigger: vi.fn(() => true) }
  const client = { subscribe: vi.fn(() => channel), unsubscribe: vi.fn(), channel: vi.fn(() => channel) }
  const layout = { sidebar: 'chat', activityLevel: 'all' }
  const syncState = { mutate: vi.fn() }
  return { client, channel, layout, syncState }
})
vi.mock('~/lib/pusher/pusher', () => ({ pusher: () => client }))
vi.mock('~/lib/auth/auth-queries', () => ({ useAuthUser: () => ({ id: 1, name: 'Kier' }) }))
vi.mock('~/screens/app.watch/queries/app-watch-party-queries', () => ({
  useSetParty: () => vi.fn(),
  useSyncStateMutation: () => syncState
}))
vi.mock('./app-watch-home-layout', () => ({ useWatchLayout: () => layout }))

const member = (id: AppId, name: string) => ({ id, name, avatar: '' }) as AppPartyMember
const party = {
  id: 9,
  current_time: 0,
  is_playing: false,
  members: [member(1, 'Kier'), member(2, 'Joyce'), member(3, 'Mira')],
  video: { id: 1, video_url: 'movie.mp4', duration: 100 }
} as unknown as AppParty

function renderPartyPlaya() {
  const result = { current: null as unknown as Playa }
  function Harness() {
    result.current = usePartyPlaya(party)
    return <video ref={result.current.$video} {...result.current.events} />
  }
  render(
    <QueryClientProvider client={new QueryClient()}>
      <Harness />
    </QueryClientProvider>
  )
  return result
}

const handler = (event: string) => channel.bind.mock.calls.find(([name]) => name === event)![1]
const receive = (data: unknown) => act(() => handler(REACTION_EVENT)(data))

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue()
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {})
  channel.subscribed = true
  layout.sidebar = 'chat'
  layout.activityLevel = 'all'
})

describe('the room’s playa', () => {
  it('floats your own reaction straight away and tells the room', () => {
    const playa = renderPartyPlaya()
    act(() => playa.current.react('😂'))
    expect(playa.current.floats).toMatchObject([{ emoji: '😂', name: 'You' }])
    expect(channel.trigger).toHaveBeenCalledExactlyOnceWith(REACTION_EVENT, { userId: 1, emoji: '😂' })
  })

  it('still floats locally before the room channel is subscribed', () => {
    channel.subscribed = false
    const playa = renderPartyPlaya()
    act(() => playa.current.react('👀'))
    expect(playa.current.floats).toHaveLength(1)
    expect(channel.trigger).not.toHaveBeenCalled()
  })

  it('names friends from the party, not the payload', () => {
    const playa = renderPartyPlaya()
    expect(client.subscribe).toHaveBeenCalledWith('private-party.9')
    receive({ userId: 2, emoji: '🔥', name: 'Someone else' })
    expect(playa.current.floats).toMatchObject([{ emoji: '🔥', name: 'Joyce' }])
  })

  it('ignores unknown emoji, strangers and its own echo', () => {
    const playa = renderPartyPlaya()
    receive({ userId: 2, emoji: '💩' })
    receive({ userId: 99, emoji: '😂' })
    receive({ userId: 1, emoji: '😂' })
    receive(null)
    expect(playa.current.floats).toEqual([])
  })

  it('drops friends’ reactions while chat is closed below Everything, and keeps your own', () => {
    layout.sidebar = 'closed'
    layout.activityLevel = 'activity'
    const playa = renderPartyPlaya()
    receive({ userId: 2, emoji: '🔥' })
    act(() => playa.current.react('😂'))
    expect(playa.current.floats.map((float) => float.name)).toEqual(['You'])
  })

  it('applies the room’s state without sending it back', () => {
    const playa = renderPartyPlaya()
    act(() => handler('state')({ state: { current_time: 42, is_playing: true } }))
    expect(playa.current.state).toMatchObject({ time: 42, isPlaying: true })
    expect(syncState.mutate).not.toHaveBeenCalled()

    act(() => playa.current.pause())
    expect(syncState.mutate).toHaveBeenCalledExactlyOnceWith({ is_playing: false, current_time: 42 })
  })
})
