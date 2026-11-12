import { useEffect, useState } from 'react'
import { pusher } from '~/lib/pusher/pusher'
import { usePusher } from './use-pusher'

// null means the initial roster has not arrived; an empty set means nobody is online.
export function usePresence(channelName: string) {
  const [snapshot, setSnapshot] = useState<{ channel: string; ids: Set<string> } | null>(null)

  function updateMembers() {
    const channel = pusher()?.channel(channelName) as Pusher.PresenceChannel<unknown>
    if (!channel?.subscribed) {
      setSnapshot(null)
      return
    }

    const ids = new Set<string>()
    channel.members.each((member) => ids.add(String(member.id)))
    setSnapshot({ channel: channelName, ids })
  }

  usePusher(channelName, 'pusher:subscription_succeeded', updateMembers)
  usePusher(channelName, 'pusher:member_added', updateMembers)
  usePusher(channelName, 'pusher:member_removed', updateMembers)

  // The global channel can already be subscribed before this component mounts.
  useEffect(updateMembers, [channelName])

  return channelName && snapshot?.channel === channelName ? snapshot.ids : null
}
