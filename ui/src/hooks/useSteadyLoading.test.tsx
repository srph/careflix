import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useSteadyLoading from './useSteadyLoading'

beforeEach(() => vi.useFakeTimers())
afterEach(() => vi.useRealTimers())

const setup = (loading: boolean) => renderHook(props => useSteadyLoading(props.loading), { initialProps: { loading } })

describe('steady loading', () => {
  it('never shows a placeholder for a quick load', () => {
    const { result, rerender } = setup(true)
    expect(result.current).toEqual({ pending: true, placeholder: false })
    act(() => vi.advanceTimersByTime(200))
    rerender({ loading: false })
    expect(result.current).toEqual({ pending: false, placeholder: false })
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current.placeholder).toBe(false)
  })

  it('shows the placeholder after 300ms and holds it for at least 400ms', () => {
    const { result, rerender } = setup(true)
    act(() => vi.advanceTimersByTime(300))
    expect(result.current).toEqual({ pending: true, placeholder: true })
    act(() => vi.advanceTimersByTime(350))
    rerender({ loading: false })
    expect(result.current).toEqual({ pending: true, placeholder: true })
    act(() => vi.advanceTimersByTime(49))
    expect(result.current.pending).toBe(true)
    act(() => vi.advanceTimersByTime(1))
    expect(result.current).toEqual({ pending: false, placeholder: false })
  })

  it('lets go at once when a slow load ran past the minimum', () => {
    const { result, rerender } = setup(true)
    act(() => vi.advanceTimersByTime(1200))
    rerender({ loading: false })
    act(() => vi.advanceTimersByTime(0))
    expect(result.current.pending).toBe(false)
  })

  it('keeps the placeholder up when loading starts again during the hold', () => {
    const { result, rerender } = setup(true)
    act(() => vi.advanceTimersByTime(400))
    rerender({ loading: false })
    act(() => vi.advanceTimersByTime(100))
    rerender({ loading: true })
    act(() => vi.advanceTimersByTime(1000))
    expect(result.current).toEqual({ pending: true, placeholder: true })
  })
})
