import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import usePusher from './usePusher'

const { client, channel } = vi.hoisted(() => {
  const channel = { bind: vi.fn(), unbind: vi.fn() }
  const client = { subscribe: vi.fn(() => channel), unsubscribe: vi.fn() }
  return { client, channel }
})
vi.mock('~/lib/pusher', () => ({ default: () => client }))

function Listener({ name = 'private-party.1', event = 'state', callback = () => {} }) {
  usePusher(name, event, callback)
  return null
}

beforeEach(() => vi.clearAllMocks())

describe('room event subscriptions', () => {
  it('uses the latest handler without dropping another listener on the channel', () => {
    const first = vi.fn()
    const latest = vi.fn()
    const one = render(<Listener callback={first} />)
    const two = render(<Listener event="log" />)
    const handler = channel.bind.mock.calls[0][1]
    one.rerender(<Listener callback={latest} />)
    handler({ current_time: 12 })
    expect(first).not.toHaveBeenCalled()
    expect(latest).toHaveBeenCalledWith({ current_time: 12 })
    one.unmount()
    expect(client.unsubscribe).not.toHaveBeenCalled()
    two.unmount()
    expect(client.unsubscribe).toHaveBeenCalledExactlyOnceWith('private-party.1')
  })

  it('releases the old room and subscribes to the new one', async () => {
    const view = render(<Listener />)
    view.rerender(<Listener name="private-party.2" />)
    await waitFor(() => expect(client.subscribe).toHaveBeenLastCalledWith('private-party.2'))
    expect(client.unsubscribe).toHaveBeenCalledWith('private-party.1')
  })
})
