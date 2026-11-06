import { expect, test, type Page } from '@playwright/test'

// Controlled HTTP fixtures protect frontend behavior; they are not live API/Pusher evidence.
const image = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="#272735"/></svg>')
const show = {
  id: 91001, title: 'Migration Test Movie', title_type: 'movie', preview_image: image,
  synopsis: 'A deterministic movie for frontend migration checks.', language: 'English',
  air_start: '2020-01-01 00:00:00', air_end: null, age_rating: 'PG',
  movie: { id: 92001, duration: 120, title: 'Migration Test Movie', preview_image: image },
}

async function authenticatedCatalog(page: Page, restoreSession = true) {
  if (restoreSession) await page.context().addCookies([{ name: 'app_token', value: 'migration-smoke-token', url: test.info().project.use.baseURL as string }])
  await page.routeWebSocket(/pusher/, socket => socket.close())
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname
    let body: unknown = {}
    if (path === '/api/me') body = { id: 90001, name: 'Migration Viewer', email: 'migration@example.test', avatar: image, invitations: [], is_online: true }
    if (path === '/api/me/parties') body = { data: [], current_page: 1, last_page: 1, total: 0 }
    if (path === '/api/shows') {
      const pageNumber = Number(new URL(route.request().url()).searchParams.get('page') || 1)
      body = { data: pageNumber === 1 ? [show] : [], current_page: pageNumber, last_page: 1 }
    }
    await route.fulfill({ json: body })
  })
}

test('guest home and login show the Discord splash', async ({ page }) => {
  for (const path of ['/', '/login']) {
    await page.goto(path)
    await expect(page.getByRole('heading', { name: 'Bring popcorn. Bring feelings.' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Continue with Discord' })).toBeVisible()
    await expect(page.getByRole('textbox')).toHaveCount(0)
    await expect(page).toHaveTitle('Watch together - Care.tv')
    const fonts = await page.locator('.login-splash').evaluate(element => ({
      splash: getComputedStyle(element).fontFamily,
      app: getComputedStyle(document.body).fontFamily,
    }))
    expect(fonts.splash).toBe(fonts.app)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.waitForTimeout(2500) // Capture the falling reactions after they enter the viewport.
  await page.screenshot({ path: test.info().outputPath('discord-splash.png'), fullPage: true })
})

test('private settings redirect a guest to login', async ({ page }) => {
  await page.goto('/settings/profile')
  await expect(page).toHaveURL(/\/login$/)
})

test('legacy registration redirects to Discord login', async ({ page }) => {
  await page.goto('/register')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('button', { name: 'Continue with Discord' })).toBeVisible()
})

test('cancelled Discord login allows another attempt with a browser challenge', async ({ page }) => {
  await page.route('**/auth/discord?**', route => route.fulfill({ contentType: 'text/html', body: 'Discord authorization fixture' }))
  await page.goto('/auth/callback?error=cancelled')
  await expect(page.getByRole('alert')).toContainText('Discord didn’t connect.')
  await page.getByRole('button', { name: 'Try again with Discord' }).click()
  await expect(page).toHaveURL(/\/auth\/discord\?challenge=[a-f0-9]{64}$/)
  const validChallenge = await page.evaluate(async () => {
    const verifier = sessionStorage.getItem('discord_verifier')!
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
    const expected = Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('')
    return new URL(location.href).searchParams.get('challenge') === expected
  })
  expect(validChallenge).toBe(true)
})

test('authenticated catalog opens and dismisses a movie dialog', async ({ page }) => {
  await authenticatedCatalog(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'All titles' })).toBeVisible()
  const card = page.getByRole('button', { name: `Details for ${show.title}`, exact: true })
  await card.getByRole('heading', { name: show.title, exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByText(show.synopsis)).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCSS('opacity', '1')
  const exitDuration = page.evaluate(() => new Promise<number>((resolve, reject) => {
    const dialog = document.querySelector('[role="dialog"]')!
    let started = 0
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') started = performance.now()
    }
    document.addEventListener('keydown', onKey, true)
    const observer = new MutationObserver(() => {
      if (!dialog.isConnected && started) {
        observer.disconnect()
        document.removeEventListener('keydown', onKey, true)
        clearTimeout(timer)
        resolve(performance.now() - started)
      }
    })
    const timer = window.setTimeout(() => {
      observer.disconnect()
      document.removeEventListener('keydown', onKey, true)
      reject(new Error('Dialog exit did not complete'))
    }, 3000)
    observer.observe(document.body, { childList: true, subtree: true })
  }))
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  expect(await exitDuration).toBeGreaterThanOrEqual(100)
  // The listing explicitly focuses its details trigger, including in Safari.
  await expect(card).toBeFocused()
})

test('authenticated settings preserve the heading and back navigation', async ({ page }) => {
  await authenticatedCatalog(page)
  await page.goto('/settings/profile')
  await expect(page).toHaveURL(/\/settings\/profile$/)
  await expect(page).toHaveTitle(/Care.tv$/)
  await expect(page.locator('.ui-navigation')).toContainText('Account Settings')
  // The existing mobile layout hides the text and leaves an icon-only link.
  await page.locator('.ui-navigation .is-back a').click()
  await expect(page).toHaveURL(/\/settings$/)
})

const viewer = { id: 90001, name: 'Migration Viewer', email: 'migration@example.test', avatar: image, invitations: [], is_online: true }
const session = () => ({ requires_request_access: false, access_token: 'migration-smoke-token', expires_at: new Date(Date.now() + 86400000).toISOString(), user: viewer })

async function discordCallback(page: Page) {
  await page.addInitScript(() => sessionStorage.setItem('discord_verifier', 'b'.repeat(64)))
  await page.goto('/auth/callback?code=' + 'a'.repeat(64))
}

test('Discord login restores after reload and logout revokes and clears the session', async ({ page }) => {
  await authenticatedCatalog(page, false)
  await page.route('**/api/auth/discord/exchange', route => route.fulfill({ json: session() }))
  await discordCallback(page)
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'All titles' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'All titles' })).toBeVisible()
  await page.goto('/login')
  await expect(page).toHaveURL(/\/$/)
  const revoked = page.waitForRequest(request => new URL(request.url()).pathname === '/api/logout' && request.method() === 'POST')
  await page.goto('/logout')
  expect((await revoked).headers().authorization).toBe('Bearer migration-smoke-token')
  await expect(page).toHaveURL(/\/login$/)
  expect((await page.context().cookies()).find(cookie => cookie.name === 'app_token')).toBeUndefined()
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/login$/)
})

test('settings remove password controls and retain account navigation', async ({ page }) => {
  await authenticatedCatalog(page)
  await page.goto('/settings')
  await expect(page.getByRole('link', { name: 'Update password' })).toHaveCount(0)
  await page.goto('/settings/password')
  await expect(page).toHaveURL(/\/settings$/)
  await page.getByRole('link', { name: /Account settings/ }).click()
  await expect(page).toHaveURL(/\/settings\/profile$/)
  await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toHaveValue(viewer.name)
  await expect(page.getByRole('textbox', { name: 'Email', exact: true })).toHaveValue(viewer.email)
  await page.goBack()
  await expect(page).toHaveURL(/\/settings$/)
  await page.goto('/settings/faq')
  await expect(page).toHaveTitle('FAQ - Care.tv')
  await page.goto('/download')
  await expect(page).toHaveTitle('Download The App - Care.tv')
})

test('onboarding persists across reloads and only grants a session after the correct code', async ({ page }) => {
  await authenticatedCatalog(page, false)
  await page.route('**/api/auth/discord/exchange', route => route.fulfill({ json: {
    requires_request_access: true, onboarding_ticket: 'c'.repeat(64), name: viewer.name,
    expires_at: new Date(Date.now() + 900000).toISOString(),
  } }))
  await page.route('**/api/auth/request', route => {
    const body = route.request().postDataJSON()
    expect(body.ticket).toBe('c'.repeat(64))
    expect(body.verifier).toBe('b'.repeat(64))
    return body.request_access === 'FRIENDS' ? route.fulfill({ json: session() }) :
      route.fulfill({ status: 422, json: { errors: { request_access: ['That code didn’t match. Please try again.'] } } })
  })
  await discordCallback(page)
  await expect(page).toHaveURL(/\/onboarding$/)
  expect((await page.context().cookies()).find(cookie => cookie.name === 'app_token')).toBeUndefined()
  await page.goto('/request-access')
  await expect(page).toHaveURL(/\/onboarding$/)
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Ticket, please.' })).toBeVisible()
  await expect(page.getByText('Signed in as')).toContainText(viewer.name)
  await expect(page.getByRole('button', { name: 'Use a different Discord account' })).toBeVisible()
  const input = page.getByLabel('Access code', { exact: true })
  const submit = page.getByRole('button', { name: 'Continue', exact: true })
  await expect(submit).toBeDisabled()
  await expect(input).toHaveAttribute('placeholder', 'Paste or type your code')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.screenshot({ path: test.info().outputPath('onboarding-empty.png'), fullPage: true })
  await input.fill('WRONG')
  await submit.click()
  await expect(page.getByRole('alert')).toContainText('That code didn’t match.')
  await expect(input).toHaveAttribute('aria-invalid', 'true')
  const field = await input.boundingBox(), error = await page.getByRole('alert').boundingBox(), button = await submit.boundingBox()
  expect(error!.y).toBeGreaterThanOrEqual(field!.y + field!.height)
  expect(button!.y).toBeGreaterThanOrEqual(error!.y + error!.height)
  await page.screenshot({ path: test.info().outputPath('onboarding.png'), fullPage: true })
  await input.fill('FRIENDS')
  await expect(page.getByRole('alert')).toHaveCount(0)
  await submit.click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'All titles' })).toBeVisible()
})

test('an expired callback shows recovery without exposing the temporary code', async ({ page }) => {
  await page.route('**/api/auth/discord/exchange', route => route.fulfill({ status: 422, json: {
    errors: { ticket: ['Your sign-in expired. Please continue with Discord again.'] },
  } }))
  await discordCallback(page)
  await expect(page.getByRole('alert')).toContainText('Your sign-in expired.')
  await expect(page).toHaveURL(/\/auth\/callback$/)
  await expect(page.getByRole('button', { name: 'Try again with Discord' })).toBeEnabled()
})

test('an invalid restored session returns to an interactive login', async ({ page }) => {
  await page.context().addCookies([{ name: 'app_token', value: 'expired', url: test.info().project.use.baseURL as string }])
  await page.route('**/api/me', route => route.fulfill({ status: 401, json: { message: 'Unauthenticated.' } }))
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('button', { name: 'Continue with Discord' })).toBeEnabled()
})

test('reduced motion disables falling reactions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/login')
  await expect(page.locator('.login-reactions')).toHaveCSS('display', 'none')
  await expect(page.getByRole('button', { name: 'Continue with Discord' })).toBeVisible()
})

test('unmatched URLs retain the existing authenticated app shell', async ({ page }) => {
  await authenticatedCatalog(page)
  await page.goto('/migration-unknown-route')
  await expect(page.locator('.ui-navigation')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Care.tv', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Unexpected Application Error!' })).not.toBeVisible()
})
