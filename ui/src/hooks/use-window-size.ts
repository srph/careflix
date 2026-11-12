import { useEffect, useState } from 'react'

export function useWindowSize(initialWidth = Infinity, initialHeight = Infinity) {
  const [size, setSize] = useState({ width: initialWidth, height: initialHeight })
  useEffect(() => {
    function update() {
      setSize({ width: window.innerWidth, height: window.innerHeight })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return size
}
