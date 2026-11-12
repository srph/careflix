import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '~/contexts/auth/auth'
import { authError, returnToApp } from '~/lib/auth/discord'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { cn } from '~/utils/cn'
import { LoginSplash, DISCORD_BUTTON, Spinner } from '~/screens/login/login-splash'

export function OnboardingPage() {
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
  return <LoginSplash access state={busy ? 'checking' : error ? 'wrong' : 'idle'} identity={
    <div className="mb-6.5 inline-flex min-h-8.5 max-w-full items-center gap-2 rounded-full bg-neutral-800 py-1 pr-3 pl-1 text-13 text-neutral-300 inset-ring inset-ring-neutral-700" data-reaction-shelf data-reaction-solid>
      <span aria-hidden="true" className="flex flex-none"><UiAvatar user={{ name: auth.onboarding.name, avatar: '' }} className="size-6.5 text-11" /></span>
      <span className="flex min-w-0 items-baseline gap-0.75 whitespace-nowrap">Signed in as <b title={auth.onboarding.name} className="truncate font-semibold text-white">{auth.onboarding.name}</b></span>
      <span className="flex-none whitespace-nowrap text-neutral-400">(<button type="button" onClick={reconnect} disabled={busy} aria-label="Use a different Discord account"
        className="cursor-pointer leading-[inherit] underline decoration-neutral-600 underline-offset-2 disabled:cursor-wait">Not you?</button>)</span>
    </div>
  }>
    <form className="grid gap-3" onSubmit={submit} aria-busy={busy}>
      {!expired && <>
        <label htmlFor="request-access" className="-mb-1 ml-0.5 text-sm font-medium text-neutral-300">Access code</label>
        <input id="request-access" name="request_access" value={code} onChange={event => { setCode(event.target.value); setError('') }} placeholder="Paste or type your code" autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={255} disabled={busy} aria-invalid={!!error} aria-describedby={message ? 'request-access-error' : undefined} data-reaction-shelf
          className="h-13 w-full min-w-0 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-0 font-sans text-base leading-none font-medium tracking-[.02em] text-white transition-[border-color,box-shadow] duration-150 placeholder:tracking-normal placeholder:text-neutral-500 focus:border-neutral-500 disabled:text-neutral-400 aria-invalid:animate-shake aria-invalid:border-rose-400 aria-invalid:ring-4 aria-invalid:ring-rose-400/13 motion-reduce:animate-none motion-reduce:transition-none" />
      </>}
      {message && <p id="request-access-error" className="-mt-1 ml-0.5 text-sm wrap-anywhere text-rose-300" role="alert">{message}</p>}
      {expired ? <button type="button" className={DISCORD_BUTTON} onClick={reconnect} disabled={busy}>Continue with Discord</button> :
        <button type="submit" disabled={busy || !code.trim()} data-reaction-shelf className={cn(
          'flex min-h-13 w-full items-center justify-center gap-2 rounded-xl px-4 py-3 font-sans text-base leading-none font-semibold transition-colors duration-150 motion-reduce:transition-none',
          // While the code is being checked the button is disabled but keeps its colour.
          busy ? 'cursor-wait bg-pink-500 text-white' : 'cursor-pointer bg-pink-500 text-white not-disabled:hover:bg-pink-600 disabled:cursor-default disabled:bg-neutral-800 disabled:text-neutral-500'
        )}>{busy && <Spinner />}{busy ? 'Checking…' : 'Continue'}</button>}
    </form>
  </LoginSplash>
}
