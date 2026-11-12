import * as React from 'react'
import { ContextType } from './app-watch-types'

export const AppWatchContext = React.createContext<ContextType>({
  party: null,
  isLoading: false,
  playbackRevision: 0,
  onCancel: () => {},
  onInvite: () => {},
  onAccept: () => {},
  onDecline: () => {},
  onChangeVideo: () => {}
})
