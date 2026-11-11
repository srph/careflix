import { expect, test, type WebSocketRoute } from '@playwright/test'

const viewer = { id: 95101, name: 'Kier', email: 'kier@example.test', avatar: null, is_online: true }
const joyce = { ...viewer, id: 95102, name: 'Joyce', email: 'joyce@example.test' }
const mira = { ...viewer, id: 95103, name: 'Mira', email: 'mira@example.test' }
const leo = { ...viewer, id: 95104, name: 'Leo', email: 'leo@example.test' }
const show = { id: 96101, title: 'Activity Overlay Movie', title_type: 'movie', preview_image: null, air_start: '2020-01-01 00:00:00' }
const video = { id: 97101, title: show.title, show, duration: 7200, subtitle_url: null, video_url: 'https://media.example.test/movie.mp4' }
const party = { id: 98101, join_code: '482913', video, current_time: 2472, is_playing: false, invitations: [],
  members: [viewer, joyce, mira, leo].map(user => ({ ...user, pivot: { is_active: true } })) }
const channel = `private-party.${party.id}`
const at = '2026-11-11 21:00:00'

let id = 0
const activity = (user, kind: string, meta = null) => {
  const key = ++id
  return { id: key, party_id: party.id, type: 'activity', created_at: at, activity: { id: key, text: kind, kind, meta, user, created_at: at, updated_at: at } }
}
const message = (user, text: string) => {
  const key = ++id
  return { id: key, party_id: party.id, type: 'message', created_at: at, message: { id: key, text, user, created_at: at, updated_at: at } }
}

test.skip(({ isMobile }) => isMobile, 'The Activity Overlay starts at 640px; phones go without it for now.')

async function room(page) {
  let connection: WebSocketRoute
  const subscribed = new Set<string>()
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.context().addCookies([{ name: 'app_token', value: 'activity-overlay-fixture', url: test.info().project.use.baseURL as string }])
  const emit = (event: string, data: unknown) => connection.send(JSON.stringify({ channel, event, data: JSON.stringify(data) }))
  await page.routeWebSocket(/pusher/, socket => {
    connection = socket
    socket.send(JSON.stringify({ event: 'pusher:connection_established', data: JSON.stringify({ socket_id: '123.456', activity_timeout: 120 }) }))
    socket.onMessage(raw => {
      const payload = JSON.parse(String(raw))
      if (payload.event === 'pusher:subscribe') {
        subscribed.add(payload.data.channel)
        connection.send(JSON.stringify({ channel: payload.data.channel, event: 'pusher_internal:subscription_succeeded', data: JSON.stringify({ presence: { ids: [], hash: {}, count: 0 } }) }))
      }
    })
  })
  await page.route('**/broadcasting/auth', route => route.fulfill({ json: { auth: 'fixture:signature', channel_data: JSON.stringify({ user_id: viewer.id }) } }))
  await page.route('https://media.example.test/**', route => route.fulfill({ status: 404, body: '' }))
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname
    let body: unknown = {}
    if (path === '/api/me') body = { ...viewer, invitations: [] }
    if (path === `/api/parties/${party.id}`) body = party
    if (path.endsWith('/logs')) body = []
    if (path.endsWith('/invitations')) body = []
    await route.fulfill({ json: body })
  })
  await page.goto(`/watch/${party.id}`)
  await expect.poll(() => subscribed.has(channel)).toBe(true)
  return { emit, errors }
}

async function openMenu(page) {
  const video = page.locator('.watch-screen-video .container')
  const box = await video.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3)
  await page.mouse.move(box.x + box.width / 2 + 10, box.y + box.height / 3)
  await page.getByRole('button', { name: 'Activity Overlay' }).click()
  await expect(page.getByRole('menu')).toBeVisible()
}

test('shows the room on the picture while chat is closed, filtered by the bell', async ({ page }) => {
  const fixture = await room(page)
  const overlay = page.locator('.activity-overlay')

  // With chat open, the conversation stays in the sidebar.
  fixture.emit('log', { log: message(joyce, 'ok snacks acquired') })
  await expect(page.locator('.watch-screen-chat-messages')).toContainText('ok snacks acquired')
  await expect(overlay.locator('.line')).toHaveCount(0)

  await page.keyboard.press('c')
  fixture.emit('log', { log: message(joyce, 'WHO is he') })
  fixture.emit('log', { log: activity(leo, 'joined_code') })
  fixture.emit('log', { log: activity(mira, 'paused', { seconds: 2472 }) })
  fixture.emit('log', { log: message(viewer, 'mine never shows') })
  fixture.emit('client-typing', { user: { id: leo.id, name: 'Leo' } })
  await expect(overlay.locator('.line .text')).toHaveText(['Joyce WHO is he', /^Leo (just joined|is here)\.$/, 'Mira paused at 41:12', 'Leo is typing'])
  await page.screenshot({ path: test.info().outputPath('activity-overlay-all.png') })

  // A friend's reaction floats at Everything.
  fixture.emit('client-reaction', { userId: joyce.id, emoji: '😂' })
  await expect(page.locator('.reaction-float')).toHaveCount(1)

  await openMenu(page)
  await expect(page.getByRole('menuitemradio', { name: /^Everything/ })).toHaveAttribute('aria-checked', 'true')
  await page.locator('.activity-menu').evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished)))
  const origin = await page.locator('.activity-menu').evaluate(element => getComputedStyle(element).transformOrigin)
  const bell = await page.getByRole('button', { name: 'Activity Overlay' }).boundingBox()
  const menu = await page.locator('.activity-menu').boundingBox()
  // The menu grows from the bell's centre.
  expect(Math.abs(menu.x + parseFloat(origin) - (bell.x + bell.width / 2))).toBeLessThan(2)
  await page.screenshot({ path: test.info().outputPath('activity-overlay-menu.png') })

  await page.getByRole('menuitemradio', { name: /^Just joins and pauses/ }).click()
  await expect(page.getByRole('menu')).toBeHidden()
  await expect(page.locator('.activity-overlay-toast')).toHaveText('Showing joins and pauses only')
  await expect(overlay.locator('.line .text')).toHaveText([/^Leo (just joined|is here)\.$/, 'Mira paused at 41:12'])
  await expect(page.getByRole('button', { name: 'Activity Overlay' }).locator('.fa')).toHaveClass(/fa-bell-o/)

  fixture.emit('log', { log: message(joyce, 'hidden at this level') })
  fixture.emit('log', { log: activity(joyce, 'played', { seconds: 2472 }) })
  fixture.emit('client-reaction', { userId: joyce.id, emoji: '🔥' })
  fixture.emit('log', { log: activity(joyce, 'paused', { seconds: 2500 }) })
  await expect(overlay.locator('.line .text').last()).toHaveText('Joyce paused at 41:40')
  await expect(overlay).not.toContainText('hidden at this level')
  await expect(overlay).not.toContainText('pressed play')
  await expect(page.locator('.reaction-float .emoji', { hasText: '🔥' })).toHaveCount(0)

  // Clicking a line opens chat, which takes the lines back.
  await overlay.locator('.line').last().click()
  await expect(page.locator('.watch-screen-chat')).toHaveClass(/is-chat-open/)
  await expect(overlay.locator('.line')).toHaveCount(0)
  // With the sidebar open, reactions float whatever the level.
  fixture.emit('client-reaction', { userId: mira.id, emoji: '😭' })
  await expect(page.locator('.reaction-float .emoji', { hasText: '😭' })).toHaveCount(1)
  expect(fixture.errors).toEqual([])
})

test('remembers the level for the account and shows nothing when off', async ({ page }) => {
  const fixture = await room(page)
  await openMenu(page)
  await page.getByRole('menuitemradio', { name: /^Off/ }).click()
  await expect(page.locator('.activity-overlay-toast')).toHaveText('Activity off')
  expect(await page.evaluate(key => localStorage.getItem(key), `care.activity-overlay.${viewer.id}`)).toBe('"off"')

  await page.reload()
  const again = await room(page)
  await page.keyboard.press('c')
  again.emit('log', { log: activity(leo, 'joined') })
  again.emit('client-reaction', { userId: joyce.id, emoji: '😂' })
  await page.waitForTimeout(500)
  await expect(page.locator('.activity-overlay .line')).toHaveCount(0)
  await expect(page.locator('.reaction-float')).toHaveCount(0)

  await openMenu(page)
  await expect(page.getByRole('menuitemradio', { name: /^Off/ })).toHaveAttribute('aria-checked', 'true')
  // The seek bar and its times step aside for the menu.
  await expect(page.locator('.watch-player-controls')).toBeHidden()
  // The menu keeps the controls up past their usual 5 seconds.
  await page.waitForTimeout(5600)
  await expect(page.getByRole('menu')).toBeVisible()
  await page.getByRole('menuitemradio', { name: /^Off/ }).click()
  await expect(page.getByRole('menu')).toBeHidden()
  await expect(page.locator('.watch-player-controls')).toBeVisible()
  // From the keyboard, focus lands back on the bell and its tooltip takes the bar's place, like every control.
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menu')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('menu')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Activity Overlay' })).toBeFocused()
  expect([...fixture.errors, ...again.errors]).toEqual([])
})

test('works on a tablet in portrait, and stops below 640px', async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 })
  const fixture = await room(page)
  await page.keyboard.press('c')
  fixture.emit('log', { log: activity(leo, 'joined') })
  await expect(page.locator('.activity-overlay .line .text')).toHaveText([/^Leo (just joined|is here)\.$/])
  await openMenu(page)
  await page.getByRole('menuitemradio', { name: /^Off/ }).click()
  await expect(page.locator('.activity-overlay-toast')).toHaveText('Activity off')

  await page.setViewportSize({ width: 639, height: 900 })
  await expect(page.locator('.activity-overlay')).toBeHidden()
  await expect(page.getByRole('button', { name: 'Activity Overlay' })).toBeHidden()
  expect(fixture.errors).toEqual([])
})
