import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useLocalStorageState from './useLocalStorageState'

const isLevel = (value: unknown): value is 'a' | 'b' => value === 'a' || value === 'b'

afterEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
})

describe('local storage state', () => {
  it('starts from the fallback and remembers what you set', () => {
    const { result, unmount } = renderHook(() => useLocalStorageState('k', 'a', isLevel))
    expect(result.current[0]).toBe('a')
    act(() => result.current[1]('b'))
    expect(result.current[0]).toBe('b')
    expect(localStorage.getItem('k')).toBe('"b"')
    unmount()
    const again = renderHook(() => useLocalStorageState('k', 'a', isLevel))
    expect(again.result.current[0]).toBe('b')
  })

  it('falls back on broken or rejected values', () => {
    localStorage.setItem('broken', '{nope')
    localStorage.setItem('rejected', '"z"')
    expect(renderHook(() => useLocalStorageState('broken', 'a', isLevel)).result.current[0]).toBe('a')
    expect(renderHook(() => useLocalStorageState('rejected', 'a', isLevel)).result.current[0]).toBe('a')
  })

  it('takes an updater, and still updates when storage refuses the write', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('full') })
    const { result } = renderHook(() => useLocalStorageState('n', 1))
    act(() => result.current[1](n => n + 1))
    act(() => result.current[1](n => n + 1))
    expect(result.current[0]).toBe(3)
  })

  it('reads the new key when it changes', () => {
    localStorage.setItem('user.2', '"b"')
    const { result, rerender } = renderHook(({ id }) => useLocalStorageState(`user.${id}`, 'a', isLevel), { initialProps: { id: 1 } })
    expect(result.current[0]).toBe('a')
    rerender({ id: 2 })
    expect(result.current[0]).toBe('b')
    act(() => result.current[1]('a'))
    expect(localStorage.getItem('user.2')).toBe('"a"')
    expect(localStorage.getItem('user.1')).toBeNull()
  })

  it('follows writes from other tabs', () => {
    const { result } = renderHook(() => useLocalStorageState('k', 'a', isLevel))
    localStorage.setItem('k', '"b"')
    act(() => { window.dispatchEvent(new StorageEvent('storage', { key: 'k' })) })
    expect(result.current[0]).toBe('b')
  })
})
