import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '~/contexts/Auth'
import { authError, returnToApp } from '~/lib/auth/discord'
import Splash from '~/screens/login/Splash'

export default function RequestAccess() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [expired, setExpired] = useState(false)
  useEffect(() => {
    if (!auth.onboarding) return
    const timer = window.setTimeout(() => setExpired(true), Math.max(0, Date.parse(auth.onboarding.expiresAt) - Date.now()))
    return () => window.clearTimeout(timer)
  }, [auth.onboarding])
  if (auth.isAuthenticated) return <Navigate to="/" replace />
  if (!auth.onboarding) return <Navigate to="/login" replace />
  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (busy || expired) return
    setBusy(true); setError('')
    const [err] = await auth.requestAccess(code.trim())
    if (err) {
      setError(authError(err)); setExpired(!!(err as any).response?.data?.errors?.ticket); setBusy(false)
    } else navigate(returnToApp(), { replace: true })
  }
  const reconnect = async () => {
    setBusy(true)
    try { await auth.startDiscord() } catch { setError('Discord couldn’t open. Please try again.'); setBusy(false) }
  }
  return <Splash access name={auth.onboarding.name.split(' ')[0]} error={expired ? 'Your sign-in expired. Please continue with Discord again.' : error}>
    <form className="login-access-form" onSubmit={submit}>
      {!expired && <label htmlFor="request-access">Access code
        <input id="request-access" name="request_access" value={code} onChange={event => setCode(event.target.value)} autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={255} disabled={busy} aria-invalid={!!error} />
      </label>}
      {expired ? <button type="button" className="login-discord" onClick={reconnect} disabled={busy}>Continue with Discord</button> :
        <button className="login-discord" type="submit" disabled={busy}>{busy && <i className="login-spinner" aria-hidden="true" />}{busy ? 'Checking your code…' : 'Let me in'}</button>}
    </form>
    {!expired && <button type="button" className="login-switch" onClick={reconnect} disabled={busy}>Use a different Discord account</button>}
  </Splash>
}
