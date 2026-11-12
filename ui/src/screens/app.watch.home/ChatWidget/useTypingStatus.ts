import { useCallback, useEffect, useRef, useState } from 'react'
import { pusher } from '~/lib/pusher/pusher'
import { usePusher } from '~/hooks/use-pusher'

// Pusher client events go straight from browser to browser on the room's private channel.
// The app needs "client events" enabled in the Pusher dashboard; without it, trigger is refused and nothing shows.
export const TYPING_EVENT = 'client-typing'
// How long a typer stays listed after their last ping.
export const TYPING_TTL = 4000
// How often we ping while someone keeps typing; well under Pusher's 10 events/second limit.
export const TYPING_PING_EVERY = 2500

interface Typer {
  user: { id: AppId, name: string }
  until: number
}

type Typers = Record<string, Typer>

export function pruneTypers(typers: Typers, now: number): Typers {
  const next: Typers = {}
  for (const [id, typer] of Object.entries(typers)) if (typer.until > now) next[id] = typer
  return Object.keys(next).length === Object.keys(typers).length ? typers : next
}

export default function useTypingStatus(partyId: AppId, me: Pick<AppUser, 'id' | 'name'>) {
  const channelName = `private-party.${partyId}`
  const [typers, setTypers] = useState<Typers>({})
  const lastPing = useRef(0)

  usePusher(channelName, TYPING_EVENT, (data: { user?: Typer['user'] }) => {
    if (!data?.user || String(data.user.id) === String(me.id)) return
    setTypers(current => ({ ...current, [String(data.user.id)]: { user: data.user, until: Date.now() + TYPING_TTL } }))
  })

  useEffect(() => {
    const untils = Object.values(typers).map(typer => typer.until)
    if (!untils.length) return
    const timer = setTimeout(() => setTypers(current => pruneTypers(current, Date.now())), Math.max(0, Math.min(...untils) - Date.now()) + 10)
    return () => clearTimeout(timer)
  }, [typers])

  // Call on every keystroke; pings are throttled here.
  const notify = useCallback(() => {
    const now = Date.now()
    if (now - lastPing.current < TYPING_PING_EVERY) return
    const channel = pusher()?.channel(channelName)
    if (!channel?.subscribed) return
    lastPing.current = now
    channel.trigger(TYPING_EVENT, { user: { id: me.id, name: me.name } })
  }, [channelName, me.id, me.name])

  // After sending, the next keystroke should announce itself straight away.
  const sent = useCallback(() => { lastPing.current = 0 }, [])

  // A typer's message arriving means they're done.
  const clear = useCallback((userId: AppId) => {
    setTypers(current => {
      if (!current[String(userId)]) return current
      const { [String(userId)]: _, ...rest } = current
      return rest
    })
  }, [])

  return { names: Object.values(typers).map(typer => typer.user.name), notify, sent, clear }
}
