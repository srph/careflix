import { useEffect, useRef } from 'react'

/**
 * Useful if you need access to your props in a custom document event listener.
 *
 * Unless you re-attach the events everytime your props change
 * (which is a deal breaker if you have object parameters),
 * you will get stale props (usually from the first mount).
 *
 * @usage const props = usePropRef(hookProps)
 */
function usePropRef<T = any>(props: T) {
  const propRef = useRef<T>(props)

  useEffect(() => {
    propRef.current = props
  }, [props])

  return propRef.current
}

export {
  usePropRef,
  usePropRef as default
}
