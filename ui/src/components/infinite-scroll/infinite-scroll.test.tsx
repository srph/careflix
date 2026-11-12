import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InfiniteScroll } from './infinite-scroll'

let intersect: (entries: Partial<IntersectionObserverEntry>[]) => void
beforeEach(() => {
  vi.stubGlobal('IntersectionObserver', class {
    constructor(callback: typeof intersect) { intersect = callback }
    observe() {}
    disconnect() {}
  })
})
afterEach(() => vi.unstubAllGlobals())

function reachEnd() {
  act(() => { intersect([{ isIntersecting: true }]); window.dispatchEvent(new Event('scroll')) })
}

describe('catalog pagination', () => {
  it('waits for scrolling and prevents overlapping page requests', async () => {
    let finish: () => void = () => {}
    const onLoadMore = vi.fn(() => new Promise<void>(resolve => { finish = resolve }))
    render(<InfiniteScroll itemCount={30} hasMore isLoading={false} onLoadMore={onLoadMore}>Movies</InfiniteScroll>)
    act(() => intersect([{ isIntersecting: true }]))
    expect(onLoadMore).not.toHaveBeenCalled()
    reachEnd()
    reachEnd()
    expect(onLoadMore).toHaveBeenCalledTimes(1)
    await act(async () => finish())
    reachEnd()
    expect(onLoadMore).toHaveBeenCalledTimes(1)
  })

  it('allows another page after the item count grows', async () => {
    const onLoadMore = vi.fn(async () => {})
    const { rerender } = render(<InfiniteScroll itemCount={30} hasMore isLoading={false} onLoadMore={onLoadMore}>Movies</InfiniteScroll>)
    reachEnd()
    await waitFor(() => expect(onLoadMore).toHaveResolvedTimes(1))
    rerender(<InfiniteScroll itemCount={60} hasMore isLoading={false} onLoadMore={onLoadMore}>Movies</InfiniteScroll>)
    reachEnd()
    await waitFor(() => expect(onLoadMore).toHaveResolvedTimes(2))
  })

  it('retries a failed page on explicit request', async () => {
    const onLoadMore = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined)
    render(<InfiniteScroll itemCount={30} hasMore isLoading={false} onLoadMore={onLoadMore}>Movies</InfiniteScroll>)
    reachEnd()
    await screen.findByRole('alert')
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(onLoadMore).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull())
  })

  it('does not request more after the last page', () => {
    const onLoadMore = vi.fn()
    const { rerender } = render(<InfiniteScroll itemCount={30} hasMore isLoading={false} onLoadMore={onLoadMore}>Movies</InfiniteScroll>)
    rerender(<InfiniteScroll itemCount={30} hasMore={false} isLoading={false} onLoadMore={onLoadMore}>Movies</InfiniteScroll>)
    fireEvent.scroll(window)
    expect(onLoadMore).not.toHaveBeenCalled()
  })
})
