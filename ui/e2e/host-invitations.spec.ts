import { expect, test, type Page, type WebSocketRoute } from '@playwright/test'

const host = { id: 801, name: 'Kier', email: null, avatar: null, is_online: true }
const mira = { ...host, id: 802, name: 'Mira' }
const joyce = { ...host, id: 803, name: 'Joyce' }
const leo = { ...host, id: 804, name: 'Leo', is_online: false }
const ava = { ...host, id: 805, name: 'Ava', is_online: false }
const people = [joyce, leo, ava]
const invitation = (person = joyce, id = 1001, expires = Date.now() + 1800000) => ({
  id, party_id: 880, recipient: person, sender: host, action: 'pending',
  created_at: new Date().toISOString(), expires_at: new Date(expires).toISOString()
})

async function room(page: Page, options: { history?: ReturnType<typeof invitation>[]; noRecents?: boolean; logs?: boolean } = {}) {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  const party = {
    id: 880, creator: host, join_code: '048291', invitations: options.history || [],
    members: [host, mira].map(person => ({ ...person, pivot: { is_active: true } })),
    current_time: 0, is_playing: false,
    video: { id: 881, title: 'Velvet Static', duration: 7200, video_url: 'https://media.example.test/film.mp4',
      show: { id: 882, title: 'Velvet Static', title_type: 'movie', air_start: '2020-01-01 00:00:00' } }
  }
  const history = new Map((options.history || []).map(item => [item.recipient.id, item]))
  const failures = { search: 0, send: 0, cancel: 0, history: 0 }
  const heldSearches = new Map<string, Promise<void>>()
  const sent: number[] = []
  let socket: WebSocketRoute
  const emit = (event: string, data: object) => socket.send(JSON.stringify({ channel: 'private-party.880', event, data: JSON.stringify(data) }))
  await page.context().addCookies([{ name: 'app_token', value: 'host-invite-fixture', url: test.info().project.use.baseURL as string }])
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => {} }, configurable: true })
  })
  await page.routeWebSocket(/pusher/, connection => {
    socket = connection
    connection.send(JSON.stringify({ event: 'pusher:connection_established', data: JSON.stringify({ socket_id: '123.456', activity_timeout: 120 }) }))
    connection.onMessage(message => {
      const payload = JSON.parse(String(message))
      if (payload.event !== 'pusher:subscribe') return
      const ids = [host.id, mira.id, joyce.id].map(String)
      connection.send(JSON.stringify({ channel: payload.data.channel, event: 'pusher_internal:subscription_succeeded',
        data: JSON.stringify({ presence: { ids, hash: Object.fromEntries(ids.map(id => [id, {}])), count: ids.length } }) }))
    })
  })
  await page.route('**/broadcasting/auth', route => route.fulfill({ json: { auth: 'fixture:signature', channel_data: JSON.stringify({ user_id: host.id }) } }))
  await page.route('https://media.example.test/**', route => route.fulfill({ status: 404, body: '' }))
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url())
    const path = url.pathname
    let body: unknown = []
    const failure = path.endsWith('/search') ? 'search' : path.endsWith('/send') ? 'send' : path.endsWith('/cancel') ? 'cancel' : path.endsWith('/invitations') ? 'history' : null
    if (failure && failures[failure]-- > 0) return route.fulfill({ status: 500, json: { message: 'Fixture request failed' } })
    if (path === '/api/me') body = { ...host, invitations: [] }
    if (path === '/api/parties/880') body = party
    if (path.endsWith('/logs') && options.logs) body = Array.from({ length: 30 }, (_, index) => ({
      id: 3000 + index, party_id: 880, type: 'message', created_at: new Date().toISOString(),
      message: { id: 4000 + index, user: mira, text: `Keep our conversation ${index + 1}`, created_at: new Date().toISOString() }
    }))
    if (path.endsWith('/invitations')) body = Array.from(history.values())
    if (path.endsWith('/search')) {
      const query = url.searchParams.get('search') || ''
      await heldSearches.get(query)
      body = !query && options.noRecents ? [] : people.filter(person => person.name.toLowerCase().includes(query.toLowerCase()))
    }
    if (path.endsWith('/send')) {
      const id = route.request().postDataJSON().recipient_id
      sent.push(id)
      const person = people.find(person => person.id === id)!
      const item = invitation(person, 2000 + sent.length)
      history.set(person.id, item)
      body = item
    }
    if (path.endsWith('/cancel')) {
      const id = Number(path.split('/')[3])
      const previous = Array.from(history.values()).find(item => item.id === id)!
      const item = { ...previous, action: 'cancelled' }
      history.set(item.recipient.id, item)
      body = item
    }
    await route.fulfill({ json: body })
  })
  await page.goto('/watch/880')
  await expect(page.getByRole('button', { name: 'Invite people' })).toBeVisible()
  return { errors, emit, failures, sent, heldSearches, history }
}

test('B5b2 replaces chat in place, supports keyboard invites, and preserves the chat draft', async ({ page }) => {
  const fixture = await room(page, { logs: true })
  const composer = page.locator('.watch-screen-chatbar textarea')
  await composer.fill('Keep this draft')
  const messages = page.locator('.watch-screen-chat-messages')
  await expect(messages.getByText('Keep our conversation 30')).toBeVisible()
  await messages.evaluate(element => { element.scrollTop = 80; element.dispatchEvent(new Event('scroll')) })
  const trigger = page.getByRole('button', { name: 'Invite people' })
  await trigger.click()
  const panel = page.getByRole('region', { name: 'Invite', exact: true })
  await expect(panel).toBeVisible()
  const input = page.getByRole('combobox', { name: 'Search everyone' })
  await expect(input).toBeFocused()
  await expect(panel.getByText('Party', { exact: true })).toBeVisible()
  await expect(panel.getByText('Recents', { exact: true })).toBeVisible()
  await expect(panel.getByText('Host', { exact: true })).toBeVisible()
  await expect(panel.getByText('You', { exact: true })).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect(page.locator('.watch-screen-chat-content')).toHaveCSS('opacity', '0')
  const bounds = await panel.boundingBox()
  const chatBounds = await page.locator('.watch-screen-chat').boundingBox()
  expect(bounds!.width).toBe(chatBounds!.width)
  expect(bounds!.height).toBe(chatBounds!.height)
  await expect(panel.getByRole('option').last().locator('..')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: test.info().outputPath('b5b2-recents.png') })

  await input.fill('Joyce')
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toBeVisible()
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(panel.getByRole('option', { name: 'Cancel invite to Joyce' })).toContainText('left')
  expect(fixture.sent).toEqual([joyce.id])
  await expect(input).toHaveValue('Joyce')
  await input.fill('')
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toBeVisible()
  await panel.getByRole('button', { name: 'Copy party code 048 291' }).click()
  await expect(panel.getByRole('status')).toHaveText('Party code copied')
  await expect(panel.getByRole('option').last().locator('..')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: test.info().outputPath('b5b2-pending.png') })
  await input.press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(composer).toHaveValue('Keep this draft')
  expect(await messages.evaluate(element => element.scrollTop)).toBe(80)
  await expect(page.getByRole('button', { name: /Waiting on Joyce/ })).toBeVisible()
  await page.getByRole('button', { name: /Waiting on Joyce/ }).click()
  await panel.getByRole('option', { name: 'Cancel invite to Joyce' }).click()
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toBeVisible()
  await panel.getByRole('button', { name: 'Close invite' }).click()
  await expect(page.getByRole('button', { name: /Waiting on/ })).toHaveCount(0)
  expect(fixture.errors).toEqual([])
})

test('live declines, expiry, acceptance, and duplicate events update the panel and chat', async ({ page }) => {
  const expiring = invitation(joyce, 1001, Date.now() + 2000)
  const fixture = await room(page, { history: [expiring] })
  await page.getByRole('button', { name: 'Invite people' }).click()
  const panel = page.getByRole('region', { name: 'Invite', exact: true })
  await expect(panel.getByRole('option', { name: 'Ask again: Joyce' })).toContainText('No answer', { timeout: 6000 })
  const leoInvite = invitation(leo, 1200)
  fixture.emit('invitation.sent', { invitation: leoInvite })
  fixture.emit('invitation.sent', { invitation: leoInvite })
  await expect(panel.getByRole('option', { name: 'Cancel invite to Leo' })).toHaveCount(1)
  fixture.emit('invitation.declined', { invitation: { ...leoInvite, action: 'declined' } })
  fixture.emit('invitation.sent', { invitation: leoInvite })
  await expect(panel.getByRole('option', { name: 'Ask again: Leo' })).toContainText('Declined')
  const avaInvite = invitation(ava, 1300)
  fixture.emit('invitation.sent', { invitation: avaInvite })
  fixture.emit('invitation.accepted', { invitation: { ...avaInvite, action: 'accepted' }, member: { ...ava, pivot: { is_active: true } } })
  fixture.emit('member.joined', { member: { ...ava, pivot: { is_active: true } } })
  await expect(panel.locator('.host-invite-person').filter({ hasText: 'Ava' })).toHaveCount(1)
  await expect(panel.locator('.host-invite-person').filter({ hasText: 'Ava' })).toContainText('In the room')
  await panel.getByRole('button', { name: 'Close invite' }).click()
  await expect(page.locator('.host-invite-outcome')).toHaveCount(2)
  await expect(page.locator('.host-invite-outcome').filter({ hasText: 'Joyce' })).toContainText('didn’t answer')
  await page.locator('.host-invite-outcome').filter({ hasText: 'Leo' }).getByRole('button', { name: 'Ask again' }).click()
  await expect(page.locator('.host-invite-outcome')).toHaveCount(1)
  await expect(page.getByRole('button', { name: /Waiting on Leo/ })).toBeVisible()
  expect(fixture.errors).toEqual([])
})

test('search ignores late responses and request failures have working retries', async ({ page }) => {
  const fixture = await room(page)
  fixture.failures.search = 1
  await page.getByRole('button', { name: 'Invite people' }).click()
  const panel = page.getByRole('region', { name: 'Invite', exact: true })
  await expect(panel.getByRole('alert')).toContainText('Couldn’t load people')
  await panel.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toBeVisible()
  fixture.failures.send = 1
  await panel.getByRole('option', { name: 'Invite Joyce' }).click()
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toContainText('Couldn’t send')
  await panel.getByRole('option', { name: 'Invite Joyce' }).click()
  const pending = panel.getByRole('option', { name: 'Cancel invite to Joyce' })
  await expect(pending).toBeVisible()
  fixture.failures.cancel = 1
  await pending.click()
  await expect(pending).toContainText('Couldn’t cancel')
  await pending.click()
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toBeVisible()
  let release: () => void
  fixture.heldSearches.set('Joy', new Promise<void>(resolve => { release = resolve }))
  const input = page.getByRole('combobox', { name: 'Search everyone' })
  await input.fill('Joy')
  await page.waitForRequest(request => request.url().includes('search=Joy'))
  await input.fill('Leo')
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toBeVisible()
  const lateResponse = page.waitForResponse(response => response.url().includes('search=Joy'))
  release!()
  await lateResponse
  await expect(panel.getByRole('option')).toHaveCount(1)
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toBeVisible()
  await input.fill('Nobody')
  await expect(panel.getByText('No one named “Nobody”.')).toBeVisible()
  expect(fixture.errors).toEqual([])
})

test('reduced motion keeps the inline panel usable at every viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const fixture = await room(page, { noRecents: true })
  await page.getByRole('button', { name: 'Invite people' }).click()
  const panel = page.getByRole('region', { name: 'Invite', exact: true })
  await expect(panel.getByText('Search everyone to invite someone to the room.')).toBeVisible()
  await expect(page.locator('.watch-screen-chat-content')).toHaveCSS('opacity', '0')
  await expect(panel.locator('.host-invite-heading')).toHaveCSS('transform', 'none')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const footer = await panel.locator('.host-invite-footer').boundingBox()
  const viewport = page.viewportSize()!
  expect(footer!.y + footer!.height).toBeLessThanOrEqual(viewport.height + 1)
  await page.screenshot({ path: test.info().outputPath('b5b2-empty.png') })
  await page.getByRole('combobox', { name: 'Search everyone' }).press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Invite people' })).toBeFocused()
  expect(fixture.errors).toEqual([])
})
