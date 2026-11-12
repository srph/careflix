import { useCallback, useEffect, useRef } from 'react'
import { useBlocker, type BlockerFunction, type Location, type NavigationType } from 'react-router'

type Callback = (location: Location, action: NavigationType) => string | null | undefined

function useRouterBlock(callback: Callback, _dependencies?: unknown[]) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  const message = useRef<string | null | undefined>(null)
  const shouldBlock = useCallback<BlockerFunction>(({ nextLocation, historyAction }) => {
    message.current = callbackRef.current(nextLocation, historyAction)
    return Boolean(message.current)
  }, [])
  const blocker = useBlocker(shouldBlock)
  useEffect(() => {
    if (blocker.state !== 'blocked') return
    if (!message.current || window.confirm(message.current)) blocker.proceed()
    else blocker.reset()
  }, [blocker])
}

export {
  useRouterBlock
}
