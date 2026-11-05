import * as React from 'react'
import { ContextType } from '../types'

export default React.createContext<ContextType>({
  party: null,
  isLoading: false,
  playbackRevision: 0,
  onCancel: () => {},
  onInvite: () => {},
  onAccept: () => {},
  onDecline: () => {},
  onChangeVideo: () => {}
})
