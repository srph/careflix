import { useEffect, useRef } from 'react'

export function useInterval(callback: () => void, delay: number | null) {
  const callbackRef = useRef(callback)
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  useEffect(() => {
    if (delay === null) return
    const timer = window.setInterval(() => callbackRef.current(), delay)
    return () => window.clearInterval(timer)
  }, [delay])
}
