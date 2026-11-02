import { expect, test, type Page } from '@playwright/test'
import { fixturePath, liveFixtures, liveAPI as api, diagnoseRuntime, reserveLiveBudget } from './live-fixtures'

// Opt in against a disposable LOCAL environment. No mocked HTTP or Pusher events.
// Fixtures: { users: [{ token }, { token }], seriesId?: number }. Keep outside Git.
test.skip(!fixturePath, 'Set E2E_LIVE_FIXTURES for real two-user API/Pusher verification')
test.setTimeout(240_000)

async function revealControls(page: Page) {
  const box = await page.locator('video').boundingBox()
  if (!box) throw new Error('Player has no visible bounds')
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
}

async function mediaReady(page: Page) {
  await expect.poll(() => page.locator('video').evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 45_000 }).toBeGreaterThanOrEqual(2)
}

async function sendMessage(page: Page, text: string) {
  await page.locator('textarea').fill(text)
  // Wait for the input update to render before the key handler clicks the
  // existing native submit button (which is disabled while the text is empty).
  await expect(page.locator('.watch-screen-chatbar button')).toBeEnabled()
  await page.locator('textarea').press('Enter')
}

test('live invitations, presence, chat, playback, seek, episodes and reconnect', async ({ browser, baseURL }, info) => {
  const fixtures = liveFixtures()
  const [a, b] = fixtures.users
  await reserveLiveBudget(a.token, 50)
  const [profileA, profileB, groups] = await Promise.all([
    api(a.token, '/api/me'), api(b.token, '/api/me'), api(a.token, `/api/shows/${fixtures.seriesId || 63}/groups`),
  ])
  const episodes = groups.flatMap(group => group.videos)
  expect(episodes.length).toBeGreaterThan(1)
  const party = await api(a.token, '/api/parties', 'POST', { show_video_id: episodes[0].id })
  // Seed enough short, valid messages to exercise scrolling without exceeding
  // the existing database's 255-character message column.
  for (let i = 0; i < 3; i++) await api(a.token, `/api/parties/${party.id}/logs/message`, 'POST', { message: `History ${i}: ${'archive '.repeat(28)}` })
  const contextA = await browser.newContext({ baseURL })
  const contextB = await browser.newContext({ baseURL, viewport: { width: 1280, height: 480 } })
  try {
    await contextA.addCookies([{ name: 'app_token', value: a.token, url: baseURL! }])
    await contextB.addCookies([{ name: 'app_token', value: b.token, url: baseURL! }])
    const pageA = await contextA.newPage()
    const pageB = await contextB.newPage()
    const caughtA = diagnoseRuntime(pageA)
    const caughtB = diagnoseRuntime(pageB)
    pageA.setDefaultTimeout(15_000)
    pageB.setDefaultTimeout(15_000)
    const errors: string[] = []
    for (const page of [pageA, pageB]) page.on('pageerror', e => errors.push(e.message))
    let subscriptionsA = new Set<string>()
    let subscriptionsB = new Set<string>()
    const eventsB: string[] = []
    let connectionsB = 0
    let disconnectB: (() => Promise<void>) | undefined
    async function bridge(page: Page) {
      await page.routeWebSocket(/pusher/, socket => {
        const server = socket.connectToServer()
        // A subscription acknowledgement from the closing connection must not
        // satisfy readiness for its replacement connection.
        const subscriptions = new Set<string>()
        if (page === pageB) {
          subscriptionsB = subscriptions
          connectionsB++
          disconnectB = () => socket.close({ code: 1012, reason: 'Migration reconnect check' })
        } else subscriptionsA = subscriptions
        server.onMessage(message => {
          const data = JSON.parse(message.toString())
          if (data.event === 'pusher_internal:subscription_succeeded') subscriptions.add(data.channel)
          if (page === pageB) eventsB.push(data.event)
          socket.send(message)
        })
      })
    }
    await bridge(pageA)
    await bridge(pageB)
    await Promise.all([pageA.goto(`/watch/${party.id}`), pageB.goto('/')])
    await mediaReady(pageA)
    await expect.poll(() => subscriptionsB.has(`private-user.${profileB.id}`)).toBe(true)
    await pageA.locator('.watch-screen-canopy button.invite').click()
    console.info('Live party: loaded both accounts; sending invitation')
    await pageA.getByPlaceholder('Search for a friend to invite...').fill(profileB.name)
    await pageA.getByRole('dialog').getByRole('button', { name: 'Invite', exact: true }).click()
    await expect(pageB.getByRole('dialog').getByText(profileA.name, { exact: true })).toBeVisible()
    await pageB.getByRole('button', { name: 'Accept', exact: true }).click()
    await expect(pageB).toHaveURL(new RegExp(`/watch/${party.id}$`))
    await mediaReady(pageB)
    console.info('Live party: invitation accepted and both media ready')
    await pageA.keyboard.press('Escape')
    await expect.poll(() => subscriptionsA.has(`presence-chat-party.${party.id}`)).toBe(true)
    await expect.poll(() => subscriptionsB.has(`presence-chat-party.${party.id}`)).toBe(true)
    await expect(pageA.locator('.watch-screen-canopy .ui-presence-avatar.is-online')).toHaveCount(1)

    const message = `Migration chat ${Date.now()}`
    await sendMessage(pageA, message)
    await expect(pageB.locator('.message .inner').getByText(message, { exact: true })).toBeVisible()
    await expect(pageB.locator('.message .inner').getByText(message, { exact: true })).toHaveCount(1)

    await pageB.locator('.watch-screen-chat-messages').evaluate(element => { element.scrollTop = 0 })
    const unread = `Unread ${Date.now()}`
    await sendMessage(pageA, unread)
    await expect(pageB.getByRole('button', { name: 'You have unread messages' })).toBeVisible()
    await pageB.getByRole('button', { name: 'You have unread messages' }).click()
    await expect(pageB.getByRole('button', { name: 'You have unread messages' })).not.toBeVisible()
    await expect(pageB.locator('.message .inner').getByText(unread, { exact: true })).toBeInViewport()
    console.info('Live party: chat delivery, unread state and scrolling verified')

    await revealControls(pageA)
    await pageA.locator('.watch-player-modal-actions button:has(.fa-play)').click()
    await expect.poll(() => pageB.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(false)
    await expect.poll(() => pageB.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.5)
    await revealControls(pageA)
    await pageA.locator('.watch-player-modal-actions button:has(.fa-pause)').click()
    await expect.poll(() => pageB.locator('video').evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)

    const seeks: { current_time: number }[] = []
    pageA.on('request', request => {
      if (request.method() === 'PUT' && request.url().endsWith(`/api/parties/${party.id}/state`)) seeks.push(request.postDataJSON())
    })
    await revealControls(pageA)
    const slider = pageA.getByRole('slider', { name: 'Playback position' })
    const thumb = await slider.boundingBox()
    const track = await pageA.locator('.app-watch-player-seeker .ui-input-slider-track').boundingBox()
    if (!thumb || !track) throw new Error('Seek slider bounds missing')
    await pageA.mouse.move(thumb.x + thumb.width / 2, thumb.y + thumb.height / 2)
    await pageA.mouse.down()
    await pageA.mouse.move(track.x + track.width * 0.1, track.y + track.height / 2, { steps: 6 })
    expect(seeks).toHaveLength(0)
    await pageA.mouse.up()
    await expect.poll(() => seeks.length).toBe(1)
    await expect.poll(async () => Math.abs(await pageB.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime) - seeks[0].current_time)).toBeLessThan(2)
    console.info('Live party: playback and committed seek verified')

    const subtitles = await api(a.token, `/api/videos/${episodes[0].id}/subtitle`)
    const cue = subtitles.subtitle.match(/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/)
    if (!cue) throw new Error('Playable episode has no subtitle cue')
    const seconds = (stamp: string) => {
      const [h, m, s] = stamp.replace(',', '.').split(':').map(Number)
      return h * 3600 + m * 60 + s
    }
    const cueTime = Math.ceil((seconds(cue[1]) + seconds(cue[2])) / 2)
    await api(a.token, `/api/parties/${party.id}/state`, 'PUT', { is_playing: false, current_time: cueTime })
    await expect(pageA.locator('.subtitle-slot .subtitle').first()).toBeVisible()
    await revealControls(pageA)
    await pageA.locator('.watch-player-modal-actions button:has(.fa-align-center)').click()
    await expect(pageA.locator('.subtitle-slot .subtitle')).toHaveCount(0)
    await pageA.locator('.watch-player-modal-actions button:has(.fa-align-center)').click()
    await expect(pageA.locator('.subtitle-slot .subtitle').first()).toBeVisible()

    await revealControls(pageA)
    await pageA.locator('.watch-player-modal-actions button:has(.fa-list-ol)').click()
    await pageA.getByRole('dialog').getByRole('button', { name: new RegExp(episodes[1].title) }).click()
    await expect(pageA.locator('video')).toHaveAttribute('src', episodes[1].video_url)
    await expect.poll(() => eventsB.includes('video-changed')).toBe(true)
    await test.step('Known baseline defect: remote episode stays stale until reload', async () => {
      // Reproduced on original React 16/Parcel output (baseline party 8).
      // There is no video-changed listener in either version. This is parity
      // evidence, not a passing claim for remote episode synchronization.
      await expect(pageB.locator('video')).toHaveAttribute('src', episodes[0].video_url)
      info.annotations.push({ type: 'baseline-defect', description: 'Remote episode changes require reload; missing video-changed listener is outside migration repair scope.' })
    })
    await pageA.keyboard.press('Escape')
    await pageB.reload()
    await expect(pageB.locator('video')).toHaveAttribute('src', episodes[1].video_url)
    await mediaReady(pageB)
    await expect.poll(() => subscriptionsB.has(`private-party.${party.id}`)).toBe(true)

    const oldConnections = connectionsB
    await disconnectB!()
    await expect.poll(() => connectionsB, { timeout: 30_000 }).toBeGreaterThan(oldConnections)
    await expect.poll(() => subscriptionsB.has(`private-party.${party.id}`), { timeout: 30_000 }).toBe(true)
    const reconnectedMessage = `Reconnected ${Date.now()}`
    await sendMessage(pageA, reconnectedMessage)
    await expect(pageB.locator('.message .inner').getByText(reconnectedMessage, { exact: true })).toBeVisible()
    await expect(pageB.locator('.message .inner').getByText(reconnectedMessage, { exact: true })).toHaveCount(1)

    const nextParty = await api(a.token, '/api/parties', 'POST', { show_video_id: episodes[0].id })
    await api(a.token, `/api/parties/${nextParty.id}/invitations/send`, 'POST', { recipient_id: profileB.id })
    await pageB.getByRole('button', { name: 'Accept', exact: true }).click()
    await expect(pageB).toHaveURL(new RegExp(`/watch/${nextParty.id}$`))
    await test.step('Known baseline defect: switching parties retains the old room until reload', async () => {
      // Original React 16/Parcel reproduction: party 28 -> a second party.
      await expect(pageB.locator('video')).toHaveAttribute('src', episodes[1].video_url)
      expect(subscriptionsB.has(`private-party.${nextParty.id}`)).toBe(false)
      info.annotations.push({ type: 'baseline-defect', description: 'In-place party switching changes the URL but retains the old room until reload; original route effect has no party-ID dependency.' })
    })
    await pageB.reload()
    await expect(pageB.locator('video')).toHaveAttribute('src', episodes[0].video_url)
    await mediaReady(pageB)
    expect([...errors, ...caughtA, ...caughtB]).toEqual([])
    await pageA.screenshot({ path: info.outputPath('live-watch-party.png') })
  } catch (error) {
    console.info('Live party failure:', String(error.message).split('\n')[0])
    throw error
  } finally {
    await Promise.all([contextA.close(), contextB.close()])
  }
})
