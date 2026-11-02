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
    if (path === '/api/me/recent-party') body = { party: null }
    if (path === '/api/shows') {
      const pageNumber = Number(new URL(route.request().url()).searchParams.get('page') || 1)
      body = { data: pageNumber === 1 ? [show] : [], current_page: pageNumber, last_page: 1 }
    }
    await route.fulfill({ json: body })
  })
}

test('guest home links to login', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Build the hype!' })).toBeVisible()
  await page.getByRole('link', { name: 'Sign In', exact: true }).click()
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.getByRole('heading', { name: 'Watch. Together.' })).toBeVisible()
  await expect(page).toHaveTitle('Welcome back - Care.tv')
})

test('private settings redirect a guest to login', async ({ page }) => {
  await page.goto('/settings/profile')
  await expect(page).toHaveURL(/\/login$/)
})

test('registration retains the access code in the URL', async ({ page }) => {
  await page.goto('/register?request_access_code=MIGRATION-TEST')
  await expect(page.locator('input[name="request_access_code"]')).toHaveValue('MIGRATION-TEST')
})

test('invalid login displays feedback and allows another attempt', async ({ page }) => {
  await page.route('**/oauth/token', route => route.fulfill({ status: 400, json: { error: 'invalid_grant' } }))
  await page.goto('/login')
  await page.locator('input[name="email"]').fill('migration@example.test')
  await page.locator('input[name="password"]').fill('invalid-password')
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page.getByText('Invalid email/password combination.')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Login', exact: true })).toBeEnabled()
})

test('authenticated catalog opens and dismisses a movie dialog', async ({ page, browserName }) => {
  await authenticatedCatalog(page)
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'New Releases' })).toBeVisible()
  const card = page.getByRole('button', { name: /Migration Test Movie/ })
  await card.getByRole('heading', { name: show.title, exact: true }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByText(show.synopsis)).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  // Pointer clicks focus the card in Chromium/Firefox. Safari leaves focus on
  // the body in the original UI as well, so that is its restoration target.
  await expect(browserName === 'webkit' ? page.locator('body') : card).toBeFocused()
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

test('login restores the session after reload and logout clears it', async ({ page }) => {
  await authenticatedCatalog(page, false)
  await page.route('**/oauth/token', route => route.fulfill({ json: { access_token: 'migration-smoke-token' } }))
  await page.goto('/login')
  await page.locator('input[name="email"]').fill('migration@example.test')
  await page.locator('input[name="password"]').fill('fixture-password')
  await page.getByRole('button', { name: 'Login', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'New Releases' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'New Releases' })).toBeVisible()
  await page.goto('/login')
  await expect(page).toHaveURL(/\/$/)
  await page.goto('/logout')
  await expect(page).toHaveURL(/\/login$/)
  expect((await page.context().cookies()).find(cookie => cookie.name === 'app_token')).toBeUndefined()
  await page.goto('/settings')
  await expect(page).toHaveURL(/\/login$/)
})

test('nested settings routes preserve titles, direct entry and browser history', async ({ page }) => {
  await authenticatedCatalog(page)
  await page.goto('/settings')
  await page.getByRole('link', { name: 'Update password' }).click()
  await expect(page).toHaveURL(/\/settings\/password$/)
  await expect(page).toHaveTitle('Change Password - Care.tv')
  await page.reload()
  await expect(page.locator('.ui-navigation')).toContainText('Change Password')
  await page.goBack()
  await expect(page).toHaveURL(/\/settings$/)
  await page.goForward()
  await expect(page).toHaveURL(/\/settings\/password$/)
  await page.goto('/settings/faq')
  await expect(page).toHaveTitle('FAQ - Care.tv')
  await page.goto('/download')
  await expect(page).toHaveTitle('Download The App - Care.tv')
})

test('registration submits its access code and signs the new user in', async ({ page }) => {
  await authenticatedCatalog(page, false)
  await page.route('**/oauth/token', route => route.fulfill({ json: { access_token: 'migration-smoke-token' } }))
  await page.goto('/register?request_access_code=MIGRATION-TEST')
  await page.locator('input[name="email"]').fill('migration@example.test')
  await page.locator('input[name="name"]').fill('Migration Viewer')
  await page.locator('input[name="password"]').fill('fixture-password')
  await page.locator('input[name="password_confirmation"]').fill('fixture-password')
  const submitted = page.waitForRequest(request => new URL(request.url()).pathname === '/api/register')
  await page.getByRole('button', { name: 'Register', exact: true }).click()
  expect((await submitted).postDataJSON()).toMatchObject({ request_access_code: 'MIGRATION-TEST', name: 'Migration Viewer' })
  await expect(page).toHaveURL(/\/$/)
  await expect(page.getByRole('heading', { name: 'New Releases' })).toBeVisible()
  await expect(page.getByText('Your account was created successfully!')).toBeVisible()
})

test('unmatched URLs retain the existing authenticated app shell', async ({ page }) => {
  await authenticatedCatalog(page)
  await page.goto('/migration-unknown-route')
  await expect(page.locator('.ui-navigation')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Care.tv', exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Unexpected Application Error!' })).not.toBeVisible()
})
