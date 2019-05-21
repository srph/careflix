import { useState } from 'react'
import useInterval from '@use-it/interval'

interface Props {
  interval: number
}

/**
 * Provides you an updated current date instance
 */
function useNow(props: Props) {
  const [now, setNow] = useState(new Date())

  useInterval(() => {
    setNow(new Date())
  }, props.interval)

  return now
}

export {
  useNow,
  useNow as default
}