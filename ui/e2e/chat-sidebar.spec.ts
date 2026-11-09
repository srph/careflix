import { expect, test, type WebSocketRoute } from '@playwright/test'

const viewer = { id: 95001, name: 'Kier', email: 'kier@example.test', avatar: null, is_online: true }
const joyce = { ...viewer, id: 95002, name: 'Joyce', email: 'joyce@example.test' }
const mira = { ...viewer, id: 95003, name: 'Mira', email: 'mira@example.test' }
const leo = { ...viewer, id: 95004, name: 'Leo', email: 'leo@example.test' }
const show = { id: 96001, title: 'Chat Sidebar Movie', title_type: 'movie', preview_image: null, air_start: '2020-01-01 00:00:00' }
const video = { id: 97001, title: show.title, show, duration: 7200, subtitle_url: null, video_url: 'https://media.example.test/movie.mp4' }
const party = { id: 98001, join_code: '482913', video, current_time: 2472, is_playing: false, invitations: [],
  members: [viewer, joyce, mira].map(user => ({ ...user, pivot: { is_active: true } })) }
const channel = `private-party.${party.id}`

let id = 0
const activity = (user, kind: string, created_at: string, meta = null) => {
  const key = ++id
  return { id: key, party_id: party.id, type: 'activity', created_at, activity: { id: key, text: kind, kind, meta, user, created_at, updated_at: created_at } }
}
const message = (user, text: string, created_at: string) => {
  const key = ++id
  return { id: key, party_id: party.id, type: 'message', created_at, message: { id: key, text, user, created_at, updated_at: created_at } }
}

async function room(page) {
  let connection: WebSocketRoute
  const subscribed = new Set<string>()
  const sent: any[] = []
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.context().addCookies([{ name: 'app_token', value: 'chat-sidebar-fixture', url: test.info().project.use.baseURL as string }])
  const emit = (name: string, event: string, data: unknown) => connection.send(JSON.stringify({ channel: name, event, data: JSON.stringify(data) }))
  await page.routeWebSocket(/pusher/, socket => {
    connection = socket
    socket.send(JSON.stringify({ event: 'pusher:connection_established', data: JSON.stringify({ socket_id: '123.456', activity_timeout: 120 }) }))
    socket.onMessage(raw => {
      const payload = JSON.parse(String(raw))
      sent.push(payload)
      if (payload.event === 'pusher:subscribe') {
        subscribed.add(payload.data.channel)
        emit(payload.data.channel, 'pusher_internal:subscription_succeeded', { presence: { ids: [], hash: {}, count: 0 } })
      }
    })
  })
  await page.route('**/broadcasting/auth', route => route.fulfill({ json: { auth: 'fixture:signature', channel_data: JSON.stringify({ user_id: viewer.id }) } }))
  await page.route('https://media.example.test/**', route => route.fulfill({ status: 404, body: '' }))
  const logs = [
    activity(viewer, 'created', '2026-11-10 21:02:00'),
    activity(joyce, 'joined', '2026-11-10 21:03:00'),
    message(joyce, 'ok snacks acquired', '2026-11-10 21:03:00'),
    message(joyce, 'start whenever', '2026-11-10 21:03:10'),
    message(viewer, 'pressing play 🍿', '2026-11-10 21:04:00'),
    activity(viewer, 'played', '2026-11-10 21:04:05', { seconds: 0 }),
    // A quiet stretch: the next message gets its own time divider.
    activity(viewer, 'paused', '2026-11-10 21:45:00', { seconds: 2472 }),
    message(joyce, 'WHO is he', '2026-11-10 21:45:10')
  ]
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname
    let body: unknown = {}
    if (path === '/api/me') body = { ...viewer, invitations: [] }
    if (path === `/api/parties/${party.id}`) body = party
    if (path.endsWith('/logs')) body = logs
    if (path.endsWith('/invitations')) body = []
    await route.fulfill({ json: body })
  })
  await page.goto(`/watch/${party.id}`)
  await expect.poll(() => subscribed.has(channel)).toBe(true)
  return { emit, sent, errors }
}

test('the status row follows playback, typing and arrivals while the list stays conversation', async ({ page }) => {
  const fixture = await room(page)
  const status = page.locator('.watch-screen-chat-status')
  const messages = page.locator('.watch-screen-chat-messages')

  await expect(status).toHaveText('You paused at 41:12')
  // Activity no longer interrupts the conversation; time marks the start and the quiet stretch.
  await expect(messages).not.toContainText('paused')
  await expect(page.locator('.watch-screen-chat-time')).toHaveText(['9:03 PM', '9:45 PM'])
  await expect(page.locator('.watch-screen-chat-group.is-self .message')).toHaveText('pressing play 🍿')
  await expect(page.locator('.watch-screen-canopy').getByRole('button', { name: 'Copy party code 482 913' })).toBeVisible()

  fixture.emit(channel, 'log', { log: activity(mira, 'seeked', '2026-11-10 21:46:00', { seconds: 2327, from_seconds: 2481 }) })
  await expect(status).toHaveText('Mira jumped back to 38:47')

  fixture.emit(channel, 'client-typing', { user: { id: joyce.id, name: 'Joyce' } })
  fixture.emit(channel, 'client-typing', { user: { id: mira.id, name: 'Mira' } })
  await expect(status).toHaveText('Joyce and Mira are typing')
  fixture.emit(channel, 'log', { log: message(joyce, 'and why does he have the key', '2026-11-10 21:46:10') })
  await expect(status).toHaveText('Mira is typing')
  await expect(messages).toContainText('and why does he have the key')

  // An arrival briefly outranks typing, then the row settles back on playback once Mira goes quiet.
  fixture.emit(channel, 'log', { log: activity(leo, 'joined_code', '2026-11-10 21:46:20') })
  await expect(status).toHaveText(/Leo (just joined|is here)\. (Let’s fucking go|Let’s do this|Time to run it down|Game on|We are so back)\.$/)
  await page.screenshot({ path: test.info().outputPath('chat-sidebar-join.png') })
  await expect(status).toHaveText('Mira jumped back to 38:47', { timeout: 6000 })
  expect(fixture.errors).toEqual([])
})

test('the composer grows, pings typing, keeps its ring on the field, and sends with Enter', async ({ page }) => {
  const fixture = await room(page)
  const composer = page.getByRole('textbox', { name: 'Message' })
  const field = page.locator('.watch-screen-chatbar-input')

  await composer.focus()
  await page.keyboard.type('ok hear me out')
  await expect.poll(() => fixture.sent.filter(event => event.event === 'client-typing').length).toBe(1)
  expect(fixture.sent.find(event => event.event === 'client-typing')).toMatchObject({ channel, data: { user: { id: viewer.id, name: viewer.name } } })

  await expect(field).toHaveCSS('outline-style', 'solid')
  await expect(page.locator('.watch-screen-chatbar')).toHaveCSS('outline-style', 'none')
  await expect(composer).toHaveCSS('outline-style', 'none')

  await page.keyboard.press('Shift+Enter')
  await page.keyboard.type('the key opens the lighthouse')
  await page.keyboard.press('Shift+Enter')
  await page.keyboard.type('not the basement')
  const grown = await composer.evaluate(element => element.getBoundingClientRect().height)
  expect(grown).toBeGreaterThan(44)
  expect(grown).toBeLessThanOrEqual(132)
  await page.screenshot({ path: test.info().outputPath('chat-sidebar-composer.png') })

  let posted: unknown
  await page.route(`**/api/parties/${party.id}/logs/message`, async route => {
    posted = route.request().postDataJSON()
    await route.fulfill({ json: message(viewer, 'sent', '2026-11-10 21:47:00') })
  })
  await page.keyboard.press('Enter')
  await expect.poll(() => posted).toEqual({ message: 'ok hear me out\nthe key opens the lighthouse\nnot the basement' })
  await expect(composer).toHaveValue('')
  expect(await composer.evaluate(element => element.getBoundingClientRect().height)).toBe(44)
  expect(fixture.errors).toEqual([])
})
