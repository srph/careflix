import * as React from 'react'

// Null outside a loaded watch room; useParty() reads it.
export const AppWatchContext = React.createContext<{ party: AppParty } | null>(null)
