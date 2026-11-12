import { useEffect, type DependencyList } from 'react'

// Preserve the replaced helper's result/cleanup contract. Cancellation or error
// policy changes would be separate behavior changes outside this migration.
export function useAsyncEffect<T>(
  effect: () => Promise<T>,
  destroy: ((result?: T) => void) | null = null,
  inputs?: DependencyList
) {
  useEffect(() => {
    let result: T | undefined
    void effect().then((value) => {
      result = value
    })
    if (destroy) return () => destroy(result)
  }, inputs)
}
