import { beforeEach, expect, it, vi } from 'vitest'

const connection = vi.hoisted(() => ({ disconnect: vi.fn(), options: null as any }))
vi.mock('pusher-js', () => ({
  default: class {
    constructor(_key: string, options: any) {
      connection.options = options
    }
    disconnect = connection.disconnect
  }
}))

import { pusher } from './pusher'

beforeEach(() => {
  pusher.unset()
  connection.disconnect.mockClear()
})

it('uses the Care.tv bearer token for private channel authorization and disconnects on logout', () => {
  pusher.set({ token: 'care-tv-token' } as any)
  expect(connection.options.authEndpoint).toMatch(/\/broadcasting\/auth$/)
  expect(connection.options.auth.headers.Authorization).toBe('Bearer care-tv-token')
  pusher.unset()
  expect(connection.disconnect).toHaveBeenCalledOnce()
  expect(pusher()).toBeNull()
})
