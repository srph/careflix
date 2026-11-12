import { expect, test, type Page, type WebSocketRoute } from '@playwright/test'

const artwork = (color: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450"><defs><radialGradient id="g"><stop stop-color="${color}"/><stop offset="1" stop-color="#10171e"/></radialGradient></defs><rect width="800" height="450" fill="url(#g)"/><circle cx="400" cy="420" r="240" fill="none" stroke="${color}" stroke-width="3"/></svg>`
  )
const viewer = { id: 90001, name: 'Joyce', email: 'joyce@example.test', avatar: null, is_online: true }
const senders = ['Kier', 'Mira', 'Nico'].map((name, index) => ({
  ...viewer,
  id: 90002 + index,
  name,
  pivot: { is_active: true }
}))
const shows = ['Velvet Static', 'Paper Moons', 'The Understudies'].map((title, index) => ({
  id: 91001 + index,
  title,
  title_type: index === 2 ? 'series' : 'movie',
  preview_image: artwork(['#e8368f', '#ff7a59', '#c084fc'][index]),
  synopsis: 'A movie to watch together.',
  air_start: '2025-01-01',
  movie: null
}))
const videos = shows.map((show, index) => ({
  id: 92001 + index,
  show_id: show.id,
  show_group_id: index === 2 ? 93001 : null,
  title: index === 2 ? 'Places, Please' : show.title,
  show,
  duration: index === 2 ? 2640 : 7440,
  video_url: `https://media.example.test/room-${index}.mp4`,
  preview_image: show.preview_image,
  subtitle_url: null,
  group: index === 2 ? { id: 93001, title: 'Season 1' } : null
}))
const parties = videos.map((video, index) => ({
  id: 94001 + index,
  show_video_id: video.id,
  video,
  current_time: [2472, 750, 555][index],
  is_playing: false,
  members: [senders[index]],
  invitations: [],
  last_activity_at: new Date().toISOString()
}))
function invite(index: number, expiresAt = new Date(Date.now() + 30 * 60_000).toISOString()) {
  return {
    id: 95001 + index,
    party_id: parties[index].id,
    party: parties[index],
    sender: senders[index],
    recipient: viewer,
    action: 'pending',
    expires_at: expiresAt
  }
}

async function setup(page: Page, invitations = [invite(0), invite(1), invite(2)]) {
  await page
    .context()
    .addCookies([{ name: 'app_token', value: 'invitation-fixture', url: test.info().project.use.baseURL as string }])
  const subscriptions = new Set<string>()
  let connection: WebSocketRoute
  await page.routeWebSocket(/pusher/, (socket) => {
    connection = socket
    socket.send(
      JSON.stringify({
        event: 'pusher:connection_established',
        data: JSON.stringify({ socket_id: '123.456', activity_timeout: 120 })
      })
    )
    socket.onMessage((message) => {
      const payload = JSON.parse(String(message))
      if (payload.event === 'pusher:subscribe') {
        subscriptions.add(payload.data.channel)
        socket.send(
          JSON.stringify({
            event: 'pusher_internal:subscription_succeeded',
            channel: payload.data.channel,
            data: JSON.stringify({ presence: { ids: [], hash: {}, count: 0 } })
          })
        )
      }
      if (payload.event === 'pusher:unsubscribe') subscriptions.delete(payload.data.channel)
    })
  })
  await page.route('**/broadcasting/auth', (route) =>
    route.fulfill({ json: { auth: 'fixture:signature', channel_data: JSON.stringify({ user_id: viewer.id }) } })
  )
  await page.route('https://media.example.test/**', (route) => route.fulfill({ status: 404, body: '' }))
  await page.route('**/api/**', async (route) => {
    const path = new URL(route.request().url()).pathname
    let body: unknown = {}
    if (path === '/api/me') body = { ...viewer, invitations }
    if (path === '/api/shows') body = { data: shows, current_page: 1, last_page: 1 }
    if (path === '/api/me/parties') body = { data: [], current_page: 1, last_page: 1 }
    if (path.endsWith('/groups'))
      body = [{ id: 93001, title: 'Season 1', videos: [videos[0], videos[2], { ...videos[2], id: 92009 }] }]
    if (/\/parties\/\d+$/.test(path)) body = parties.find((party) => path.endsWith(String(party.id)))
    if (path.endsWith('/logs')) body = []
    if (/\/invitations(?:\/search)?$/.test(path)) body = []
    if (path.endsWith('/accept')) {
      const accepted = invitations.find((invitation) => path.includes(String(invitation.id)))
      body = {
        ...accepted?.party,
        declined_invitation_ids: invitations
          .filter(
            (invitation) =>
              invitation.id !== accepted?.id &&
              invitation.action === 'pending' &&
              new Date(invitation.expires_at).getTime() > Date.now()
          )
          .map((invitation) => invitation.id)
      }
    }
    await route.fulfill({ json: body })
  })
  const emit = (event: string, invitation: unknown) =>
    connection.send(
      JSON.stringify({ event, channel: `private-user.${viewer.id}`, data: JSON.stringify({ invitation }) })
    )
  return { emit, subscriptions }
}

async function open(page: Page) {
  await page.getByRole('button', { name: 'Respond', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toBeVisible()
}
const dialog = (page: Page) => page.getByRole('dialog', { name: 'Watch invitation' })

test('pill opens, advances without collapsing, and shows episode segments', async ({ page }) => {
  await setup(page)
  await page.goto('/')
  await expect(dialog(page)).toContainText('Kier invited you to watch Velvet Static')
  await expect(dialog(page).getByTestId('invitation-beam')).toHaveCSS('opacity', '1')
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toHaveCount(0)
  await page.screenshot({ path: test.info().outputPath('invitation-pill.png') })
  await open(page)
  await expect(dialog(page).getByTestId('invitation-count')).toHaveText('1 of 3')
  await expect(page.getByRole('button', { name: 'Collapse invitation' })).toBeFocused()
  await expect(dialog(page).getByTestId('invitation-beam')).toHaveCSS('opacity', '0')
  await expect(dialog(page).getByRole('img', { name: /Room snapshot: 41:12/ })).toBeVisible()
  await page.screenshot({ path: test.info().outputPath('invitation-expanded.png') })
  await page.getByRole('button', { name: 'Decline', exact: true }).click()
  await expect(dialog(page).getByRole('heading', { name: 'Paper Moons' })).toBeVisible()
  await expect(dialog(page).getByTestId('invitation-count')).toHaveText('2 of 3')
  await expect(page.getByRole('button', { name: 'Respond', exact: true })).toHaveCount(0)
  await expect(dialog(page).getByTestId('invitation-beam')).toHaveCSS('opacity', '0')
  await expect(page.getByRole('button', { name: 'Collapse invitation' })).toBeFocused()
  await expect(dialog(page).getByTestId('invitation-body')).toHaveCSS('opacity', '1')
  await expect(dialog(page).getByTestId('invitation-content')).toHaveCSS('transform', 'none')
  await page.screenshot({ path: test.info().outputPath('invitation-next.png') })
  await page.getByRole('button', { name: 'Decline', exact: true }).click()
  await expect(dialog(page).getByRole('heading', { name: 'The Understudies' })).toBeVisible()
  await expect(dialog(page).getByTestId('invitation-segments').locator('span')).toHaveCount(3)
  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Respond', exact: true })).toBeFocused()
  await expect(dialog(page).getByTestId('invitation-card')).toHaveAttribute('data-expanded', 'false')
  await open(page)
  await page.getByRole('button', { name: 'Decline', exact: true }).click()
  await expect(dialog(page)).toContainText('Declined Nico’s invitation to watch The Understudies')
  await expect(dialog(page).getByTestId('invitation-card')).toHaveAttribute('data-expanded', 'false')
  await expect(dialog(page)).not.toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('expiration stays visible, Dismiss skips stale invites, and cancellation updates immediately', async ({
  page
}) => {
  await page.clock.install()
  const { emit, subscriptions } = await setup(page, [
    invite(0, new Date(Date.now() + 5000).toISOString()),
    invite(1, new Date(Date.now() - 1000).toISOString()),
    invite(2)
  ])
  await page.goto('/')
  await expect.poll(() => subscriptions.has(`private-user.${viewer.id}`)).toBe(true)
  await open(page)
  await page.clock.fastForward(6000)
  await expect(dialog(page)).toContainText('Kier’s invitation expired')
  await expect(dialog(page).getByRole('heading', { name: 'Velvet Static' })).toHaveCSS(
    'color',
    'oklch(0.868 0.007 39.5)'
  )
  await expect(dialog(page).getByTestId('invitation-meta')).toHaveText('Kier’s invitation expired')
  await expect(dialog(page).getByTestId('invitation-meta')).toHaveCSS('color', 'oklch(0.879 0.169 91.605)')
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: /re-invite/i })).toHaveCount(0)
  await page.getByRole('button', { name: 'Dismiss', exact: true }).click()
  await expect(dialog(page).getByRole('heading', { name: 'The Understudies' })).toBeVisible()
  emit('invitation.cancelled', { ...invite(2), action: 'cancelled' })
  await expect(dialog(page)).toContainText('Nico cancelled the invitation')
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Dismiss', exact: true }).click()
  await expect(dialog(page)).not.toBeVisible()
})

test('a failed decline retries quietly, and the declined invite stays gone while it does', async ({ page }) => {
  const { emit, subscriptions } = await setup(page, [invite(0)])
  let attempts = 0
  let release: () => void
  const held = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/api/invitations/*/decline', async (route) => {
    attempts++
    if (attempts === 1) await route.fulfill({ status: 500, json: {} })
    else {
      await held
      await route.fulfill({ json: {} })
    }
  })
  await page.goto('/')
  await expect.poll(() => subscriptions.has(`private-user.${viewer.id}`)).toBe(true)
  await open(page)
  await page.getByRole('button', { name: 'Decline', exact: true }).click()
  // Optimistic: the invite is declined on screen at once, and the failed request never shows.
  await expect(dialog(page)).toContainText('Declined Kier’s invitation to watch Velvet Static')
  await expect(dialog(page).getByRole('alert')).toHaveCount(0)
  await expect.poll(() => attempts).toBe(2)
  // The retry is still in flight: a re-sent copy of the declined invite stays gone,
  // a duplicate new invite shows once, and an unknown cancellation changes nothing.
  emit('invitation.received', invite(0))
  emit('invitation.received', invite(1))
  emit('invitation.received', invite(1))
  emit('invitation.cancelled', { id: 999999 })
  await expect(dialog(page)).toContainText('Mira invited you to watch Paper Moons')
  await expect(dialog(page)).not.toContainText('Velvet Static')
  release!()
  await open(page)
  await expect(dialog(page).getByRole('heading', { name: 'Paper Moons' })).toBeVisible()
  await expect(dialog(page).getByTestId('invitation-count')).toHaveCount(0)
  expect(attempts).toBe(2)
})

test('the last decline shows its confirmation pill right away, then dismisses', async ({ page }) => {
  await setup(page, [invite(0)])
  let release: () => void
  const held = new Promise<void>((resolve) => {
    release = resolve
  })
  await page.route('**/api/invitations/*/decline', async (route) => {
    await held
    await route.fulfill({ json: {} })
  })
  await page.goto('/')
  await open(page)
  await page.getByRole('button', { name: 'Decline', exact: true }).click()
  // The request is still held, but the decline doesn't wait for it.
  await expect(dialog(page)).toContainText('Declined Kier’s invitation to watch Velvet Static')
  await expect
    .poll(async () => (await dialog(page).getByTestId('invitation-card').boundingBox()).height)
    .toBeCloseTo(40, 0)
  await expect(page.getByRole('button', { name: 'Respond', exact: true })).toHaveCount(0)
  await page.screenshot({ path: test.info().outputPath('invitation-declined.png') })
  await expect(dialog(page)).not.toBeVisible()
  release!()
})

test('accepting with multiple invitations clears the declined queue, docks, and fades upward', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  const { subscriptions } = await setup(page, [invite(1), invite(2)])
  await page.goto(`/watch/${parties[0].id}`)
  await expect(page.locator('video')).toHaveAttribute('src', videos[0].video_url)
  await expect.poll(() => subscriptions.has(`private-party.${parties[0].id}`)).toBe(true)
  await open(page)
  const stateRequests: string[] = []
  page.on('request', (request) => {
    if (request.url().endsWith('/state')) stateRequests.push(request.url())
  })
  await page.getByRole('button', { name: 'Accept', exact: true }).focus()
  await page.keyboard.press('Space')
  await expect(page).toHaveURL(new RegExp(`/watch/${parties[1].id}$`))
  await expect(page.locator('video')).toHaveAttribute('src', videos[1].video_url)
  await expect.poll(() => subscriptions.has(`private-party.${parties[1].id}`)).toBe(true)
  await expect.poll(() => subscriptions.has(`private-party.${parties[0].id}`)).toBe(false)
  await expect(dialog(page)).toContainText('You’re in with Mira')
  await expect(dialog(page).getByTestId('invitation-card')).toHaveAttribute('data-docked', 'true')
  const joinedLine = dialog(page).getByTestId('invitation-card').getByTestId('invitation-line')
  await expect(joinedLine.getByText('You’re in with Mira')).toBeVisible()
  await expect
    .poll(async () => {
      const pill = await dialog(page).boundingBox()
      const player = await page.getByTestId('video-pane').boundingBox()
      return Math.abs(pill.y - player.y - 20)
    })
    .toBeLessThan(2)
  const joinedBounds = await joinedLine.boundingBox()
  const cardBounds = await dialog(page).getByTestId('invitation-card').boundingBox()
  expect(joinedBounds.y).toBeGreaterThanOrEqual(cardBounds.y)
  expect(joinedBounds.y + joinedBounds.height).toBeLessThanOrEqual(cardBounds.y + cardBounds.height + 1)
  const leaving = page.evaluate(
    () =>
      new Promise<{ opacity: number; y: number; elapsed: number }[]>((resolve) => {
        const popup = document.querySelector<HTMLElement>('[data-testid="invitation-popup"]')!
        const frames = []
        const observer = new MutationObserver(() => {
          if (!popup.hasAttribute('data-ending-style')) return
          observer.disconnect()
          const started = performance.now()
          const top = popup.getBoundingClientRect().top
          const record = () => {
            if (!popup.isConnected) {
              resolve(frames)
              return
            }
            frames.push({
              opacity: Number(getComputedStyle(popup).opacity),
              y: popup.getBoundingClientRect().top - top,
              elapsed: performance.now() - started
            })
            if (performance.now() - started < 550) requestAnimationFrame(record)
            else resolve(frames)
          }
          record()
        })
        observer.observe(popup, { attributes: true, attributeFilter: ['data-ending-style'] })
      })
  )
  await page.screenshot({ path: test.info().outputPath('invitation-docked.png') })
  const exitFrames = await leaving
  expect(exitFrames.some((frame) => frame.opacity > 0 && frame.opacity < 1 && frame.y < -1)).toBe(true)
  expect(exitFrames.some((frame) => frame.elapsed > 300 && frame.opacity < 0.3)).toBe(true)
  await expect(dialog(page)).not.toBeVisible({ timeout: 7000 })
  await expect(page.getByRole('button', { name: 'Respond', exact: true })).toHaveCount(0)
  expect(stateRequests).toHaveLength(0)
  expect(errors).toEqual([])
})

test('reduced motion retains queue behavior and disables beam animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await setup(page)
  await page.goto('/')
  await expect(dialog(page).getByTestId('invitation-beam')).toHaveCSS('animation-name', 'none')
  await open(page)
  await page.getByRole('button', { name: 'Decline', exact: true }).click()
  await expect(dialog(page).getByRole('heading', { name: 'Paper Moons' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

test('expand and collapse animate height, width, and corners without scaling the contents', async ({ page }) => {
  const short = invite(0)
  short.party = { ...short.party, video: { ...short.party.video, show: { ...short.party.video.show, title: 'X' } } }
  await setup(page, [short])
  await page.goto('/')
  const card = dialog(page).getByTestId('invitation-card')
  await expect(dialog(page).getByTestId('invitation-beam')).toHaveCSS('opacity', '1')
  const collapsedHeight = (await card.boundingBox()).height
  const collapsedWidth = (await card.boundingBox()).width

  const sample = (expanded: boolean) =>
    page.evaluate(
      (isExpanded) =>
        new Promise<
          { height: number; width: number; radius: number; scaleX: number; scaleY: number; avatarHeight: number }[]
        >((resolve) => {
          const card = document.querySelector<HTMLElement>('[data-testid="invitation-card"]')!
          const observer = new MutationObserver(() => {
            if ((card.dataset.expanded === 'true') !== isExpanded) return
            observer.disconnect()
            const frames = []
            const started = performance.now()
            const record = () => {
              const avatar = card.querySelector<HTMLElement>(
                '[data-testid="invitation-line"] > [data-testid="avatar"]'
              )!
              const transform = getComputedStyle(card).transform
              const matrix = transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(transform)
              frames.push({
                height: card.getBoundingClientRect().height,
                width: card.getBoundingClientRect().width,
                radius: parseFloat(getComputedStyle(card).borderTopLeftRadius),
                scaleX: matrix.a,
                scaleY: matrix.d,
                avatarHeight: avatar.getBoundingClientRect().height
              })
              if (performance.now() - started < 650) requestAnimationFrame(record)
              else resolve(frames)
            }
            record()
          })
          observer.observe(card, { attributes: true, attributeFilter: ['data-expanded'] })
        }),
      expanded
    )

  const expanding = sample(true)
  await open(page)
  const expandedFrames = await expanding
  const expandedHeight = (await card.boundingBox()).height
  const expandedWidth = (await card.boundingBox()).width
  expect(expandedHeight).toBeGreaterThan(collapsedHeight + 100)
  expect(expandedFrames.some((frame) => frame.height > collapsedHeight + 2 && frame.height < expandedHeight - 2)).toBe(
    true
  )
  expect(expandedFrames.some((frame) => frame.width > collapsedWidth + 2 && frame.width < expandedWidth - 2)).toBe(true)
  expect(expandedFrames.some((frame) => frame.radius > 16.1 && frame.radius < 19.9)).toBe(true)

  const collapsing = sample(false)
  await page.getByRole('button', { name: 'Collapse invitation' }).click()
  const collapsedFrames = await collapsing
  await expect.poll(async () => (await card.boundingBox()).height).toBeCloseTo(collapsedHeight, 0)
  expect(collapsedFrames.some((frame) => frame.height > collapsedHeight + 2 && frame.height < expandedHeight - 2)).toBe(
    true
  )
  expect(collapsedFrames.some((frame) => frame.width > collapsedWidth + 2 && frame.width < expandedWidth - 2)).toBe(
    true
  )
  expect(collapsedFrames.some((frame) => frame.radius > 16.1 && frame.radius < 19.9)).toBe(true)

  for (const frame of [...expandedFrames, ...collapsedFrames]) {
    expect(frame.scaleX).toBeCloseTo(1, 3)
    expect(frame.scaleY).toBeCloseTo(1, 3)
    expect(frame.avatarHeight).toBeCloseTo(24, 0)
  }

  await page.setViewportSize({ width: 390, height: 320 })
  await open(page)
  await page.getByRole('button', { name: 'Accept', exact: true }).scrollIntoViewIfNeeded()
  await expect(card.getByTestId('invitation-line')).toBeInViewport()
  await expect(page.getByRole('button', { name: 'Accept', exact: true })).toBeInViewport()
  const bounds = await card.boundingBox()
  expect(bounds.y).toBeGreaterThanOrEqual(0)
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(320)
})

test('opening fades the preview after a delay while the next invite slides in separately', async ({ page }) => {
  await setup(page)
  await page.goto('/')
  await expect(dialog(page).getByTestId('invitation-beam')).toHaveCSS('opacity', '1')

  const sample = (transition: 'open' | 'next') =>
    page.evaluate(
      (kind) =>
        new Promise<{ elapsed: number; bodyOpacity: number; contentOpacity: number; x: number }[]>((resolve) => {
          const card = document.querySelector<HTMLElement>('[data-testid="invitation-card"]')!
          const body = card.querySelector<HTMLElement>('[data-testid="invitation-body"]')!
          const previous = body.firstElementChild
          const frames = []
          const observer = new MutationObserver(() => {
            if (kind === 'open' ? card.dataset.expanded !== 'true' : body.firstElementChild === previous) return
            observer.disconnect()
            const started = performance.now()
            const record = () => {
              const content = body.firstElementChild as HTMLElement
              const transform = getComputedStyle(content).transform
              const matrix = transform === 'none' ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(transform)
              frames.push({
                elapsed: performance.now() - started,
                bodyOpacity: Number(getComputedStyle(body).opacity),
                contentOpacity: Number(getComputedStyle(content).opacity),
                x: matrix.e
              })
              if (performance.now() - started < 650) requestAnimationFrame(record)
              else resolve(frames)
            }
            record()
          })
          observer.observe(
            kind === 'open' ? card : body,
            kind === 'open' ? { attributes: true, attributeFilter: ['data-expanded'] } : { childList: true }
          )
        }),
      transition
    )

  // Both first opening and reopening use the delayed fade, without a slide.
  for (let attempt = 0; attempt < 2; attempt++) {
    const recording = sample('open')
    await open(page)
    const frames = await recording
    const early = frames.filter((frame) => frame.elapsed < 150)
    expect(early.length).toBeGreaterThan(0)
    expect(early.every((frame) => frame.bodyOpacity < 0.01)).toBe(true)
    expect(
      frames.some(
        (frame) => frame.elapsed > 200 && frame.elapsed < 500 && frame.bodyOpacity > 0.05 && frame.bodyOpacity < 0.95
      )
    ).toBe(true)
    expect(frames.at(-1).bodyOpacity).toBeCloseTo(1, 2)
    expect(frames.every((frame) => Math.abs(frame.x) < 0.01 && frame.contentOpacity === 1)).toBe(true)
    if (attempt === 0) {
      await page.getByRole('button', { name: 'Collapse invitation' }).click()
      await expect(dialog(page).getByTestId('invitation-body')).toHaveCSS('opacity', '0')
    }
  }

  const recording = sample('next')
  await page.getByRole('button', { name: 'Decline', exact: true }).click()
  const frames = await recording
  expect(frames.every((frame) => frame.bodyOpacity === 1)).toBe(true)
  expect(frames.some((frame) => frame.x > 1 && frame.contentOpacity < 1)).toBe(true)
  expect(frames.at(-1).x).toBeCloseTo(0, 2)
  expect(frames.at(-1).contentOpacity).toBeCloseTo(1, 2)
  await expect(dialog(page).getByRole('heading', { name: 'Paper Moons' })).toBeVisible()
})
