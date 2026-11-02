import { useEffect, useRef, type DependencyList, type EffectCallback } from 'react'

export default function useUpdateEffect(effect: EffectCallback, deps: DependencyList) {
  const initial = useRef(true)
  // Select during render to retain the replaced hook's update-only semantics,
  // including React's development effect replay.
  useEffect(initial.current ? () => { initial.current = false } : effect, deps)
}
