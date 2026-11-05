import { expect, test, type Page, type WebSocketRoute } from '@playwright/test'

const art = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><linearGradient id="g"><stop stop-color="#822e57"/><stop offset="1" stop-color="#172a40"/></linearGradient></defs><path fill="url(#g)" d="M0 0h800v450H0z"/><circle cx="540" cy="200" r="130" fill="#ffffff12"/></svg>')
const viewer = { id: 90001, name: 'Joyce', email: 'joyce@example.test', avatar: null, is_online: true }
const members = ['Kier', 'Leo', 'Mira'].map((name, index) => ({ id: 90002 + index, name, avatar: null, pivot: { is_active: true } }))
const show = { id: 91001, title: 'Velvet Static', title_type: 'movie', preview_image: art, movie: null, air_start: '2025-01-01 00:00:00' }
const video = { id: 92001, title: show.title, show, duration: 7440, preview_image: art, video_url: 'https://media.example.test/movie.mp4', subtitle_url: null, group: null }
const party = { id: 94001, join_code: '012345', creator: members[0], video, current_time: 2472, is_playing: true, members, invitations: [], last_activity_at: '2026-06-01T10:00:00Z', created_at: '2026-06-01T10:00:00Z' }
const preview = { ...party, is_member: false }
const invitation = { id: 95001, party_id: party.id, party, sender: members[0], recipient: viewer, action: 'pending', expires_at: new Date(Date.now() + 1_800_000).toISOString() }

async function setup(page: Page, options: { invitations?: boolean; failLookup?: boolean; failJoin?: boolean; lookupReady?: Promise<void>; joinReady?: Promise<void> } = {}) {
  const lookups: string[] = []
  let joins = 0
  let connection: WebSocketRoute
  const subscriptions = new Set<string>()
  const variants: Record<string, typeof preview> = { '012345': preview }
  await page.context().addCookies([{ name: 'app_token', value: 'party-code-fixture', url: test.info().project.use.baseURL as string }])
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (text: string) => { (window as any).copiedPartyCode = text } } })
  })
  await page.routeWebSocket(/pusher/, socket => {
    connection = socket
    socket.send(JSON.stringify({ event: 'pusher:connection_established', data: JSON.stringify({ socket_id: '123.456', activity_timeout: 120 }) }))
    socket.onMessage(message => {
      const payload = JSON.parse(String(message))
      if (payload.event === 'pusher:subscribe') {
        subscriptions.add(payload.data.channel)
        socket.send(JSON.stringify({ event: 'pusher_internal:subscription_succeeded', channel: payload.data.channel, data: JSON.stringify({ presence: { ids: members.map(member => String(member.id)), hash: {}, count: 3 } }) }))
      }
    })
  })
  await page.route('**/broadcasting/auth', route => route.fulfill({ json: { auth: 'fixture:signature', channel_data: JSON.stringify({ user_id: viewer.id }) } }))
  await page.route('https://media.example.test/**', route => route.fulfill({ status: 404, body: '' }))
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname
    const code = path.match(/\/party-codes\/(\d+)/)?.[1]
    if (code) {
      if (path.endsWith('/join')) {
        joins++
        await options.joinReady
        if (options.failJoin && joins === 1) return route.fulfill({ status: 503, json: { message: 'Unavailable' } })
        return route.fulfill({ json: { ...party, members: [...members, { ...viewer, pivot: { is_active: false } }], accepted_invitation_ids: [95001], declined_invitation_ids: [95002] } })
      }
      lookups.push(code)
      if (code === '012345') await options.lookupReady
      if (options.failLookup && lookups.length === 1) return route.fulfill({ status: 503, json: { message: 'Unavailable' } })
      return route.fulfill({ status: variants[code] ? 200 : 404, json: variants[code] || { message: 'Not found' } })
    }
    let body: unknown = {}
    if (path === '/api/me') body = { ...viewer, invitations: options.invitations ? [invitation, { ...invitation, id: 95002, party_id: 94002, sender: members[1] }] : [] }
    if (path === '/api/shows') body = { data: [show], current_page: 1, last_page: 1 }
    if (path === '/api/me/parties') body = { data: [], current_page: 1, last_page: 1 }
    if (path === `/api/parties/${party.id}`) body = party
    if (path.endsWith('/logs') || path.endsWith('/invitations/search')) body = []
    await route.fulfill({ json: body })
  })
  const emit = (channel: string, event: string, data: unknown) => connection.send(JSON.stringify({ channel, event, data: JSON.stringify(data) }))
  return { lookups, variants, subscriptions, joins: () => joins, emit }
}

async function open(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: 'Join', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Join a watch party' })
  await expect(dialog).toBeVisible()
  return dialog
}

test('pasted code previews, joins once, clears invitations and copies the party code', async ({ page }) => {
  let finishJoin: () => void
  const joinReady = new Promise<void>(resolve => { finishJoin = resolve })
  const fixture = await setup(page, { invitations: true, joinReady })
  const dialog = await open(page)
  const code = dialog.getByRole('textbox', { name: 'Party code' })
  await expect(code).toBeFocused()
  await code.evaluate(element => {
    // Firefox discards clipboard data supplied to an untrusted ClipboardEvent.
    const event = new Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'clipboardData', { value: { getData: (type: string) => type === 'text/plain' ? '012 345' : '' } })
    element.dispatchEvent(event)
  })
  await expect(code).toHaveValue('012345')
  await expect(dialog.getByText('Found Kier’s watch party')).toBeVisible()
  await expect(dialog.locator('.join-party-preview')).toHaveCSS('opacity', '1')
  await expect(dialog.getByText('Watching now · 41:12 of 2:04:00')).toBeVisible()
  await expect(dialog.getByText('Kier, Leo and Mira are here')).toBeVisible()
  expect(fixture.joins()).toBe(0)
  await page.screenshot({ path: test.info().outputPath('join-preview.png') })
  await dialog.getByRole('button', { name: 'Join party', exact: true }).click()
  await expect(dialog.getByRole('button', { name: 'Joining', exact: true })).toBeDisabled()
  await page.keyboard.press('Enter')
  await page.keyboard.press('Escape')
  await expect(dialog).toBeVisible()
  expect(fixture.joins()).toBe(1)
  finishJoin()
  await expect(page).toHaveURL(`/watch/${party.id}`)
  await expect(page.getByRole('dialog', { name: 'Watch invitation' })).toHaveCount(0)
  const copy = page.getByRole('button', { name: 'Copy party code 012 345' })
  await copy.click()
  await expect(page.getByRole('status').filter({ hasText: 'Party code copied' })).toHaveText('Party code copied')
  expect(await page.evaluate(() => (window as any).copiedPartyCode)).toBe('012345')
  await page.screenshot({ path: test.info().outputPath('party-code.png') })
})

test('partial and wrong codes stay out of the party; Escape restores focus', async ({ page }) => {
  const fixture = await setup(page)
  const dialog = await open(page)
  const code = dialog.getByRole('textbox', { name: 'Party code' })
  await code.fill('123')
  await expect(dialog.getByRole('button', { name: 'Join party' })).toBeDisabled()
  expect(fixture.lookups).toEqual([])
  await code.fill('999999')
  await expect(dialog.getByRole('alert')).toContainText('No watch party uses 999 999')
  await expect(dialog.getByRole('button', { name: 'Join party' })).toBeDisabled()
  expect(fixture.joins()).toBe(0)
  await page.screenshot({ path: test.info().outputPath('wrong-code.png') })
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Join', exact: true })).toBeFocused()
})

test('late lookup responses cannot reveal a preview for a different code', async ({ page }) => {
  let finishLookup: () => void
  const lookupReady = new Promise<void>(resolve => { finishLookup = resolve })
  const fixture = await setup(page, { lookupReady })
  const dialog = await open(page)
  const code = dialog.getByRole('textbox', { name: 'Party code' })
  await code.fill('012345')
  await expect.poll(() => fixture.lookups.length).toBe(1)
  await expect(dialog.getByRole('status')).toContainText('Looking for the watch party')
  await code.fill('999999')
  await expect(dialog.getByRole('alert')).toBeVisible()
  finishLookup()
  await expect(dialog.locator('.join-party-preview')).toHaveCount(0)
  await expect(dialog.getByRole('button', { name: 'Join party' })).toBeDisabled()
})

test('lookup and join failures can be retried without re-entering the code', async ({ page }) => {
  const fixture = await setup(page, { failLookup: true, failJoin: true })
  const dialog = await open(page)
  await dialog.getByRole('textbox', { name: 'Party code' }).fill('012345')
  await expect(dialog.getByRole('alert')).toContainText('Could not look up this code')
  await dialog.getByRole('button', { name: 'Retry' }).click()
  await expect(dialog.locator('.join-party-preview')).toHaveCSS('opacity', '1')
  await dialog.getByRole('button', { name: 'Join party' }).click()
  await expect(dialog.getByRole('alert')).toContainText('Could not join this party')
  await expect(dialog.getByRole('textbox', { name: 'Party code' })).toHaveValue('012345')
  await dialog.getByRole('button', { name: 'Join party' }).click()
  await expect(page).toHaveURL(`/watch/${party.id}`)
  expect(fixture.joins()).toBe(2)
})

test('previews cover paused, fresh, series, idle and existing memberships', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const fixture = await setup(page)
  fixture.variants['012346'] = { ...preview, is_playing: false, current_time: 4360 }
  fixture.variants['012347'] = { ...preview, is_playing: false, current_time: 0, members: [members[0]] }
  fixture.variants['012348'] = { ...preview, video: { ...video, title: 'The Long Night', show: { ...show, title: 'Hollow County', title_type: 'series' }, group: { title: 'Season 2' } } }
  fixture.variants['012349'] = { ...preview, creator: null, members: members.map(member => ({ ...member, pivot: { is_active: false } })) }
  fixture.variants['012350'] = { ...preview, is_member: true, creator: { ...viewer, pivot: { is_active: false } } }
  const dialog = await open(page)
  const cases = [
    ['012346', 'Paused at 1:12:40 of 2:04:00'],
    ['012347', 'Hasn’t started yet'],
    ['012348', 'Season 2 · The Long Night'],
    ['012349', 'No one’s here right now'],
    ['012350', 'You’re already in this party'],
  ]
  for (const [code, text] of cases) {
    await dialog.getByRole('textbox', { name: 'Party code' }).fill(code)
    await expect(dialog.locator('.join-party-preview').getByText(text)).toBeVisible()
    await expect(dialog.locator('.join-party-preview')).toHaveCSS('opacity', '1')
  }
  await expect(dialog.getByRole('button', { name: 'Open party' })).toBeEnabled()
  await expect(dialog.locator('.join-party-preview')).toHaveCSS('transition-duration', '0s')
  expect(fixture.joins()).toBe(0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('member joins and invitation resolution remain consistent with duplicate and late events', async ({ page }) => {
  const fixture = await setup(page, { invitations: true })
  await page.goto(`/watch/${party.id}`)
  await expect.poll(() => fixture.subscriptions.has(`private-party.${party.id}`)).toBe(true)
  const newcomer = { ...viewer, id: 90009, name: 'Nico', pivot: { is_active: false } }
  fixture.emit(`private-party.${party.id}`, 'member.joined', { member: newcomer })
  fixture.emit(`private-party.${party.id}`, 'member.joined', { member: newcomer })
  fixture.emit(`private-party.${party.id}`, 'invitation.accepted', { member: newcomer, invitation: { ...invitation, action: 'accepted' } })
  await expect(page.locator('.watch-screen-canopy .ui-avatar')).toHaveCount(4)
  fixture.emit(`private-user.${viewer.id}`, 'invitations.resolved', { invitation_ids: [95001, 95002, 95003] })
  await expect(page.getByRole('dialog', { name: 'Watch invitation' })).toHaveCount(0)
  fixture.emit(`private-user.${viewer.id}`, 'invitation.received', { invitation: { ...invitation, id: 95003 } })
  await expect(page.getByRole('dialog', { name: 'Watch invitation' })).toHaveCount(0)
})

test('rate limits allow retry and clipboard failure never claims success', async ({ page }) => {
  await setup(page)
  let lookupLimited = false
  let joinLimited = false
  await page.route('**/api/party-codes/012345', async route => {
    if (lookupLimited) return route.fallback()
    lookupLimited = true
    return route.fulfill({ status: 429, json: { message: 'Too many attempts' } })
  })
  await page.route('**/api/party-codes/012345/join', async route => {
    if (joinLimited) return route.fallback()
    joinLimited = true
    return route.fulfill({ status: 429, json: { message: 'Too many attempts' } })
  })
  const dialog = await open(page)
  await dialog.getByRole('textbox', { name: 'Party code' }).fill('012345')
  await expect(dialog.getByRole('alert')).toContainText('Too many attempts')
  await dialog.getByRole('button', { name: 'Retry' }).click()
  await expect(dialog.locator('.join-party-preview')).toHaveCSS('opacity', '1')
  await dialog.getByRole('button', { name: 'Join party' }).click()
  await expect(dialog.getByRole('alert')).toContainText('Too many attempts')
  await dialog.getByRole('button', { name: 'Join party' }).click()
  await expect(page).toHaveURL(`/watch/${party.id}`)
  await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new Error('Permission denied') } })
  await page.getByRole('button', { name: 'Copy party code 012 345' }).click()
  await expect(page.locator('.toast-container')).toContainText('Couldn’t copy the code')
  await expect(page.locator('.watch-party-code .is-copied')).toHaveCount(0)
})
