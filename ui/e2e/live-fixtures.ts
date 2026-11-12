import { readFileSync } from 'node:fs'
import type { Page } from '@playwright/test'

export const fixturePath = process.env.E2E_LIVE_FIXTURES

export function liveFixtures(): { users: { token: string }[]; seriesId?: number } {
  return JSON.parse(readFileSync(fixturePath!, 'utf8'))
}

export async function reserveLiveBudget(token: string, needed: number) {
  const base = process.env.E2E_LIVE_API_URL || 'http://localhost:8487'
  for (let attempt = 0; attempt < 3; attempt++) {
    const response = await fetch(`${base}/api/me`, {
      signal: AbortSignal.timeout(20_000),
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    })
    await response.arrayBuffer()
    const remaining = response.headers.get('x-ratelimit-remaining')
    if (response.ok && (remaining === null || Number(remaining) >= needed)) return
    if (!response.ok && response.status !== 429) throw new Error(`Live API quota check: HTTP ${response.status}`)
    const retryAfter = Number(response.headers.get('retry-after') || 60)
    const delay = Math.min(60_000, Math.max(1000, retryAfter * 1000 + 250))
    console.info(`Waiting ${Math.ceil(delay / 1000)}s for the existing local API rate limit`)
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
  throw new Error('Local API quota did not recover; stop other live traffic before rerunning')
}

export async function liveAPI(token: string, path: string, method = 'GET', body?: unknown) {
  const base = process.env.E2E_LIVE_API_URL || 'http://localhost:8487'
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(20_000),
    method,
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json', 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  })
  // Do not attach request objects or credentials to failures or reports.
  if (!response.ok) throw new Error(`Live API ${method} ${path}: HTTP ${response.status}`)
  return response.json()
}

export function diagnoseRuntime(page: Page) {
  const errors: string[] = []
  page.on('console', async (message) => {
    if (message.type() !== 'error') return
    // React's router boundary can catch the first error and then encounter a
    // second error during cleanup. Capture Error fields only, never HTTP config.
    for (const argument of message.args()) {
      const error = await argument
        .evaluate((value) =>
          value instanceof Error
            ? { name: value.name, message: value.message, stack: value.stack?.split('\n').slice(0, 5) }
            : null
        )
        .catch(() => null)
      if (error) {
        errors.push(error.message)
        if (process.env.E2E_DIAGNOSE) console.info('Browser exception:', JSON.stringify(error))
      }
    }
  })
  page.on('response', (response) => {
    if (response.status() === 401) console.info('Unauthorized API path:', new URL(response.url()).pathname)
  })
  return errors
}
