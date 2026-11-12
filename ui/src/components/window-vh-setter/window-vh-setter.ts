import { useEffect } from 'react'
import { useWindowSize } from '~/hooks/use-window-size'

/**
 * @NOTE Don't mount this twice; only on the root node.
 */
export function WindowVhSetter(): null {
  const { height } = useWindowSize()

  useEffect(() => {
    document.body.style.setProperty('--window-vh', `${height}px`)
  }, [height])

  return null
}
