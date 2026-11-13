import { useState } from 'react'
import { useLocation } from 'react-router'
import { beginDiscord } from '~/lib/auth/discord'
import { LoginSplash } from './login-splash'

export function LoginPage() {
  const location = useLocation()
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')
  const connect = async () => {
    setState('connecting')
    setError('')
    try {
      await beginDiscord(location.state?.from || (location.pathname === '/' ? '/' + location.search : '/'))
    } catch {
      setError('Discord couldn’t open. Please try again.')
      setState('cancelled')
    }
  }
  return <LoginSplash state={state} error={error} onDiscord={connect} />
}
