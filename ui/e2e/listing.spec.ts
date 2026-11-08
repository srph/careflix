import { expect, test, type Page } from '@playwright/test'

// HTTP fixtures exercise the page independently of local accounts and Pusher.
const art = (color: string) => 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540"><defs><linearGradient id="a" x2="1" y2="1"><stop stop-color="${color}"/><stop offset="1" stop-color="#0b1020"/></linearGradient></defs><path fill="url(#a)" d="M0 0h960v540H0z"/><circle cx="700" cy="180" r="100" fill="#ffffff12"/><path d="M0 440 400 160 960 500v40H0z" fill="#060a1233"/></svg>`)
const titles = ['Velvet Static', 'Hollow County', 'Paper Moons', 'Orbit Diner', 'Night Ferry', 'The Understudies', 'The Long Lunch', 'Signal & Noise']
const shows = titles.map((title, index) => ({
  id: index + 1, title, title_type: index % 2 ? 'series' : 'movie', preview_image: art(['#7a1f4d', '#24442a', '#60304c', '#7d532b'][index % 4]),
  synopsis: ['A late-night radio host starts hearing tomorrow’s callers tonight.', 'A small-town clerk keeps finding the same name in every cold case.', 'Two sisters keep their late father’s lantern shop open for one last festival.'][index % 3],
  air_start: '2025-01-01 00:00:00', air_end: index % 2 ? '2026-01-01 00:00:00' : null, language: 'English', age_rating: 'R', groups_count: 2,
  movie: index % 2 ? null : { id: 100 + index, duration: 7440 },
}))
const user = { id: 90001, name: 'Kier', email: 'listing@example.test', avatar: null, invitations: [], is_online: true }
const parties = [shows[1], shows[3], shows[0], shows[6]].map((show, index) => ({
  id: 200 + index, video: { id: 500 + index, show, title: 'The Ledger', group: { id: 1, title: 'Season 2' }, preview_image: null, duration: 7440, video_url: '', subtitle_url: null },
  members: [{ ...user, pivot: { is_active: false } }, { id: 90002, name: 'Joyce', avatar: null, pivot: { is_active: index < 2 } }],
  is_playing: index === 0, current_time: 1520, last_activity_at: '2026-11-02T18:00:00+08:00', invitations: [],
}))

async function catalog(page: Page, options: { failOnce?: boolean; empty?: boolean; pageSize?: number } = {}) {
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
        : parties.filter(party => party.video.show.title.toLowerCase().includes(q) && (!url.searchParams.has('show_id') || party.video.show.id === Number(url.searchParams.get('show_id'))))
      const perPage = Number(url.searchParams.get('per_page') || options.pageSize || 6)
      const current = Number(url.searchParams.get('page') || 1)
      body = { data: source.slice((current - 1) * perPage, current * perPage), total: source.length, current_page: current, last_page: Math.max(1, Math.ceil(source.length / perPage)) }
    }
    if (/\/api\/shows\/\d+\/groups/.test(path)) body = [
      { id: 1, title: 'Season 1', videos: [
        { id: 701, title: 'The first episode', synopsis: 'A name in the records leads Joyce to an unexpected visitor.', duration: 1800 },
        { id: 702, title: 'The visitor book', synopsis: 'The night shift runs long, and a stranger signs the visitor book twice.', duration: 2400, preview_image: art('#343864') },
        { id: 703, title: 'Three years late', synopsis: 'A letter arrives with an answer nobody was looking for.', duration: 2100 },
      ] },
      { id: 2, title: 'Season 2', videos: [{ id: 801, title: 'A new beginning', duration: 2700 }] },
    ]
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

test('search skeletons match result rows and remain decorative while requests are pending', async ({ page }) => {
  await catalog(page)
  let releaseSearch: () => void
  const searchReady = new Promise<void>(resolve => { releaseSearch = resolve })
  const searchRequests: string[] = []
  await page.route('**/api/**', async route => {
    if (new URL(route.request().url()).searchParams.has('q')) {
      searchRequests.push(route.request().url())
      await searchReady
    }
    await route.fallback()
  })
  await page.goto('/')
  await expect(page.locator('.listing-show-card')).toHaveCount(6)
  const input = page.getByRole('combobox', { name: 'Search titles and parties' })
  await input.fill('Hollow')
  const dropdown = page.locator('.listing-search-dropdown')
  const loading = dropdown.locator('.listing-search-loading')
  await expect(loading).toBeVisible()
  await expect(dropdown.getByRole('status')).toHaveText('Searching titles and parties…')
  await expect(page.getByRole('listbox')).toHaveAttribute('aria-busy', 'true')
  await expect(page.getByRole('option')).toHaveCount(0)
  await expect.poll(() => searchRequests.length).toBe(2)
  const thumbnail = loading.locator('.listing-search-skeleton-artwork').first()
  await expect(thumbnail).toHaveCSS('width', '72px')
  await expect(thumbnail).toHaveCSS('height', '40px')
  await expect(thumbnail).toHaveCSS('animation-name', 'ui-skeleton-pulse')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(input).not.toHaveAttribute('aria-activedescendant')
  await expect(page.getByRole('dialog')).not.toBeVisible()
  await expect(page).toHaveURL(/\/$/)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(thumbnail).toHaveCSS('animation-name', 'none')
  await page.screenshot({ path: test.info().outputPath('search-loading.png') })
  releaseSearch()
  await expect(loading).not.toBeVisible()
  await expect(page.getByRole('listbox')).toHaveAttribute('aria-busy', 'false')
  await expect(page.getByRole('option')).toHaveCount(2)
  const artwork = dropdown.locator('.listing-search-option .listing-artwork').first()
  await expect(artwork).toHaveCSS('width', '72px')
  await expect(artwork).toHaveCSS('height', '40px')
  await input.press('ArrowDown')
  await input.press('Enter')
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('recent parties leads to history and rejoining enters the existing room', async ({ page }) => {
  await catalog(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'See all parties' }).click()
  await expect(page.getByRole('heading', { name: 'All parties', exact: true })).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Parties' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.locator('.listing-party-card')).toHaveCount(4)
  await expect(page.getByRole('region', { name: 'Featured', exact: true })).toHaveCount(0)
  await page.screenshot({ path: test.info().outputPath('listing-parties.png'), fullPage: true })
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
  await expect(page.getByRole('alert')).toContainText("Titles didn't load")
  await page.getByRole('button', { name: 'Try again', exact: true }).click()
  await expect(page.locator('.listing-show-card')).toHaveCount(6)
  await page.unroute('**/api/**')
  await catalog(page, { empty: true })
  await page.reload()
  await expect(page.getByText('No titles available yet.')).toBeVisible()
  await page.getByRole('tab', { name: 'Parties', exact: true }).click()
  await expect(page.getByText('Your parties will appear here. Pick a title to start watching together.')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Featured', exact: true })).toHaveCount(0)
})

test('listing skeletons load independently and an empty recent section collapses away', async ({ page }) => {
  await catalog(page)
  let releaseTitles = () => {}
  let releaseParties = () => {}
  const titlesReady = new Promise<void>(resolve => { releaseTitles = resolve })
  const partiesReady = new Promise<void>(resolve => { releaseParties = resolve })
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname
    if (path === '/api/shows') await titlesReady
    if (path === '/api/me/parties') {
      await partiesReady
      return route.fulfill({ json: { data: [], total: 0, current_page: 1, last_page: 1 } })
    }
    await route.fallback()
  })
  await page.goto('/')
  const featured = page.getByRole('region', { name: 'Featured', exact: true })
  const recent = page.getByRole('region', { name: 'Recent parties' })
  await expect(featured).toHaveAttribute('aria-busy', 'true')
  await expect(featured.locator('.listing-skeleton-featured-item')).toHaveCount(5)
  await expect(recent.locator('.listing-party-skeleton')).toHaveCount(3)
  await expect(recent.getByRole('heading')).toHaveText('Recent parties')
  await expect(page.locator('.listing-section-heading > span')).toHaveCount(0)
  await expect(page.locator('.listing-show-skeleton')).toHaveCount(5)
  const skeleton = featured.locator('.ui-skeleton').first()
  await expect(skeleton).toHaveAttribute('aria-hidden', 'true')
  await expect(skeleton).toHaveCSS('animation-name', 'listing-skeleton-sweep')
  await expect(featured.getByRole('button')).toHaveCount(0)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: test.info().outputPath('listing-pending.png'), fullPage: true })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await expect(skeleton).toHaveCSS('animation-name', 'none')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.getByRole('heading', { name: 'All titles', exact: true }).scrollIntoViewIfNeeded()
  await page.screenshot({ path: test.info().outputPath('listing-pending-titles.png') })
  await page.evaluate(() => window.scrollTo(0, 0))
  releaseTitles()
  await expect(page.locator('.listing-show-card')).toHaveCount(6)
  await expect(recent).toHaveAttribute('aria-busy', 'true')
  releaseParties()
  await expect(recent).toHaveCount(0)
  await expect(page.locator('.listing-recent-parties')).toHaveCount(0)
  await expect(page.getByText('Your parties will appear here.', { exact: false })).toHaveCount(0)
  await expect(page.locator('.listing-show-card')).toHaveCount(6)
  await page.getByRole('tab', { name: 'Parties', exact: true }).click()
  await expect(page.getByText('Your parties will appear here. Pick a title to start watching together.')).toBeVisible()
})

for (const tab of ['All', 'Movies', 'Series', 'Parties']) {
  test(`${tab} initial failures freeze placeholders and retry in place`, async ({ page }) => {
    await catalog(page)
    let attempts = 0
    let releaseRetry = () => {}
    const retryReady = new Promise<void>(resolve => { releaseRetry = resolve })
    await page.route('**/api/**', async route => {
      const url = new URL(route.request().url())
      const target = tab === 'Parties' ? '/api/me/parties' : '/api/shows'
      const type = tab === 'Movies' ? 'movie' : tab === 'Series' ? 'series' : null
      if (url.pathname === target && url.searchParams.get('title_type') === type) {
        attempts++
        if (attempts === 1) return route.fulfill({ status: 422, json: { message: 'Fixture unavailable' } })
        await retryReady
      }
      await route.fallback()
    })
    await page.goto('/')
    if (tab !== 'All') await page.getByRole('tab', { name: tab, exact: true }).click()
    const placeholder = page.getByRole('region', { name: tab === 'Parties' ? 'All parties' : 'Featured', exact: true })
    await expect(placeholder.getByRole('alert')).toContainText(tab === 'Parties' ? "Your parties didn't load" : "Titles didn't load")
    await expect(placeholder).toHaveAttribute('aria-busy', 'false')
    await expect(placeholder.locator('.ui-skeleton').first()).toHaveCSS('animation-name', 'none')
    if (tab === 'Parties') await expect(page.getByRole('region', { name: 'Featured', exact: true })).toHaveCount(0)
    if (tab === 'All') await expect(page.locator('.listing-party-card')).toHaveCount(3)
    if (tab !== 'Parties') await expect(page.locator('.listing-catalog-placeholder.is-frozen')).toHaveCount(1)
    await page.screenshot({ path: test.info().outputPath(`listing-${tab.toLowerCase()}-failed.png`), fullPage: true })
    await placeholder.getByRole('button', { name: tab === 'Parties' ? 'Retry' : 'Try again', exact: true }).click()
    await expect(placeholder).toHaveAttribute('aria-busy', 'true')
    await expect(placeholder.getByRole('alert')).toHaveCount(0)
    if (tab === 'Parties') await expect(page.getByRole('region', { name: 'Featured', exact: true })).toHaveCount(0)
    releaseRetry()
    await expect(page.locator(tab === 'Parties' ? '.listing-party-card' : '.listing-show-card')).toHaveCount(tab === 'All' ? 6 : 4)
    await expect(page.locator('.is-frozen')).toHaveCount(0)
    expect(attempts).toBe(2)
  })
}

test('recent parties can fail and recover while the catalog remains usable', async ({ page }) => {
  await catalog(page, { pageSize: shows.length })
  let fail = true
  await page.route('**/api/me/parties*', async route => {
    if (fail) return route.fulfill({ status: 422, json: { message: 'Fixture unavailable' } })
    await route.fallback()
  })
  await page.goto('/')
  await expect(page.locator('.listing-show-card')).toHaveCount(8)
  const recent = page.getByRole('region', { name: 'Recent parties' })
  await expect(recent.getByRole('alert')).toContainText("Your parties didn't load")
  await expect(recent.locator('.listing-party-skeleton')).toHaveCount(3)
  await expect(recent.locator('.ui-skeleton').first()).toHaveCSS('animation-name', 'none')
  await expect(page.getByRole('region', { name: 'Featured', exact: true }).getByRole('button', { name: 'Start a party', exact: true })).toBeVisible()
  await page.screenshot({ path: test.info().outputPath('listing-recent-parties-failed.png'), fullPage: true })
  fail = false
  await recent.getByRole('button', { name: 'Retry', exact: true }).click()
  await expect(recent.locator('.listing-party-card')).toHaveCount(3)
  await expect(page.locator('.listing-show-card')).toHaveCount(8)
  await expect(page.getByRole('alert')).toHaveCount(0)
})

for (const collection of ['titles', 'parties']) {
  test(`loading more ${collection} keeps loaded cards and offers an inline retry on failure`, async ({ page }) => {
    await catalog(page, { pageSize: 2 })
    let attempts = 0
    let releaseMore = () => {}
    const moreReady = new Promise<void>(resolve => { releaseMore = resolve })
    await page.route('**/api/**', async route => {
      const url = new URL(route.request().url())
      if (url.pathname === (collection === 'titles' ? '/api/shows' : '/api/me/parties') && url.searchParams.get('page') === '2') {
        attempts++
        if (attempts === 1) {
          await moreReady
          return route.fulfill({ status: 422, json: { message: 'Fixture unavailable' } })
        }
      }
      await route.fallback()
    })
    await page.goto('/')
    if (collection === 'parties') await page.getByRole('tab', { name: 'Parties', exact: true }).click()
    const cards = page.locator(collection === 'titles' ? '.listing-show-card' : '.listing-party-card')
    const skeletons = page.locator(collection === 'titles' ? '.listing-show-skeleton' : '.listing-party-skeleton')
    await expect(cards).toHaveCount(2)
    await cards.last().scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(skeletons).toHaveCount(collection === 'titles' ? 5 : 3)
    await expect(cards).toHaveCount(2)
    releaseMore()
    const error = page.locator('.listing-load-more-error')
    await expect(error).toHaveText(`Couldn't load more ${collection}.Retry`)
    await expect(skeletons).toHaveCount(0)
    await expect(cards).toHaveCount(2)
    await page.evaluate(() => window.dispatchEvent(new Event('scroll')))
    expect(attempts).toBe(1)
    await page.screenshot({ path: test.info().outputPath(`listing-more-${collection}-failed.png`), fullPage: true })
    await error.getByRole('button', { name: 'Retry', exact: true }).click()
    await expect(cards).toHaveCount(collection === 'titles' ? 8 : 4)
    await expect(error).toHaveCount(0)
    expect(attempts).toBe(2)
  })
}

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

test('F2b series details show your room, preserve the selected season, and support keyboard tabs', async ({ page }) => {
  await catalog(page)
  await page.goto('/')
  const opener = page.getByRole('button', { name: 'Details for Hollow County', exact: true })
  await opener.click()
  const dialog = page.getByRole('dialog', { name: 'Hollow County', exact: true })
  await expect(dialog.locator('.show-modal-live')).toContainText('Your room with Joyce')
  await expect(dialog.getByRole('link', { name: 'Join your room for Hollow County' })).toHaveAttribute('href', '/watch/200')
  await expect(dialog.getByRole('button', { name: 'Start Party', exact: true })).toHaveCount(1)
  await expect(dialog.getByRole('tab', { name: 'Episodes', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(dialog.locator('.show-modal-episode')).toHaveCount(3)
  await expect(dialog.getByText('The night shift runs long, and a stranger signs the visitor book twice.')).toBeVisible()
  await dialog.screenshot({ path: test.info().outputPath('show-detail-series.png') })
  await dialog.getByRole('combobox', { name: 'Season', exact: true }).selectOption('2')
  await expect(dialog.getByText('A new beginning', { exact: true })).toBeVisible()
  await dialog.getByRole('tab', { name: 'Episodes', exact: true }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByRole('tab', { name: 'Parties', exact: true })).toHaveAttribute('aria-selected', 'true')
  await dialog.screenshot({ path: test.info().outputPath('show-detail-parties.png') })
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByRole('tab', { name: 'Details', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(dialog.locator('.show-modal-facts')).toContainText('2025–2026')
  await expect(dialog.locator('.show-modal-facts')).toContainText('2h 30m')
  await expect(dialog.locator('.show-modal-seasons')).toContainText('3 episodes · 1h 45m')
  await expect(dialog.locator('.show-modal-seasons')).toContainText('1 episode · 45m')
  await expect.poll(() => dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  await dialog.screenshot({ path: test.info().outputPath('show-detail-facts.png') })
  await dialog.getByRole('tab', { name: 'Episodes', exact: true }).click()
  await expect(dialog.getByRole('combobox', { name: 'Season', exact: true })).toHaveValue('2')
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
  await opener.click()
  await expect(page.getByRole('dialog').getByRole('combobox', { name: 'Season', exact: true })).toHaveValue('1')
})

test('F2b hides absent parties and shows a movie details table without a lone tab', async ({ page }) => {
  await catalog(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Details for Paper Moons', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Paper Moons', exact: true })
  await expect(dialog.getByText('Loading your parties…')).toHaveCount(0)
  await expect(dialog.getByRole('tablist')).toHaveCount(0)
  await expect(dialog.locator('.show-modal-live')).toHaveCount(0)
  await expect(dialog.locator('.show-modal-facts')).toContainText('Released2025')
  await expect(dialog.locator('.show-modal-facts')).toContainText('Runtime2h 04m')
  await expect(dialog.locator('.show-modal-facts')).toContainText('LanguageEnglish')
  await expect.poll(() => dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  await dialog.screenshot({ path: test.info().outputPath('show-detail-no-parties.png') })
  await dialog.getByRole('button', { name: 'Close details' }).click()
  await page.getByRole('button', { name: 'Details for The Understudies', exact: true }).click()
  const series = page.getByRole('dialog', { name: 'The Understudies', exact: true })
  await expect(series.getByText('Loading your parties…')).toHaveCount(0)
  await expect(series.getByRole('tab', { name: 'Episodes', exact: true })).toBeVisible()
  await expect(series.getByRole('tab', { name: 'Details', exact: true })).toBeVisible()
  await expect(series.getByRole('tab', { name: 'Parties', exact: true })).toHaveCount(0)
})

test('F2b loads title-specific history pages and rejoins the selected existing party', async ({ page }) => {
  await catalog(page)
  const older = { ...parties[2], id: 400 }
  await page.route('**/api/me/parties*', async route => {
    const url = new URL(route.request().url())
    if (url.searchParams.get('show_id') !== '1') return route.fallback()
    const current = Number(url.searchParams.get('page') || 1)
    await route.fulfill({ json: { data: [current === 1 ? parties[2] : older], current_page: current, last_page: 2, total: 2 } })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Details for Velvet Static', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Velvet Static', exact: true })
  await expect(dialog.getByRole('tab', { name: 'Parties', exact: true })).toHaveAttribute('aria-selected', 'true')
  await expect(dialog.locator('.show-modal-live')).toHaveCount(0)
  await expect(dialog.locator('.show-modal-party')).toHaveCount(1)
  await dialog.getByRole('button', { name: 'Load more parties', exact: true }).click()
  await expect(dialog.locator('.show-modal-party')).toHaveCount(2)
  await expect(dialog.getByRole('button', { name: 'Load more parties', exact: true })).toHaveCount(0)
  await dialog.locator('.show-modal-party').last().click()
  await expect(page).toHaveURL(/\/watch\/400$/)
})

test('F2b recovers episode and title-history failures without losing the details sheet', async ({ page }) => {
  await catalog(page)
  let failGroups = true
  let failParties = true
  await page.route('**/api/**', async route => {
    const url = new URL(route.request().url())
    if ((failGroups && url.pathname === '/api/shows/2/groups') || (failParties && url.pathname === '/api/me/parties' && url.searchParams.has('show_id'))) {
      return route.fulfill({ status: 422, json: { message: 'Fixture unavailable' } })
    }
    await route.fallback()
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Details for Hollow County', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Hollow County', exact: true })
  await expect(dialog.getByRole('button', { name: 'Start Party', exact: true })).toBeDisabled()
  await expect(dialog.getByRole('alert').filter({ hasText: 'Unable to load episodes.' })).toBeVisible()
  await expect(dialog.getByRole('alert').filter({ hasText: 'Unable to load your parties.' })).toBeVisible()
  failGroups = false
  await dialog.getByRole('alert').filter({ hasText: 'Unable to load episodes.' }).getByRole('button', { name: 'Retry' }).click()
  await expect(dialog.locator('.show-modal-episode')).toHaveCount(3)
  await expect(dialog.getByRole('button', { name: 'Start Party', exact: true })).toBeEnabled()
  failParties = false
  await dialog.getByRole('alert').filter({ hasText: 'Unable to load your parties.' }).getByRole('button', { name: 'Retry' }).click()
  await expect(dialog.locator('.show-modal-live')).toBeVisible()
  await expect(dialog.getByRole('tab', { name: 'Parties', exact: true })).toBeVisible()
  await expect(dialog.getByRole('alert')).toHaveCount(0)
})

test('F2b starts the selected season and prevents duplicate requests while creating a party', async ({ page }) => {
  await catalog(page)
  let releaseCreate = () => {}
  const createReady = new Promise<void>(resolve => { releaseCreate = resolve })
  const videos: number[] = []
  await page.route('**/api/parties', async route => {
    videos.push(route.request().postDataJSON().show_video_id)
    await createReady
    await route.fulfill({ status: 422, json: { message: 'Fixture unavailable', errors: { show_video_id: ['Fixture unavailable'] } } })
  })
  await page.goto('/')
  await page.getByRole('button', { name: 'Details for Hollow County', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Hollow County', exact: true })
  await dialog.getByRole('combobox', { name: 'Season', exact: true }).selectOption('2')
  await dialog.getByRole('button', { name: 'Start Party', exact: true }).click()
  await expect(dialog.getByRole('button', { name: 'Starting…' })).toBeDisabled()
  await expect(dialog.locator('.show-modal-episode')).toBeDisabled()
  expect(videos).toEqual([801])
  releaseCreate()
  await expect(dialog.getByRole('alert')).toContainText('Unable to start the party.')
  await expect(dialog.getByRole('button', { name: 'Start Party', exact: true })).toBeEnabled()
  await expect(dialog.getByRole('combobox', { name: 'Season', exact: true })).toHaveValue('2')
})

for (const first of ['episodes', 'parties']) {
  test(`F2b keeps its frame steady when ${first} load first and tabs change`, async ({ page }) => {
    await catalog(page)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    let releaseEpisodes = () => {}
    let releaseParties = () => {}
    const episodesReady = new Promise<void>(resolve => { releaseEpisodes = resolve })
    const partiesReady = new Promise<void>(resolve => { releaseParties = resolve })
    await page.route('**/api/**', async route => {
      const url = new URL(route.request().url())
      if (url.pathname === '/api/shows/2/groups') await episodesReady
      if (url.pathname === '/api/me/parties' && url.searchParams.has('show_id')) await partiesReady
      await route.fallback()
    })
    await page.goto('/')
    await page.getByRole('button', { name: 'Details for Hollow County', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Hollow County', exact: true })
    await expect(dialog).toHaveCSS('opacity', '1')
    const geometry = () => dialog.evaluate(element => {
      const frame = element.getBoundingClientRect()
      const heading = element.querySelector('.show-modal-heading')!.getBoundingClientRect()
      return { height: frame.height, width: frame.width, heading: heading.top - frame.top }
    })
    const initial = await geometry()
    try {
      if (first === 'episodes') {
        releaseEpisodes()
        await expect(dialog.getByRole('button', { name: 'Start Party', exact: true })).toBeEnabled()
      } else {
        releaseParties()
        await expect(dialog.getByRole('tab', { name: 'Episodes', exact: true })).toBeVisible()
      }
      await expect.poll(geometry).toEqual(initial)
      if (first === 'parties') await dialog.getByRole('tab', { name: 'Details', exact: true }).click()
      releaseEpisodes()
      releaseParties()
      await expect(dialog.getByRole('button', { name: 'Start Party', exact: true })).toBeEnabled()
      await expect(dialog.locator('.show-modal-live')).toBeVisible()
      if (first === 'parties') await expect(dialog.getByRole('tab', { name: 'Details', exact: true })).toHaveAttribute('aria-selected', 'true')
      await expect.poll(geometry).toEqual(initial)
      for (const name of ['Parties', 'Details', 'Episodes']) {
        await dialog.getByRole('tab', { name, exact: true }).click()
        await expect.poll(geometry).toEqual(initial)
      }
      await expect(dialog.getByText('The first episode', { exact: true })).toBeVisible()
      await expect.poll(() => dialog.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
    } finally {
      releaseEpisodes()
      releaseParties()
    }
  })
}
