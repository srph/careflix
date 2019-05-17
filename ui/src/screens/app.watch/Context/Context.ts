import * as React from 'react'
import { State } from '../types'

export default React.createContext<State>({
  party: null,
  isLoading: false
})