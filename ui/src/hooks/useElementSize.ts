import { useState, useLayoutEffect } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'

function useElementSize(ref) {
  const windowSize = useWindowSize()
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }
    const box = ref.current.getBoundingClientRect()
    setHeight(box.height)
    setWidth(box.width)
  }, [ref, windowSize.height, windowSize.width])

  return { width, height }
}

export { useElementSize, useElementSize as default }
