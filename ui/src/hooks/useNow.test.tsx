import { StrictMode, type PropsWithChildren } from 'react'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useNow from './useNow'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-11-02T00:00:00Z'))
})

describe('invitation clock', () => {
  it('updates the current time at the requested interval', () => {
    const { result } = renderHook(() => useNow({ interval: 1000 }))
    const initial = result.current.getTime()
    act(() => { vi.advanceTimersByTime(2000) })
    expect(result.current.getTime()).toBe(initial + 2000)
  })

  it('uses a changed interval after rerendering', () => {
    const { result, rerender } = renderHook(({ interval }) => useNow({ interval }), { initialProps: { interval: 1000 } })
    rerender({ interval: 200 })
    act(() => { vi.advanceTimersByTime(200) })
    expect(result.current.toISOString()).toBe('2026-11-02T00:00:00.200Z')
  })

  it('cleans up its timer after Strict Mode mounting and unmounting', () => {
    const wrapper = ({ children }: PropsWithChildren) => <StrictMode>{children}</StrictMode>
    const { unmount } = renderHook(() => useNow({ interval: 1000 }), { wrapper })
    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
