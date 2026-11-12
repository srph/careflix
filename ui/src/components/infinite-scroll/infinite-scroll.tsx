import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  itemCount: number
  hasMore: boolean
  isLoading: boolean
  threshold?: number
  onLoadMore: () => void | Promise<unknown>
  renderError?: (retry: () => void) => ReactNode
}

export function InfiniteScroll({
  children,
  itemCount,
  hasMore,
  isLoading,
  threshold = 300,
  onLoadMore,
  renderError
}: Props) {
  const sentinel = useRef<HTMLDivElement>(null)
  const inFlight = useRef(false)
  const nearEnd = useRef(false)
  const hasScrolled = useRef(false)
  const requestedCount = useRef<number | null>(null)
  const [error, setError] = useState(false)

  async function load(retry = false) {
    if (inFlight.current || !hasMore || (!retry && (isLoading || requestedCount.current === itemCount))) return
    inFlight.current = true
    requestedCount.current = itemCount
    setError(false)
    try {
      await onLoadMore()
    } catch {
      setError(true)
    } finally {
      inFlight.current = false
    }
  }

  useEffect(() => {
    if (!hasMore || isLoading || error || !sentinel.current) return
    nearEnd.current = false
    const observer = new IntersectionObserver(
      (entries) => {
        nearEnd.current = entries.some((entry) => entry.isIntersecting)
        // A page too short to scroll never fires a scroll event, so fill the screen without one.
        const canScroll = document.documentElement.scrollHeight > window.innerHeight
        if (nearEnd.current && (hasScrolled.current || !canScroll)) void load()
      },
      { rootMargin: `${threshold}px 0px` }
    )
    observer.observe(sentinel.current)
    // Otherwise wait for a scroll, as the replaced component did, rather than loading on first mount.
    function onScroll() {
      hasScrolled.current = true
      if (nearEnd.current) void load()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [hasMore, isLoading, itemCount, threshold, onLoadMore, error])

  return (
    <div aria-busy={isLoading}>
      {children}
      <div ref={sentinel} aria-hidden="true" style={{ height: 1 }} />
      {error &&
        (renderError ? (
          renderError(() => {
            void load(true)
          })
        ) : (
          <div role="alert">
            Unable to load more.{' '}
            <button
              type="button"
              onClick={() => {
                void load(true)
              }}>
              Retry
            </button>
          </div>
        ))}
    </div>
  )
}
