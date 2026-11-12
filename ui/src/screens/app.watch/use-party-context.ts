import { AppWatchContext } from './app-watch-context'
import { useContext } from 'react'
import { ContextType } from './app-watch-types'

export function usePartyContext() {
  return useContext<ContextType>(AppWatchContext)
}