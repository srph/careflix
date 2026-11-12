import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * State that falls back to `rest` on its own after `duration` ms, e.g. a "Copied" check or a brief announcement.
 * Setting it again restarts the clock; `reset` goes back to `rest` straight away.
 */
export function useTransientState<T>(rest: T, duration: number): [T, (value: T) => void, () => void] {
  const [value, setValue] = useState<T>(rest)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const restRef = useRef(rest)
  restRef.current = rest

  useEffect(() => () => clearTimeout(timer.current), [])

  const show = useCallback((next: T) => {
    clearTimeout(timer.current)
    setValue(next)
    timer.current = setTimeout(() => setValue(restRef.current), duration)
  }, [duration])

  const reset = useCallback(() => {
    clearTimeout(timer.current)
    setValue(restRef.current)
  }, [])

  return [value, show, reset]
}
