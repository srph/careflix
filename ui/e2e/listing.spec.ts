import { expect, test, type Page } from '@playwright/test'

// HTTP fixtures exercise the page independently of local accounts and Pusher.
const art = (color: string) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><defs><linearGradient id="a" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#0b1020"/></linearGradient></defs><path fill="url(#a)" d="M0 0h960v540H0z"/><circle cx="700" cy="180" r="100" fill="#ffffff12"/><path d="M0 440 400 160 960 500v40H0z" fill="#060a1233"/></svg>`)
const titles = ['Velvet Static', 'Hollow County', 'Paper Moons', 'Orbit Diner', 'Night Ferry', 'The Understudies', 'The Long Lunch', 'Signal & Noise']
const shows = titles.map((title, index) => ({
  id: index + 1, title, title_type: index % 2 ? 'series' : 'movie', preview_image: art(['#7a1f4d', '#24442a', '#60304c', '#7d532b'][index % 4]),
  synopsis: ['A late-night radio host starts hearing tomorrow’s callers tonight.', 'A small-town clerk keeps finding the same name in every cold case.', 'Two sisters keep their late father’s lantern shop open for one last festival.'][index % 3],
  air_start: '2025-01-01 00:00:00', age_rating: 'R', groups_count: 3,
  movie: index % 2 ? null : { id: 100 + index, duration: 7440 },
}))
const user = { id: 90001, name: 'Kier', email: 'listing@example.test', avatar: null, invitations: [], is_online: true }
const parties = [shows[1], shows[3], shows[0], shows[6]].map((show, index) => ({
  id: 200 + index, video: { id: 500 + index, show, title: 'The Ledger', group: { id: 1, title: 'Season 2' }, preview_image: null, duration: 7440, video_url: '', subtitle_url: null },
  members: [{ ...user, pivot: { is_active: false } }, { id: 90002, name: 'Joyce', avatar: null, pivot: { is_active: index < 2 } }],
  is_playing: index === 0, current_time: 1520, last_activity_at: '2026-11-02T18:00:00+08:00', invitations: [],
}))

async function catalog(page: Page, options: { failOnce?: boolean; empty?: boolean } = {}) {
  await page.context().addCookies([{ name: 'app_token', value: 'listing-test-token', url: test.info().project.use.baseURL as string }])
  await page.routeWebSocket(/pusher/, socket => socket.close())
  let failed = false
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url())
    const path = url.pathname
    let body: unknown = {}
    if (path === '/api/me') body = user
    if (path === '/api/shows' || path === '/api/me/parties') {
      if (options.failOnce && !failed && path === '/api/shows') {
        failed = true
        return route.fulfill({ status: 422, json: { message: 'Fixture unavailable' } })
      }
      const q = (url.searchParams.get('q') || '').toLowerCase()
      const type = url.searchParams.get('title_type')
      const source = options.empty ? [] : path === '/api/shows'
        ? shows.filter(show => (!type || show.title_type === type) && show.title.toLowerCase().includes(q))
        : parties.filter(party => party.video.show.title.toLowerCase().includes(q))
      const perPage = Number(url.searchParams.get('per_page') || 6)
      const current = Number(url.searchParams.get('page') || 1)
      body = { data: source.slice((current - 1) * perPage, current * perPage), total: source.length, current_page: current, last_page: Math.max(1, Math.ceil(source.length / perPage)) }
    }
    if (/\/api\/shows\/\d+\/groups/.test(path)) body = [{ id: 1, title: 'Season 1', videos: [{ id: 701, title: 'The first episode', duration: 1800 }] }]
    if (/\/api\/parties\/\d+$/.test(path)) body = parties[0]
    await route.fulfill({ json: body })
  })
}

test('listing matches the chosen structure and filters with cached tab results', async ({ page, isMobile }) => {
  await catalog(page)
  const requests: string[] = []
  page.on('request', request => { if (new URL(request.url()).pathname === '/api/shows') requests.push(request.url()) })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'All titles', exact: true })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Recent parties' }).locator('.listing-party-card')).toHaveCount(3)
  await expect(page.getByRole('list', { name: 'Choose a featured title' }).getByRole('button')).toHaveCount(5)
  await expect(page.getByRole('tab', { name: 'All', exact: true })).toHaveAttribute('aria-selected', 'true')
  await page.getByRole('tab', { name: 'Movies', exact: true }).click()
  await expect(page.locator('.listing-show-card')).toHaveCount(4)
  await expect(page.getByRole('heading', { name: 'Movies', exact: true })).toBeVisible()
  await page.getByRole('tab', { name: 'Series', exact: true }).click()
  await expect(page.locator('.listing-show-card')).toHaveCount(4)
  await page.getByRole('tab', { name: 'All', exact: true }).click()
  await expect(page.locator('.listing-show-card')).toHaveCount(6)
  expect(requests.filter(url => !new URL(url).searchParams.has('title_type'))).toHaveLength(1)
  await expect(page.locator('body')).not.toContainText(' · R')
  if (!isMobile) {
    const cards = page.locator('.listing-party-card')
    await cards.first().hover()
    await expect(cards.first()).toHaveCSS('transform', /matrix\(1\.1,/)
    await expect(cards.nth(1)).not.toHaveCSS('transform', 'none')
  }
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  if (!isMobile) await page.mouse.move(0, 0)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0)
  await page.screenshot({ path: test.info().outputPath('listing.png'), fullPage: true })
})

test('search groups titles and parties and opens details with the keyboard', async ({ page }) => {
  await catalog(page)
  await page.goto('/')
  const input = page.getByRole('combobox', { name: 'Search titles and parties' })
  await page.getByRole('tab', { name: 'All', exact: true }).focus()
  await page.keyboard.press('/')
  await expect(input).toBeFocused()
  await expect(page.getByRole('listbox')).toContainText('Jump back in')
  await input.fill('Hollow')
  await expect(page.getByRole('option')).toHaveCount(2)
  await expect(page.getByRole('listbox')).toContainText('Titles')
  await expect(page.getByRole('listbox')).toContainText('Parties')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByRole('dialog').getByText('The first episode', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await input.fill('no-such-title')
  await expect(page.getByRole('status')).toContainText('No matches')
  await input.press('Escape')
  await expect(page.getByRole('listbox')).not.toBeVisible()
})

test('recent parties leads to history and rejoining enters the existing room', async ({ page }) => {
  await catalog(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'See all parties' }).click()
  await expect(page.getByRole('heading', { name: 'All parties', exact: true })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Parties' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.listing-party-card')).toHaveCount(4)
  await page.getByRole('link', { name: 'Rejoin Hollow County', exact: true }).click()
  await expect(page).toHaveURL(/\/watch\/200$/)
})

test('pagination appends titles without replacing the first page', async ({ page }) => {
  await catalog(page)
  await page.goto('/')
  await expect(page.locator('.listing-show-card')).toHaveCount(6)
  await page.locator('.listing-show-card').last().scrollIntoViewIfNeeded()
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await expect(page.locator('.listing-show-card')).toHaveCount(8)
  await expect(page.getByRole('button', { name: 'Details for Velvet Static', exact: true })).toBeVisible()
})

test('catalog errors can be retried and empty collections are explained', async ({ page }) => {
  await catalog(page, { failOnce: true })
  await page.goto('/')
  await expect(page.getByRole('alert')).toContainText('Unable to load titles')
  await page.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(page.locator('.listing-show-card')).toHaveCount(6)
  await page.unroute('**/api/**')
  await catalog(page, { empty: true })
  await page.reload()
  await expect(page.getByText('No titles available yet.')).toBeVisible()
  await page.getByRole('tab', { name: 'Parties', exact: true }).click()
  await expect(page.getByText('Your parties will appear here. Pick a title to start watching together.')).toBeVisible()
})

test('movie and series actions create a party with the selected video', async ({ page }) => {
  await catalog(page)
  const videos: number[] = []
  await page.route('**/api/parties', async route => {
    videos.push(route.request().postDataJSON().show_video_id)
    await route.fulfill({ json: { ...parties[0], id: 222 } })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Pause slideshow' }).click()
  await page.getByRole('button', { name: 'Start a party', exact: true }).click()
  await expect(page).toHaveURL(/\/watch\/222$/)
  expect(videos).toEqual([100])
  await page.goto('/')
  await page.getByRole('button', { name: 'Details for Hollow County', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: /The first episode/ }).click()
  await expect(page).toHaveURL(/\/watch\/222$/)
  expect(videos).toEqual([100, 701])
})
