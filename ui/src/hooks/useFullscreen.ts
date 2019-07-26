import { useState, useEffect } from 'react'
import screenfull = require('screenfull')

type ReturnValue = [boolean, () => void]

function useFullscreen(): ReturnValue {
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen)

  useEffect(() => {
    function handleScreenfullChange() {
      setIsFullscreen(screenfull.isFullscreen)
    }

    if (screenfull.enabled) {
      screenfull.on('change', handleScreenfullChange)
    }

    return () => {
      screenfull.off('change', handleScreenfullChange)
    }
  })

  function toggleFullscreen() {
    if (!screenfull.enabled) {
      return
    }

    if (screenfull.isFullscreen) {
      screenfull.exit()
    } else {
      screenfull.request()
    }
  }

  return [isFullscreen, toggleFullscreen]
}

export {
  useFullscreen,
  useFullscreen as default
}