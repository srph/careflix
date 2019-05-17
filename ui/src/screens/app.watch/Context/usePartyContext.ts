import Context from './Context'
import { useContext } from 'react'
import { State } from '../types'

export default function usePartyContext() {
  return useContext<State>(Context)
}