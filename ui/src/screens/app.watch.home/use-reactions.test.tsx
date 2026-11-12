import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useReactions, MAX_FLOATS, REACTION_EVENT, makePath } from './use-reactions'

const { client, channel } = vi.hoisted(() => {
  const channel = { subscribed: true, bind: vi.fn(), unbind: vi.fn(), trigger: vi.fn(() => true) }
  const client = { subscribe: vi.fn(() => channel), unsubscribe: vi.fn(), channel: vi.fn(() => channel) }
  return { client, channel }
})
vi.mock('~/lib/pusher/pusher', () => ({ pusher: () => client }))

const member = (id: AppId, name: string) => ({ id, name }) as AppPartyMember
const party = { id: 9, members: [member(1, 'Kier'), member(2, 'Joyce'), member(3, 'Mira')] }
const me = { id: 1 }
const receive = (data: unknown) => {
  const handler = channel.bind.mock.calls.find(([event]) => event === REACTION_EVENT)![1]
  act(() => handler(data))
}

beforeEach(() => {
  vi.clearAllMocks()
  channel.subscribed = true
})

describe('reactions', () => {
  it('floats your own reaction straight away and tells the room', () => {
    const { result } = renderHook(() => useReactions(party, me))
    act(() => result.current.send('😂'))
    expect(result.current.floats).toMatchObject([{ emoji: '😂', name: 'You' }])
    expect(channel.trigger).toHaveBeenCalledExactlyOnceWith(REACTION_EVENT, { userId: 1, emoji: '😂' })
  })

  it('names friends from the party, not the payload', () => {
    const { result } = renderHook(() => useReactions(party, me))
    expect(client.subscribe).toHaveBeenCalledWith('private-party.9')
    receive({ userId: 2, emoji: '🔥', name: 'Someone else' })
    expect(result.current.floats).toMatchObject([{ emoji: '🔥', name: 'Joyce' }])
  })

  it('ignores unknown emoji, strangers and its own echo', () => {
    const { result } = renderHook(() => useReactions(party, me))
    receive({ userId: 2, emoji: '💩' })
    receive({ userId: 99, emoji: '😂' })
    receive({ userId: 1, emoji: '😂' })
    receive(null)
    expect(result.current.floats).toEqual([])
  })

  it('keeps only the newest floats and drops finished ones', () => {
    const { result } = renderHook(() => useReactions(party, me))
    for (let i = 0; i < MAX_FLOATS + 3; i++) receive({ userId: 3, emoji: '😭' })
    expect(result.current.floats).toHaveLength(MAX_FLOATS)
    act(() => result.current.remove(result.current.floats[0].id))
    expect(result.current.floats).toHaveLength(MAX_FLOATS - 1)
  })

  it('drops friends’ reactions while hidden, keeps your own, and picks up again after', () => {
    const { result, rerender } = renderHook(({ show }) => useReactions(party, me, show), {
      initialProps: { show: false }
    })
    receive({ userId: 2, emoji: '🔥' })
    act(() => result.current.send('😂'))
    expect(result.current.floats).toMatchObject([{ emoji: '😂', name: 'You' }])
    rerender({ show: true })
    receive({ userId: 3, emoji: '😭' })
    expect(result.current.floats.map((float) => float.name)).toEqual(['You', 'Mira'])
  })

  it('still floats locally before the room channel is subscribed', () => {
    channel.subscribed = false
    const { result } = renderHook(() => useReactions(party, me))
    act(() => result.current.send('👀'))
    expect(result.current.floats).toHaveLength(1)
    expect(channel.trigger).not.toHaveBeenCalled()
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
