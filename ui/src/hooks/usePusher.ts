import { useEffect, useRef } from 'react'
import pusher from '~/lib/pusher'

// Several components listen to different events on the same channel. Releasing
// one listener must not unsubscribe the others when a room unmounts.
const subscriptions = new WeakMap<object, Map<string, number>>()

function usePusher(channelName: string, eventName: string, callback: Pusher.EventCallback, isDisabled = false) {
  const latest = useRef(callback)
  latest.current = callback

  useEffect(() => {
    const client = pusher()
    if (isDisabled || !channelName || !client) return
    let counts = subscriptions.get(client)
    if (!counts) {
      counts = new Map()
      subscriptions.set(client, counts)
    }
    counts.set(channelName, (counts.get(channelName) ?? 0) + 1)
    const channel = client.subscribe(channelName)
    const listener: Pusher.EventCallback = (...args) => latest.current(...args)
    channel.bind(eventName, listener)
    return () => {
      channel.unbind(eventName, listener)
      const remaining = counts.get(channelName) - 1
      if (remaining) counts.set(channelName, remaining)
      else {
        counts.delete(channelName)
        client.unsubscribe(channelName)
      }
    }
  }, [channelName, eventName, isDisabled])
}

export { usePusher, usePusher as default }
