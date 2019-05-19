import Context from './Context'
import { useContext } from 'react'
import { ContextType } from '../types'

export default function usePartyContext() {
  return useContext<ContextType>(Context)
}