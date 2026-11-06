// @vitest-environment node
import { createServer as createHttpServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { createServer, type ViteDevServer } from 'vite'
import { afterAll, beforeAll, expect, it, vi } from 'vitest'
import viteConfig from '../../../vite.config'

let api: Server
let frontend: ViteDevServer
let origin: string
const forwarded: string[] = []

beforeAll(async () => {
  api = createHttpServer((request, response) => {
    forwarded.push(request.url!)
    response.writeHead(302, { Location: 'https://discord.com/oauth2/authorize' })
    response.end()
  })
  await new Promise<void>(resolve => api.listen(0, '127.0.0.1', resolve))
  const apiPort = (api.address() as AddressInfo).port
  vi.stubEnv('VITE_API_BASE_URL', `http://127.0.0.1:${apiPort}`)
  const config = viteConfig({ command: 'serve', mode: 'test' })
  frontend = await createServer({
    ...config,
    configFile: false,
    server: { ...config.server, host: '127.0.0.1', port: 0, strictPort: false, hmr: false, watch: null },
  })
  await frontend.listen()
  origin = `http://127.0.0.1:${(frontend.httpServer!.address() as AddressInfo).port}`
})

afterAll(async () => {
  await frontend?.close()
  if (api) await new Promise<void>(resolve => api.close(() => resolve()))
  vi.unstubAllEnvs()
})

it('forwards the Discord authorization URL and its challenge to the API', async () => {
  const path = '/auth/discord?challenge=' + 'a'.repeat(64)
  const response = await fetch(origin + path, { redirect: 'manual' })
  expect(response.status).toBe(302)
  expect(response.headers.get('location')).toBe('https://discord.com/oauth2/authorize')
  expect(forwarded).toContain(path)
})

it('preserves the Discord callback code and state when proxying', async () => {
  const path = '/auth/discord/callback?code=discord-code&state=browser-state'
  const response = await fetch(origin + path, { redirect: 'manual' })
  expect(response.status).toBe(302)
  expect(forwarded).toContain(path)
})

it('keeps the React callback on the frontend', async () => {
  const path = '/auth/callback?code=care-tv-handoff'
  const response = await fetch(origin + path, { redirect: 'manual' })
  expect(response.status).toBe(200)
  expect(response.headers.get('content-type')).toContain('text/html')
  expect(await response.text()).toContain('id="mount"')
  expect(forwarded).not.toContain(path)
})
