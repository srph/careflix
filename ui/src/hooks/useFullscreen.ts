import { useState, useEffect } from 'react'
import screenfull, { Screenfull } from 'screenfull'

type ReturnValue = [boolean, () => void]

function useFullscreen(): ReturnValue {
  const sf = <Screenfull>screenfull

  const [isFullscreen, setIsFullscreen] = useState(sf.isFullscreen)

  useEffect(() => {
    function handleScreenfullChange() {
      setIsFullscreen(sf.isFullscreen)
    }

    if (sf.enabled) {
      sf.on('change', handleScreenfullChange)
    }

    return () => {
      sf.off('change', handleScreenfullChange)
    }
  }, [])

  function toggleFullscreen() {
    if (!sf.enabled) {
      return
    }

    if (sf.isFullscreen) {
      sf.exit()
    } else {
      sf.request()
    }
  }

  return [isFullscreen, toggleFullscreen]
}

export {
  useFullscreen,
  useFullscreen as default
}