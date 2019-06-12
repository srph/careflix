import * as React from 'react'
import { ContextType } from '../types'

export default React.createContext<ContextType>({
  party: null,
  isLoading: false,
  onCancel: () => {},
  onInvite: () => {},
  onChangeVideo: () => {}
})