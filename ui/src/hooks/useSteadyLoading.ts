import { useEffect, useRef, useState } from 'react'

type Options = {
  /** Loads that finish sooner never show a placeholder. */
  delay?: number
  /** Once shown, the placeholder stays at least this long so it never flashes. */
  min?: number
}

/**
 * Smooths a loading flag for placeholders such as skeletons.
 * `pending` stays true while loading and while a shown placeholder is held; render results only once it's false.
 * `placeholder` is true once loading has run past `delay`.
 */
export default function useSteadyLoading(loading: boolean, { delay = 300, min = 400 }: Options = {}) {
  const [shownAt, setShownAt] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    clearTimeout(timer.current)
    if (loading) {
      if (shownAt === null) timer.current = setTimeout(() => setShownAt(Date.now()), delay)
    } else if (shownAt !== null) {
      timer.current = setTimeout(() => setShownAt(null), Math.max(0, min - (Date.now() - shownAt)))
    }
    return () => clearTimeout(timer.current)
  }, [loading, shownAt, delay, min])

  const placeholder = shownAt !== null
  return { pending: loading || placeholder, placeholder }
}

export { useSteadyLoading }
