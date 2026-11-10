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
  const searches: string[] = []
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
      searches.push(query)
      await heldSearches.get(query)
      // Like the API: recents leave the room out; a search covers everyone but the viewer.
      body = !query ? (options.noRecents ? [] : people)
        : [mira, ...people].filter(person => person.name.toLowerCase().includes(query.toLowerCase()))
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
  return { errors, emit, failures, sent, searches, heldSearches, history }
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
  const input = page.getByRole('combobox', { name: 'Search for your friends by username' })
  await expect(input).toBeFocused()
  await expect(panel.getByText('Party', { exact: true })).toBeVisible()
  await expect(panel.getByText('Recents', { exact: true })).toBeVisible()
  await expect(panel.getByText('Host 👑', { exact: true })).toBeVisible()
  await expect(panel.getByText('(You)', { exact: true })).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  // The panel is a solid sheet over the chat, which stays put underneath but can't be reached.
  await expect(page.locator('.watch-screen-chat-content')).toHaveAttribute('inert', '')
  await expect(panel).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  const bounds = await panel.boundingBox()
  const chatBounds = await page.locator('.watch-screen-chat').boundingBox()
  expect(bounds!.width).toBe(chatBounds!.width)
  expect(bounds!.height).toBe(chatBounds!.height)
  await expect(panel.getByRole('option').last().locator('..')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: test.info().outputPath('b5b2-recents.png') })

  await input.fill('Joyce')
  // Wait for the answer itself: the groups fading out still hold a (now inert) Joyce row.
  await expect(panel.locator('.host-invite-results').getByRole('option', { name: 'Invite Joyce' })).toBeVisible()
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(panel.getByRole('option', { name: 'Undo invite to Joyce' })).toContainText('Invited (30m)')
  await expect(panel.locator('.host-invite-results').getByRole('option', { name: 'Undo invite to Joyce' })).toHaveCount(1)
  expect(fixture.sent).toEqual([joyce.id])
  await expect(input).toHaveValue('Joyce')
  await input.fill('')
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toBeVisible()
  // Back in the groups, rows stay where they were while the panel is open.
  await expect(panel.locator('.host-invite-group').getByRole('option', { name: 'Undo invite to Joyce' })).toHaveCount(1)
  await panel.getByRole('button', { name: 'Copy party code 048 291' }).click()
  await expect(panel.getByRole('status')).toHaveText('Party code copied')
  await expect(panel.getByRole('option').last().locator('..')).toHaveCSS('opacity', '1')
  await page.screenshot({ path: test.info().outputPath('b5b2-pending.png') })
  await input.press('Escape')
  // The list fades out with the rest of the panel instead of vanishing after it.
  const opacity = (selector: string) => {
    let element = document.querySelector(selector) as HTMLElement | null, value = 1
    while (element) { value *= Number(getComputedStyle(element).opacity); element = element.parentElement }
    return value
  }
  const closing = await page.waitForFunction(fn => {
    const read = new Function(`return (${fn})`)() as (selector: string) => number
    return document.querySelector('.host-invite-heading') && read('.host-invite-heading') < .7
      ? read('.host-invite-person') : null
  }, opacity.toString(), { polling: 'raf' })
  expect(await closing.jsonValue()).toBeLessThan(.9)
  await expect(panel).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await expect(composer).toHaveValue('Keep this draft')
  expect(await messages.evaluate(element => element.scrollTop)).toBe(80)
  await expect(page.getByRole('button', { name: /Waiting on Joyce/ })).toBeVisible()
  await page.getByRole('button', { name: /Waiting on Joyce/ }).click()
  // Reopened, she sits with the party.
  await expect(panel.locator('.host-invite-group').getByRole('option', { name: 'Undo invite to Joyce' })).toHaveCount(0)
  await panel.getByRole('option', { name: 'Undo invite to Joyce' }).click()
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
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toContainText('Expired', { timeout: 6000 })
  const leoInvite = invitation(leo, 1200)
  fixture.emit('invitation.sent', { invitation: leoInvite })
  fixture.emit('invitation.sent', { invitation: leoInvite })
  await expect(panel.getByRole('option', { name: 'Undo invite to Leo' })).toHaveCount(1)
  fixture.emit('invitation.declined', { invitation: { ...leoInvite, action: 'declined' } })
  fixture.emit('invitation.sent', { invitation: leoInvite })
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toContainText('Declined')
  await expect(page.locator('.host-invite-waiting')).toContainText('Leo declined')
  const avaInvite = invitation(ava, 1300)
  fixture.emit('invitation.sent', { invitation: avaInvite })
  fixture.emit('invitation.accepted', { invitation: { ...avaInvite, action: 'accepted' }, member: { ...ava, pivot: { is_active: true } } })
  fixture.emit('member.joined', { member: { ...ava, pivot: { is_active: true } } })
  const avaRow = panel.locator('.host-invite-person').filter({ hasText: 'Ava' })
  await expect(avaRow).toHaveCount(1)
  await expect(avaRow).toContainText('Joined')
  await expect(avaRow.locator('.host-invite-action')).toHaveCount(0)
  // Answers show for 4s, then the rows rest.
  await expect(avaRow).toContainText('In the room', { timeout: 6000 })
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toContainText('Offline')
  await panel.getByRole('button', { name: 'Close invite' }).click()
  await expect(page.locator('.host-invite-waiting')).toHaveCount(0)
  const again = invitation(leo, 1400)
  fixture.emit('invitation.sent', { invitation: again })
  await expect(page.getByRole('button', { name: /Waiting on Leo/ })).toBeVisible()
  fixture.emit('invitation.declined', { invitation: { ...again, action: 'declined' } })
  await page.getByRole('button', { name: 'Invite Leo again' }).click()
  await expect(page.getByRole('button', { name: /Waiting on Leo/ })).toBeVisible()
  expect(fixture.sent).toEqual([leo.id])
  expect(fixture.errors).toEqual([])
})

test('search ignores late responses and request failures have working retries', async ({ page }) => {
  const fixture = await room(page)
  // The first try and Query's two retries all fail.
  fixture.failures.search = 3
  await page.getByRole('button', { name: 'Invite people' }).click()
  const panel = page.getByRole('region', { name: 'Invite', exact: true })
  await expect(panel.getByRole('alert')).toContainText('Couldn’t load people', { timeout: 8000 })
  await panel.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toBeVisible()
  fixture.failures.send = 1
  await panel.getByRole('option', { name: 'Invite Joyce' }).click()
  await expect(panel.getByRole('option', { name: 'Retry invite to Joyce' })).toContainText('Couldn’t send')
  await panel.getByRole('option', { name: 'Retry invite to Joyce' }).click()
  const pending = panel.getByRole('option', { name: 'Undo invite to Joyce' })
  await expect(pending).toBeVisible()
  fixture.failures.cancel = 1
  await pending.click()
  await expect(pending).toContainText('Couldn’t undo')
  await pending.click()
  await expect(panel.getByRole('option', { name: 'Invite Joyce' })).toBeVisible()
  let release: () => void
  fixture.heldSearches.set('Joy', new Promise<void>(resolve => { release = resolve }))
  const input = page.getByRole('combobox', { name: 'Search for your friends by username' })
  const searchSent = page.waitForRequest(request => request.url().includes('search=Joy'))
  await input.fill('Joy')
  // The list follows the search query, which waits out the debounce: the groups stay while you type...
  await expect(panel.getByText('Party', { exact: true })).toBeVisible()
  await expect(panel.locator('.host-invite-skeletons')).toHaveCount(0)
  // ...then the search goes out and its own list (no headings) shows the skeleton until it answers.
  await searchSent
  await expect(panel.locator('.host-invite-skeletons')).toBeVisible()
  await expect(panel.getByText('Party', { exact: true })).toHaveCount(0)
  await input.fill('Leo')
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toBeVisible()
  await expect(panel.locator('.host-invite-skeletons')).toHaveCount(0)
  release!()
  await page.waitForTimeout(300)
  await expect(panel.getByRole('option')).toHaveCount(1)
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toBeVisible()
  // People in the room come back from the search like anyone else; their subtext says so.
  await input.fill('Mi')
  await expect(panel.getByRole('option', { name: 'Mira, in the room' })).toContainText('In the room')
  await input.fill('Nobody')
  await expect(panel.getByText('No one named “Nobody”.')).toBeVisible()
  // A search that fails says so where the rows would be, and Retry runs it again.
  fixture.failures.search = 3
  await input.fill('Ava')
  await expect(panel.getByRole('alert')).toContainText('Couldn’t search for “Ava”.', { timeout: 8000 })
  let answer: () => void
  fixture.heldSearches.set('Ava', new Promise<void>(resolve => { answer = resolve }))
  await panel.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(panel.locator('.host-invite-skeletons')).toBeVisible()
  answer!()
  await expect(panel.getByRole('option', { name: 'Invite Ava' })).toBeVisible()
  // A search already answered comes back at once from the cache.
  const searches = fixture.searches.length
  await input.fill('Leo')
  await expect(panel.getByRole('option', { name: 'Invite Leo' })).toBeVisible()
  await expect(panel.locator('.host-invite-skeletons')).toHaveCount(0)
  expect(fixture.searches.length).toBe(searches)
  expect(fixture.errors).toEqual([])
})

test('reduced motion keeps the inline panel usable at every viewport', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const fixture = await room(page, { noRecents: true })
  await page.getByRole('button', { name: 'Invite people' }).click()
  const panel = page.getByRole('region', { name: 'Invite', exact: true })
  await expect(panel.getByRole('combobox', { name: 'Search for your friends by username' })).toBeFocused()
  await expect(panel.locator('.host-invite-note')).toHaveCount(0)
  // The panel is a solid sheet over the chat, which stays put underneath but can't be reached.
  await expect(page.locator('.watch-screen-chat-content')).toHaveAttribute('inert', '')
  await expect(panel).not.toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')
  await expect(panel.locator('.host-invite-heading')).toHaveCSS('transform', 'none')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  const footer = await panel.locator('.host-invite-footer').boundingBox()
  const viewport = page.viewportSize()!
  expect(footer!.y + footer!.height).toBeLessThanOrEqual(viewport.height + 1)
  await page.screenshot({ path: test.info().outputPath('b5b2-empty.png') })
  await page.getByRole('combobox', { name: 'Search for your friends by username' }).press('Escape')
  await expect(panel).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Invite people' })).toBeFocused()
  expect(fixture.errors).toEqual([])
})
