import { StrictMode, type PropsWithChildren } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useWindowSize from './useWindowSize'
import useUpdateEffect from './useUpdateEffect'
import { useAsyncEffect } from './useAsyncEffect'

describe('replacement hooks', () => {
  it('tracks browser resizing', () => {
    const { result, unmount } = renderHook(() => useWindowSize())
    expect(result.current.width).toBe(window.innerWidth)
    const previous = window.innerWidth
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 540, configurable: true })
      window.dispatchEvent(new Event('resize'))
    })
    expect(result.current.width).toBe(540)
    unmount()
    Object.defineProperty(window, 'innerWidth', { value: previous, configurable: true })
  })

  it('skips initial effects, then runs and cleans up on input changes', () => {
    const cleanup = vi.fn()
    const effect = vi.fn(() => cleanup)
    const wrapper = ({ children }: PropsWithChildren) => <StrictMode>{children}</StrictMode>
    const { rerender, unmount } = renderHook(({ value }) => useUpdateEffect(effect, [value]), { initialProps: { value: 1 }, wrapper })
    expect(effect).not.toHaveBeenCalled()
    rerender({ value: 2 })
    expect(effect).toHaveBeenCalledTimes(1)
    unmount()
    expect(cleanup).toHaveBeenCalledTimes(1)
  })

  it('reruns async work for changed inputs and supplies results to cleanup', async () => {
    const effect = vi.fn(async () => 'loaded')
    const destroy = vi.fn()
    const { rerender, unmount } = renderHook(({ endpoint }) => useAsyncEffect(effect, destroy, [endpoint]), { initialProps: { endpoint: 'first' } })
    await waitFor(() => expect(effect).toHaveResolvedWith('loaded'))
    rerender({ endpoint: 'first' })
    expect(effect).toHaveBeenCalledTimes(1)
    rerender({ endpoint: 'second' })
    expect(destroy).toHaveBeenCalledWith('loaded')
    await waitFor(() => expect(effect).toHaveResolvedTimes(2))
    unmount()
    expect(destroy).toHaveBeenCalledTimes(2)
  })
})
