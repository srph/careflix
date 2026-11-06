import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '~/contexts/Auth'
import { authError, returnToApp } from '~/lib/auth/discord'
import Splash from '~/screens/login/Splash'

const ERRORS: Record<string, string> = {
  cancelled: 'Discord didn’t connect. No harm done.',
  expired: 'Your sign-in expired. Please try again.',
  account_link_required: 'You already have a Care.tv account. Ask Kier to link your Discord account so you can keep your history.',
  not_configured: 'Discord login isn’t ready yet. Please try again later.',
  connection_failed: 'Discord couldn’t connect. Please try again.',
}

export default function AuthCallback() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [parameters] = useState(() => new URLSearchParams(window.location.search))
  const [state, setState] = useState('connecting')
  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const started = useRef(false)
  const destination = useRef<string | null>(null)
  useEffect(() => {
    if (started.current) return
    started.current = true
    window.history.replaceState(window.history.state, '', window.location.pathname)
    const code = parameters.get('code')
    if (!code || parameters.has('error')) {
      setState('cancelled')
      setError(ERRORS[parameters.get('error') || 'expired'] || ERRORS.connection_failed)
      return
    }
    auth.exchangeDiscord(code).then(([err, result]) => {
      if (err || !result) { setState('cancelled'); setError(authError(err)) }
      else if (result.requires_request_access) navigate('/onboarding', { replace: true })
      else { destination.current = returnToApp(); setName(result.user!.name.split(' ')[0]); setState('welcome') }
    })
  }, [])
  useEffect(() => {
    if (state !== 'welcome') return
    const timer = window.setTimeout(() => navigate(destination.current || '/', { replace: true }), 900)
    return () => window.clearTimeout(timer)
  }, [state, navigate])
  const retry = async () => {
    setError(''); setState('connecting')
    try { await auth.startDiscord() } catch { setState('cancelled'); setError(ERRORS.connection_failed) }
  }
  return <Splash state={state} error={error} name={name} onDiscord={retry} />
}
