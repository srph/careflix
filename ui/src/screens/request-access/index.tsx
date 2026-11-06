import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '~/contexts/Auth'
import { authError, returnToApp } from '~/lib/auth/discord'
import UiAvatar from '~/components/UiAvatar'
import Splash from '~/screens/login/Splash'
import './style.css'

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
  const message = expired ? 'Your sign-in expired. Please continue with Discord again.' : error
  return <Splash access state={busy ? 'checking' : error ? 'wrong' : 'idle'} identity={
    <div className="login-identity" data-reaction-shelf data-reaction-solid>
      <span aria-hidden="true"><UiAvatar user={{ name: auth.onboarding.name, avatar: '' }} /></span>
      <span className="login-identity-account">Signed in as <b title={auth.onboarding.name}>{auth.onboarding.name}</b></span>
      <span className="login-identity-switch">(<button type="button" onClick={reconnect} disabled={busy} aria-label="Use a different Discord account">Not you?</button>)</span>
    </div>
  }>
    <form className="login-access-form" onSubmit={submit} aria-busy={busy}>
      {!expired && <>
        <label htmlFor="request-access">Access code</label>
        <input id="request-access" name="request_access" value={code} onChange={event => { setCode(event.target.value); setError('') }} placeholder="Paste or type your code" autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={255} disabled={busy} aria-invalid={!!error} aria-describedby={message ? 'request-access-error' : undefined} data-reaction-shelf />
      </>}
      {message && <p id="request-access-error" className="login-access-error" role="alert">{message}</p>}
      {expired ? <button type="button" className="login-discord" onClick={reconnect} disabled={busy}>Continue with Discord</button> :
        <button className="login-access-continue" type="submit" disabled={busy || !code.trim()} data-reaction-shelf>{busy && <i className="login-spinner" aria-hidden="true" />}{busy ? 'Checking…' : 'Continue'}</button>}
    </form>
  </Splash>
}
