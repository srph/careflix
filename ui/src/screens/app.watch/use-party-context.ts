import { AppWatchContext } from './app-watch-context'
import { useContext } from 'react'
import { ContextType } from './app-watch-types'

export function usePartyContext(): ContextType {
  const context = useContext(AppWatchContext)
  if (!context) throw new Error('usePartyContext needs a loaded watch room')
  return context
}
