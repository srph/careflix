import { useEffect } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'


/**
 * @NOTE Don't mount this twice; only on the root node.
 */
function WindowVhSetter() {
  const {height} = useWindowSize()

  useEffect(() => {
    document.body.style.setProperty('--window-vh', `${height}px`)
  }, [height])

  return null
}

export default WindowVhSetter