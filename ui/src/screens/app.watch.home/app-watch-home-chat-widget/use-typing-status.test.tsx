import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useTypingStatus, TYPING_EVENT, TYPING_PING_EVERY, TYPING_TTL } from './use-typing-status'

const { client, channel } = vi.hoisted(() => {
  const channel = { subscribed: true, bind: vi.fn(), unbind: vi.fn(), trigger: vi.fn(() => true) }
  const client = { subscribe: vi.fn(() => channel), unsubscribe: vi.fn(), channel: vi.fn(() => channel) }
  return { client, channel }
})
vi.mock('~/lib/pusher/pusher', () => ({ pusher: () => client }))

const me = { id: 1, name: 'Kier' }
const receive = (user: { id: AppId; name: string }) => {
  const handler = channel.bind.mock.calls.find(([event]) => event === TYPING_EVENT)![1]
  act(() => handler({ user }))
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.clearAllMocks()
  channel.subscribed = true
})
afterEach(() => vi.useRealTimers())

describe('typing status', () => {
  it('lists other typers until they go quiet', () => {
    const { result } = renderHook(() => useTypingStatus(9, me))
    expect(client.subscribe).toHaveBeenCalledWith('private-party.9')
    receive({ id: 2, name: 'Joyce' })
    receive({ id: 1, name: 'Kier' })
    expect(result.current.names).toEqual(['Joyce'])
    act(() => vi.advanceTimersByTime(TYPING_TTL - 500))
    receive({ id: 3, name: 'Mira' })
    expect(result.current.names).toEqual(['Joyce', 'Mira'])
    act(() => vi.advanceTimersByTime(600))
    expect(result.current.names).toEqual(['Mira'])
    act(() => vi.advanceTimersByTime(TYPING_TTL))
    expect(result.current.names).toEqual([])
  })

  it('drops a typer as soon as their message arrives', () => {
    const { result } = renderHook(() => useTypingStatus(9, me))
    receive({ id: 2, name: 'Joyce' })
    act(() => result.current.clear(2))
    expect(result.current.names).toEqual([])
  })

  it('pings at most every few seconds, and again right after sending', () => {
    const { result } = renderHook(() => useTypingStatus(9, me))
    act(() => {
      result.current.notify()
      result.current.notify()
    })
    expect(channel.trigger).toHaveBeenCalledExactlyOnceWith(TYPING_EVENT, { user: me })
    act(() => vi.advanceTimersByTime(TYPING_PING_EVERY))
    act(() => result.current.notify())
    expect(channel.trigger).toHaveBeenCalledTimes(2)
    act(() => {
      result.current.sent()
      result.current.notify()
    })
    expect(channel.trigger).toHaveBeenCalledTimes(3)
  })

  it('stays quiet until the room channel is subscribed', () => {
    channel.subscribed = false
    const { result } = renderHook(() => useTypingStatus(9, me))
    act(() => result.current.notify())
    expect(channel.trigger).not.toHaveBeenCalled()
  })
})
