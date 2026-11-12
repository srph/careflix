import { useContext } from 'react'
import { AppWatchContext } from './app-watch-context'

/** The room's party. Only provided once it has loaded. */
export function useParty(): AppParty {
  const context = useContext(AppWatchContext)
  if (!context) throw new Error('useParty needs a loaded watch room')
  return context.party
}
