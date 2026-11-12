import * as React from 'react'
import { ContextType } from './app-watch-types'

// Null outside a loaded watch room; usePartyContext() reads it.
export const AppWatchContext = React.createContext<ContextType | null>(null)
