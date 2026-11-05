import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import usePresence from './usePresence'

const { client, channels } = vi.hoisted(() => {
  const channels = new Map<string, any>()
  const client = {
    subscribe: vi.fn((name: string) => channels.get(name)),
    channel: (name: string) => channels.get(name),
    unsubscribe: vi.fn()
  }
  return { client, channels }
})
vi.mock('~/lib/pusher', () => ({ default: () => client }))

function presenceChannel(name: string, ids: AppId[] = [], subscribed = false) {
  const listeners = new Map<string, Set<() => void>>()
  const channel = {
    subscribed,
    members: { each: (callback: (member: { id: string }) => void) => ids.forEach(id => callback({ id: String(id) })) },
    bind: (event: string, callback: () => void) => {
      if (!listeners.has(event)) listeners.set(event, new Set())
      listeners.get(event).add(callback)
    },
    unbind: (event: string, callback: () => void) => listeners.get(event)?.delete(callback),
    update: (nextIds: AppId[], event = 'pusher:subscription_succeeded') => {
      ids = nextIds
      channel.subscribed = true
      listeners.get(event)?.forEach(callback => callback())
    }
  }
  channels.set(name, channel)
  return channel
}

beforeEach(() => {
  channels.clear()
  vi.clearAllMocks()
})

describe('presence rosters', () => {
  it('initializes from the subscription roster, then follows joins and leaves', () => {
    const channel = presenceChannel('presence-chat-party.1')
    const { result } = renderHook(() => usePresence('presence-chat-party.1'))
    expect(result.current).toBeNull()

    act(() => channel.update([1, '2']))
    expect(result.current).toEqual(new Set(['1', '2']))
    act(() => channel.update([1, 2, 3], 'pusher:member_added'))
    expect(result.current).toEqual(new Set(['1', '2', '3']))
    act(() => channel.update([1, 3], 'pusher:member_removed'))
    expect(result.current).toEqual(new Set(['1', '3']))
  })

  it('reads an already subscribed global channel when a new consumer mounts', () => {
    presenceChannel('presence-chat', [2], true)
    const { result } = renderHook(() => usePresence('presence-chat'))
    expect(result.current).toEqual(new Set(['2']))
  })

  it('replaces stale membership on reconnect, including an empty roster', () => {
    const channel = presenceChannel('presence-chat', [1, 2], true)
    const { result } = renderHook(() => usePresence('presence-chat'))
    act(() => channel.update([3]))
    expect(result.current).toEqual(new Set(['3']))
    act(() => channel.update([]))
    expect(result.current).toEqual(new Set())
  })

  it('does not carry the old roster into another room or a disabled subscription', () => {
    presenceChannel('presence-chat-party.1', [1], true)
    const next = presenceChannel('presence-chat-party.2')
    const { result, rerender } = renderHook(({ name }) => usePresence(name), {
      initialProps: { name: 'presence-chat-party.1' }
    })
    rerender({ name: 'presence-chat-party.2' })
    expect(result.current).toBeNull()
    act(() => next.update([2]))
    expect(result.current).toEqual(new Set(['2']))
    rerender({ name: '' })
    expect(result.current).toBeNull()
  })
})
