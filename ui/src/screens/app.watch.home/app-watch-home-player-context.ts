import * as React from 'react'
import type { PlayerChrome } from './use-player-chrome'
import type { PlayerSync } from './use-player-sync'

// Null outside the watch page; usePlayer() reads it.
export const AppWatchHomePlayerContext = React.createContext<{ player: PlayerSync; chrome: PlayerChrome } | null>(null)
