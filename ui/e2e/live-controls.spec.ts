import { expect, test } from '@playwright/test'
import { fixturePath, liveFixtures, liveAPI as api, diagnoseRuntime, reserveLiveBudget } from './live-fixtures'

test.skip(!fixturePath, 'Set E2E_LIVE_FIXTURES for live media controls')
test.use({ trace: 'off' })
test.setTimeout(120_000)

test('live media controls, textarea fallback, icons and leave-party navigation', async ({
  page,
  baseURL,
  isMobile
}, info) => {
  const caughtErrors = diagnoseRuntime(page)
  const runtimeErrors: string[] = []
  const apiFailures: string[] = []
  page.on('pageerror', (error) => runtimeErrors.push(error.message))
  page.on('response', (response) => {
    const path = new URL(response.url()).pathname
    if (response.status() >= 400 && (path.startsWith('/api/') || path === '/broadcasting/auth'))
      apiFailures.push(`${response.status()} ${path}`)
  })
  const fixtures = liveFixtures()
  const token = fixtures.users[0].token
  await reserveLiveBudget(token, 25)
  const groups = await api(token, `/api/shows/${fixtures.seriesId || 63}/groups`)
  const episode = groups[0].videos[0]
  const party = await api(token, '/api/parties', 'POST', { show_video_id: episode.id })
  await page.context().addCookies([{ name: 'app_token', value: token, url: baseURL! }])
  await page.goto(`/watch/${party.id}`)
  const video = page.locator('video')
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 45_000 })
    .toBeGreaterThanOrEqual(2)
  expect(await video.evaluate((v: HTMLVideoElement) => v.error?.message || null)).toBeNull()

  async function controls() {
    if (isMobile) {
      if (!(await page.getByTestId('player-chrome').isVisible())) await page.getByTestId('video-stage').tap()
    } else {
      const box = await video.boundingBox()
      if (!box) throw new Error('Player bounds missing')
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
    }
    await expect(page.getByTestId('player-chrome')).toBeVisible()
  }
  const play = () =>
    page
      .getByTestId(isMobile ? 'player-mobile-actions' : 'player-actions')
      .getByRole('button', { name: 'Play', exact: true })
  const pause = () =>
    page
      .getByTestId(isMobile ? 'player-mobile-actions' : 'player-actions')
      .getByRole('button', { name: 'Pause', exact: true })
  await controls()
  if (!isMobile) {
    await play().hover()
    await expect(page.getByTestId('player-tooltip')).toHaveText('Play')
  }
  await play().click()
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false)
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThan(0.5)
  await controls()
  await pause().click()
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true)

  const seeks: { current_time: number }[] = []
  page.on('request', (request) => {
    if (request.method() === 'PUT' && request.url().endsWith(`/api/parties/${party.id}/state`))
      seeks.push(request.postDataJSON())
  })
  await controls()
  if (isMobile) {
    const track = page.getByTestId('player-seeker').getByTestId('slider-track')
    const box = await track.boundingBox()
    if (!box) throw new Error('Touch seek track missing')
    await page.touchscreen.tap(box.x + box.width * 0.25, box.y + box.height / 2)
  } else {
    const slider = page.getByRole('slider', { name: 'Playback position' })
    await slider.focus()
    await slider.press('ArrowRight')
  }
  await expect.poll(() => seeks.length).toBe(1)
  await expect
    .poll(async () => Math.abs((await video.evaluate((v: HTMLVideoElement) => v.currentTime)) - seeks[0].current_time))
    .toBeLessThan(2)

  if (!isMobile) {
    await controls()
    await page.getByTestId('volume-control').hover()
    const volume = page.getByRole('slider', { name: 'Volume' })
    await volume.focus()
    await volume.press('Home')
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.volume)).toBe(0)
    await volume.press('ArrowRight')
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.volume)).toBeCloseTo(0.1, 2)
    await page
      .getByTestId('volume-control')
      .getByRole('button', { name: /^(Mute|Unmute)$/ })
      .click()
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true)
    await page
      .getByTestId('volume-control')
      .getByRole('button', { name: /^(Mute|Unmute)$/ })
      .click()
    await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(false)
  }

  const input = page.getByPlaceholder('Message')
  await input.fill(Array.from({ length: 30 }, (_, i) => `Line ${i}`).join('\n'))
  const enhanced = await input.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    scroll: element.scrollHeight,
    supported: CSS.supports('field-sizing', 'content')
  }))
  expect(enhanced.height).toBeGreaterThanOrEqual(50)
  expect(enhanced.height).toBeLessThanOrEqual(200)
  expect(enhanced.scroll).toBeGreaterThan(enhanced.height)
  const fallback = await page.addStyleTag({
    content: '[data-testid="chat-composer"] textarea { field-sizing: fixed !important; height: 50px !important; }'
  })
  expect(await input.evaluate((element) => element.getBoundingClientRect().height)).toBe(50)
  await fallback.evaluate((element) => element.remove())
  await input.fill('')

  await page.evaluate(() => document.fonts.ready)
  expect(
    await page
      .getByTestId('chat-canopy')
      .locator('i')
      .first()
      .evaluate((element) => ({
        font: getComputedStyle(element).fontFamily,
        glyph: getComputedStyle(element, '::before').content
      }))
  ).toMatchObject({ font: 'FontAwesome' })
  expect(
    await page.evaluate(() =>
      Array.from(document.fonts).some((font) => font.family === 'FontAwesome' && font.status === 'loaded')
    )
  ).toBe(true)

  await controls()
  await page.screenshot({ path: info.outputPath('watch-controls.png') })
  const fullscreenEnabled = await page.evaluate(() =>
    Boolean(
      document.fullscreenEnabled ||
      (document as Document & { webkitFullscreenEnabled?: boolean }).webkitFullscreenEnabled
    )
  )
  if (isMobile) {
    // Existing mobile UI opens installation/orientation guidance rather than
    // requesting the desktop Fullscreen API, even when the engine exposes it.
    await page.getByTestId('mobile-title-bar').getByRole('button', { name: 'Enter Fullscreen' }).tap()
    await expect(page.getByRole('dialog').getByText('How to fullscreen on mobile')).toBeVisible()
    await page.getByTestId('modal-overlay').tap({ position: { x: 5, y: 5 } })
    await expect(page.getByRole('dialog')).not.toBeVisible()
  } else if (fullscreenEnabled) {
    const fullscreenButton = () => page.getByTestId('player-actions').getByRole('button', { name: /Fullscreen$/ })
    await fullscreenButton().click()
    await expect
      .poll(() =>
        page.evaluate(() =>
          Boolean(
            document.fullscreenElement ||
            (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
          )
        )
      )
      .toBe(true)
    await controls()
    await fullscreenButton().click()
    await expect
      .poll(() =>
        page.evaluate(() =>
          Boolean(
            document.fullscreenElement ||
            (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement
          )
        )
      )
      .toBe(false)
  } else {
    info.annotations.push({
      type: 'browser-limit',
      description: 'Fullscreen API unavailable in this browser emulation; existing screenfull guard applies.'
    })
  }

  await controls()
  await play().click()
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false)
  await controls()
  async function leave(accept: boolean) {
    const handled = page.waitForEvent('dialog').then((dialog) => (accept ? dialog.accept() : dialog.dismiss()))
    await Promise.all([handled, page.getByRole('link', { name: 'Back to Browse' }).click()])
  }
  await leave(false)
  await expect(page).toHaveURL(new RegExp(`/watch/${party.id}$`))
  await controls()
  await leave(true)
  await expect(page).toHaveURL(/\/$/)
  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`/watch/${party.id}$`))
  const hasFullscreenAPI = await page.evaluate(() =>
    [
      'exitFullscreen',
      'webkitExitFullscreen',
      'webkitCancelFullScreen',
      'mozCancelFullScreen',
      'msExitFullscreen'
    ].some((key) => key in document)
  )
  await expect
    .poll(
      () =>
        page.evaluate(() =>
          Boolean(
            document.querySelector('video')?.readyState >= 2 ||
            document.body.innerText.includes('Unexpected Application Error!')
          )
        ),
      { timeout: 45_000 }
    )
    .toBe(true)
  let baselineFullscreenFailure = false
  if (await page.getByRole('heading', { name: 'Unexpected Application Error!' }).isVisible()) {
    // Original React 16/iPhone WebKit reproduction: party 39. screenfull exports
    // { enabled: false } on this browser, while the existing cleanup calls off().
    // A reload recovers the route. Do not turn this into an unrelated bug fix.
    expect(hasFullscreenAPI).toBe(false)
    await expect.poll(() => caughtErrors.some((message) => /off.*not a function/.test(message))).toBe(true)
    baselineFullscreenFailure = true
    info.annotations.push({
      type: 'baseline-defect',
      description:
        'Unsupported fullscreen cleanup can crash navigation on iPhone WebKit; original UI reproduces it. Reload recovery is verified.'
    })
    await page.reload()
  }
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState), { timeout: 45_000 })
    .toBeGreaterThanOrEqual(2)
  const observed = [...runtimeErrors, ...caughtErrors]
  if (!hasFullscreenAPI && observed.some((message) => /off.*not a function/.test(message))) {
    if (!baselineFullscreenFailure)
      info.annotations.push({
        type: 'baseline-defect',
        description:
          'Original iPhone WebKit fullscreen cleanup error occurred during navigation; route recovered on back navigation.'
      })
    baselineFullscreenFailure = true
  }
  const unexpected = baselineFullscreenFailure
    ? observed.filter(
        (message) =>
          !/off.*not a function|unsubscribe|AbortError|evaluating '[\w$.]+\.data'|err\.config\.method/.test(message)
      )
    : observed
  expect({ unexpected, apiFailures }).toEqual({ unexpected: [], apiFailures: [] })
})
