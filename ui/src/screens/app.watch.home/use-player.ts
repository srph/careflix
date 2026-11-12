import { useContext } from 'react'
import { AppWatchHomePlayerContext } from './app-watch-home-player-context'

/** The watch page's player: `player` for playback and sync, `chrome` for the controls, chat and modals. */
export function usePlayer() {
  const context = useContext(AppWatchHomePlayerContext)
  if (!context) throw new Error('usePlayer needs the watch page')
  return context
}
