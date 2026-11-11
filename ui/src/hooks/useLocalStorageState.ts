import { useCallback, useEffect, useRef, useState } from 'react'

type Guard<T> = (value: unknown) => value is T

function read<T>(key: string, fallback: T, isValid?: Guard<T>): T {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    const value: unknown = JSON.parse(raw)
    return !isValid || isValid(value) ? (value as T) : fallback
  } catch {
    return fallback
  }
}

function write<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be full or blocked; the value still holds for this visit.
  }
}

/**
 * `useState` that remembers its value on this device under `key`, as JSON.
 * Anything missing, unreadable or rejected by `isValid` falls back to `fallback`.
 * Changing `key` (another account) reads that key's value; other tabs' writes come through too.
 */
export default function useLocalStorageState<T>(key: string, fallback: T, isValid?: Guard<T>): [T, (next: T | ((current: T) => T)) => void] {
  const [state, setState] = useState(() => ({ key, value: read(key, fallback, isValid) }))
  let current = state
  if (state.key !== key) {
    current = { key, value: read(key, fallback, isValid) }
    setState(current)
  }

  const latest = useRef(current)
  latest.current = current

  const set = useCallback((next: T | ((current: T) => T)) => {
    const { key, value } = latest.current
    const resolved = typeof next === 'function' ? (next as (current: T) => T)(value) : next
    write(key, resolved)
    latest.current = { key, value: resolved }
    setState(latest.current)
  }, [])

  const fallbackRef = useRef(fallback)
  fallbackRef.current = fallback
  const guardRef = useRef(isValid)
  guardRef.current = isValid

  useEffect(() => {
    function handleStorage(evt: StorageEvent) {
      if (evt.key !== key) return
      setState({ key, value: read(key, fallbackRef.current, guardRef.current) })
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [key])

  return [current.value, set]
}

export { useLocalStorageState }
