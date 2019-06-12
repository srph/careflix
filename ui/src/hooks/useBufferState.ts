import { useState, useRef } from 'react'
import useUpdateEffect from 'react-use/lib/useUpdateEffect'

interface Props {
  timeout: number
}

type Payload = [boolean, () => void]

function useBufferState(props: Props): Payload {
  const [state, internalSetState] = useState(false)
  const counterRef = useRef<number>(0)
  const timeoutRef = useRef<number>(null)
  
  function setState(): void {
    ++counterRef.current
    internalSetState(false)
  }

  useUpdateEffect(() => {
    internalSetState(true)

    timeoutRef.current = window.setTimeout(() => {
      internalSetState(false)
    }, props.timeout)

    return () => {
      window.clearTimeout(timeoutRef.current)
    }
  }, [counterRef.current])

  return [state, setState]
}

export {
  useBufferState,
  useBufferState as default
}