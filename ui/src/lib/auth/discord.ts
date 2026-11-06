import config from '~/config'

const VERIFIER = 'discord_verifier'
const ONBOARDING = 'discord_onboarding'
const RETURN_TO = 'discord_return_to'

export interface Onboarding {
  ticket: string
  name: string
  expiresAt: string
}

export interface DiscordAuthResult {
  requires_request_access: boolean
  onboarding_ticket?: string
  name?: string
  access_token?: string
  expires_at: string
  user?: AppUser
}

export function verifier() {
  return sessionStorage.getItem(VERIFIER) || ''
}

export function pendingOnboarding(): Onboarding | null {
  try {
    const pending = JSON.parse(sessionStorage.getItem(ONBOARDING) || 'null')
    return pending?.ticket && Date.parse(pending.expiresAt) > Date.now() ? pending : null
  } catch {
    return null
  }
}

export function saveOnboarding(pending: Onboarding) {
  sessionStorage.setItem(ONBOARDING, JSON.stringify(pending))
}

export function clearDiscordFlow() {
  sessionStorage.removeItem(VERIFIER)
  sessionStorage.removeItem(ONBOARDING)
}

export function returnToApp() {
  const path = sessionStorage.getItem(RETURN_TO) || '/'
  sessionStorage.removeItem(RETURN_TO)
  return path.startsWith('/') && !path.startsWith('//') && !path.startsWith('/\\') ? path : '/'
}

export async function beginDiscord(returnTo = '/') {
  const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('')
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret))
  const challenge = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
  clearDiscordFlow()
  sessionStorage.setItem(VERIFIER, secret)
  sessionStorage.setItem(RETURN_TO, returnTo)
  // Give the button's reaction pile a moment to shake off before navigating.
  await new Promise(resolve => window.setTimeout(resolve, 180))
  window.location.assign(`${config.api.baseUrl}/auth/discord?challenge=${challenge}`)
}

export function authError(error: any) {
  if (error?.response?.status === 429) return 'Too many tries. Give it a minute, then try again.'
  const errors = error?.response?.data?.errors
  return errors?.request_access?.[0] || errors?.ticket?.[0] || 'We couldn’t connect. Please try again.'
}
