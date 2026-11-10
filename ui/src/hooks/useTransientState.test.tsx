import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useTransientState from './useTransientState'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

describe('transient state', () => {
  it('falls back on its own, and setting it again restarts the clock', () => {
    const { result } = renderHook(() => useTransientState(false, 1000))
    act(() => result.current[1](true))
    expect(result.current[0]).toBe(true)
    act(() => vi.advanceTimersByTime(800))
    act(() => result.current[1](true))
    act(() => vi.advanceTimersByTime(800))
    expect(result.current[0]).toBe(true)
    act(() => vi.advanceTimersByTime(200))
    expect(result.current[0]).toBe(false)
  })

  it('resets straight away and never fires after unmount', () => {
    const { result, unmount } = renderHook(() => useTransientState<string | null>(null, 1000))
    act(() => result.current[1]('Leo'))
    act(() => result.current[2]())
    expect(result.current[0]).toBeNull()
    act(() => result.current[1]('Mia'))
    unmount()
    expect(() => vi.advanceTimersByTime(1000)).not.toThrow()
    expect(vi.getTimerCount()).toBe(0)
  })
})
