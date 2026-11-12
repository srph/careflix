import { useCallback, useRef, useState } from 'react'
import { pusher } from '~/lib/pusher/pusher'
import { usePusher } from '~/hooks/use-pusher'
import { uuid } from '~/lib/uuid/uuid'

// Reactions go browser to browser on the room's private channel, like typing pings, and are never stored.
export const REACTION_EVENT = 'client-reaction'
export const REACTIONS = ['😂', '😱', '😭', '❤️', '🔥', '👀'] as const
// Oldest floats make way once a crowd laugh fills the picture.
export const MAX_FLOATS = 24

export type Reaction = typeof REACTIONS[number]

// Each float picks its own smooth path so a burst never looks copy-pasted.
export interface FloatPath {
  // 0–1 across the band on the right of the picture
  x: number
  // seconds
  duration: number
  // share of the lane's height to rise, in percent
  rise: number
  // px
  size: number
  drift: number
  driftEnd: number
  // degrees
  tilt: number
  ease: string
}

export interface ReactionFloat {
  id: string
  emoji: Reaction
  name: string
  path: FloatPath
}

const EASES = ['cubic-bezier(.22,.61,.36,1)', 'cubic-bezier(.33,.7,.4,1)', 'cubic-bezier(.17,.5,.3,1)']

export const isReaction = (emoji: unknown): emoji is Reaction => REACTIONS.includes(emoji as Reaction)

export function makePath(random: () => number = Math.random): FloatPath {
  const between = (a: number, b: number) => a + random() * (b - a)
  const side = random() < .5 ? -1 : 1
  return {
    x: random(),
    duration: between(2.6, 3.6),
    rise: between(50, 75),
    size: between(26, 34),
    drift: side * between(8, 22),
    driftEnd: -side * between(0, 16),
    tilt: side * between(0, 6),
    ease: EASES[Math.floor(random() * EASES.length)]
  }
}

// `showOthers` is false while chat is closed and the Activity Overlay is below "Everything";
// their reactions are dropped then, not saved for later. Your own always float.
export function useReactions(party: Pick<AppParty, 'id' | 'members'>, me: Pick<AppUser, 'id'>, showOthers = true) {
  const channelName = `private-party.${party.id}`
  const [floats, setFloats] = useState<ReactionFloat[]>([])
  const members = useRef(party.members)
  members.current = party.members
  const isShowingOthers = useRef(showOthers)
  isShowingOthers.current = showOthers

  const add = useCallback((emoji: Reaction, name: string) => {
    setFloats(current => [...current, { id: uuid(), emoji, name, path: makePath() }].slice(-MAX_FLOATS))
  }, [])

  usePusher(channelName, REACTION_EVENT, (data: { userId?: AppId, emoji?: unknown }) => {
    if (!data || !isReaction(data.emoji) || String(data.userId) === String(me.id) || !isShowingOthers.current) return
    // The name comes from the party, not the payload.
    const member = members.current.find(member => String(member.id) === String(data.userId))
    if (member) add(data.emoji, member.name)
  })

  // Your own float shows straight away; Pusher doesn't echo client events back to the sender.
  const send = useCallback((emoji: Reaction) => {
    add(emoji, 'You')
    const channel = pusher()?.channel(channelName)
    if (channel?.subscribed) channel.trigger(REACTION_EVENT, { userId: me.id, emoji })
  }, [add, channelName, me.id])

  const remove = useCallback((id: string) => {
    setFloats(current => current.filter(float => float.id !== id))
  }, [])

  return { floats, send, remove }
}
