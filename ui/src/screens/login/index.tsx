import { useState } from 'react'
import { useLocation } from 'react-router'
import { useAuth } from '~/contexts/auth/auth'
import Splash from './Splash'

export default function Login() {
  const auth = useAuth()
  const location = useLocation()
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const connect = async () => {
    setState('connecting')
    setError('')
    try {
      await auth.startDiscord(location.state?.from || (location.pathname === '/' ? '/' + location.search : '/'))
    } catch {
      setError('Discord couldn’t open. Please try again.')
      setState('cancelled')
    }
  }
  return <Splash state={state} error={error} onDiscord={connect} />
}
