import { expect, test, type WebSocketRoute } from '@playwright/test'

// Controlled HTTP/WebSocket fixtures verify initialization independently of webhook DB flags.
test('watch subtitles and presence initialize from API and Pusher rosters', async ({ page }) => {
  const viewer = { id: 90001, name: 'Viewer', email: 'viewer@example.test', avatar: null, is_online: true }
  const online = { ...viewer, id: 90002, name: 'Connected Friend', is_online: false, pivot: { is_active: false } }
  const offline = { ...viewer, id: 90003, name: 'Offline Friend', is_online: true, pivot: { is_active: true } }
  const show = { id: 91001, title: 'Watch Regression Movie', title_type: 'movie', preview_image: null, air_start: '2020-01-01 00:00:00' }
  const video = { id: 92001, title: show.title, show, duration: 120, subtitle_url: 'https://media.example.test/movie.srt', video_url: 'https://media.example.test/movie.mp4' }
  const party = { id: 94001, video, current_time: 0, is_playing: false, invitations: [], members: [{ ...viewer, pivot: { is_active: false } }, online, offline] }
  const room = `presence-chat-party.${party.id}`
  const subscriptions = new Set<string>()
  const errors: string[] = []
  const subtitlePaths: string[] = []
  let connection: WebSocketRoute
  let loadSearch: () => void
  const searchReady = new Promise<void>(resolve => { loadSearch = resolve })
  page.on('pageerror', error => errors.push(error.message))
  await page.context().addCookies([{ name: 'app_token', value: 'watch-regression-fixture', url: test.info().project.use.baseURL as string }])
  const emit = (channel: string, event: string, data: unknown) => connection.send(JSON.stringify({ channel, event, data: JSON.stringify(data) }))
  const roster = (ids: number[]) => ({ presence: { ids: ids.map(String), hash: Object.fromEntries(ids.map(id => [id, {}])), count: ids.length } })
  await page.routeWebSocket(/pusher/, socket => {
    connection = socket
    socket.send(JSON.stringify({ event: 'pusher:connection_established', data: JSON.stringify({ socket_id: '123.456', activity_timeout: 120 }) }))
    socket.onMessage(message => {
      const payload = JSON.parse(String(message))
      if (payload.event === 'pusher:subscribe') {
        subscriptions.add(payload.data.channel)
        emit(payload.data.channel, 'pusher_internal:subscription_succeeded', roster([viewer.id, online.id]))
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
    if (path.endsWith('/invitations/search')) {
      await searchReady
      body = [online, offline]
    }
    if (path.endsWith('/subtitle')) {
      subtitlePaths.push(path)
      body = { subtitle: '1\n00:00:00,000 --> 00:00:05,000\nWatching together\n\n' }
    }
    await route.fulfill({ json: body })
  })

  await page.goto(`/watch/${party.id}`)
  await expect.poll(() => subscriptions.has(room)).toBe(true)
  await expect(page.locator('.watch-screen-canopy .ui-presence-avatar.is-online')).toHaveCount(1)
  await page.locator('video').evaluate(video => video.dispatchEvent(new Event('loadeddata')))
  await expect(page.locator('.subtitle-slot .subtitle')).toHaveText('Watching together')
  expect(subtitlePaths).toEqual([`/api/videos/${video.id}/subtitle`])
  await page.locator('video').evaluate((video: HTMLVideoElement) => {
    video.currentTime = 2
    video.dispatchEvent(new Event('timeupdate'))
  })

  // Search results arrive after presence; stale API flags must not overwrite the roster.
  loadSearch()
  await page.locator('.watch-screen-canopy button.invite').click()
  const friend = (name: string) => page.locator('.user-item').filter({ hasText: name }).locator('.ui-presence-avatar')
  await expect(friend(online.name)).toHaveClass(/is-online/)
  await expect(friend(offline.name)).not.toHaveClass(/is-online/)
  emit('presence-chat', 'pusher_internal:member_removed', { user_id: String(online.id) })
  await expect(friend(online.name)).not.toHaveClass(/is-online/)
  await page.keyboard.press('Escape')

  emit(room, 'pusher_internal:member_removed', { user_id: String(online.id) })
  await expect(page.locator('.watch-screen-canopy .ui-presence-avatar.is-online')).toHaveCount(0)
  emit(room, 'pusher_internal:member_added', { user_id: String(offline.id), user_info: {} })
  await expect(page.locator('.watch-screen-canopy .ui-presence-avatar.is-online')).toHaveCount(1)
  // A replacement subscription roster must clear stale online members, too.
  emit(room, 'pusher_internal:subscription_succeeded', roster([viewer.id]))
  await expect(page.locator('.watch-screen-canopy .ui-presence-avatar.is-online')).toHaveCount(0)
  expect(await page.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime)).toBe(2)

  const sync = () => emit(`private-party.${party.id}`, 'state', { state: { current_time: 3, is_playing: false } })
  sync()
  await expect.poll(() => page.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime)).toBe(3)
  await page.locator('video').evaluate((video: HTMLVideoElement) => {
    video.currentTime = 4
    video.dispatchEvent(new Event('timeupdate'))
  })
  sync()
  await expect.poll(() => page.locator('video').evaluate((video: HTMLVideoElement) => video.currentTime)).toBe(3)
  expect(errors).toEqual([])
})
