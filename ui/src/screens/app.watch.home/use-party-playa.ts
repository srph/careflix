import { useEffect } from 'react'
import { usePlaya } from '~/components/playa/use-playa'
import { usePusher } from '~/hooks/use-pusher'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import { pusher } from '~/lib/pusher/pusher'
import { useAuthUser } from '~/lib/auth/auth-queries'
import { setPlayback } from '~/screens/app.watch/app-watch-party-updates'
import { useSetParty, useSyncStateMutation } from '~/screens/app.watch/queries/app-watch-party-queries'
import { loadSubtitle } from '~/screens/app.watch/queries/app-watch-video-queries'
import { keepsOnOverlay, showsOnOverlay, showsReactions } from './app-watch-home-activity/app-watch-home-activity-level'
import { toPlayaActivity, toPlayaPerson } from './app-watch-home-activity/app-watch-home-activity-to-playa'
import { isReaction } from './app-watch-home-chat-widget/app-watch-home-chat-widget-reaction-row'
import { useWatchLayout } from './app-watch-home-layout'

// Reactions go browser to browser on the room's private channel, like typing pings, and are never stored.
export const REACTION_EVENT = 'client-reaction'

/**
 * Wires Playa to the room, and is the only file that knows both. Your play, pause and seek go to the
 * server and your reactions to the room; everyone else's come back in through `sync()`, `react()` and
 * `activity()`, filtered by the Activity Overlay level.
 */
export function usePartyPlaya(party: AppParty) {
  const user = useAuthUser()
  const { sidebar, activityLevel } = useWatchLayout()
  const setParty = useSetParty(party.id)
  const syncState = useSyncStateMutation(party.id)
  const channel = `private-party.${party.id}`
  const isChatOpen = sidebar !== 'closed'

  const playa = usePlaya({
    src: party.video.video_url,
    initialTime: party.current_time,
    duration: party.video.duration,
    subtitles: party.video.subtitle_url ? () => loadSubtitle(party.video.id) : null,
    onPlayback: ({ time, isPlaying }) => syncState.mutate({ is_playing: isPlaying, current_time: time }),
    // Pusher doesn't echo client events back to the sender; Playa already floated yours.
    onReact(emoji) {
      const room = pusher()?.channel(channel)
      if (room?.subscribed) room.trigger(REACTION_EVENT, { userId: user.id, emoji })
    }
  })

  // Every state event syncs, even when its time and play/pause match the previous one.
  usePusher(channel, 'state', (event: { state: AppPartyState }) => {
    setParty((current) => setPlayback(current, event.state))
    playa.sync({ time: event.state.current_time, isPlaying: event.state.is_playing })
  })

  // A new video starts where the server says. This waits for the render that swaps the source,
  // which would otherwise undo the seek.
  useUpdateEffect(() => {
    playa.sync({ time: party.current_time, isPlaying: party.is_playing })
  }, [party.video.id])

  // Friends' reactions are dropped, not saved for later, while chat is closed below "Everything".
  usePusher(channel, REACTION_EVENT, (data: { userId?: AppId; emoji?: unknown }) => {
    if (!data || !isReaction(data.emoji) || String(data.userId) === String(user.id)) return
    if (!showsReactions(activityLevel, isChatOpen)) return
    // The name comes from the party, not the payload.
    const member = party.members.find((member) => String(member.id) === String(data.userId))
    if (member) playa.react(data.emoji, { by: toPlayaPerson(member) })
  })

  usePusher(channel, 'log', (event: { log?: AppPartyLog }) => {
    const log = event?.log
    if (!log || isChatOpen || !showsOnOverlay(log, activityLevel, user.id)) return
    playa.activity(toPlayaActivity(log))
  })

  // Chat opening takes over the conversation; a stricter level drops lines that no longer belong.
  useEffect(() => {
    playa.clearActivity(isChatOpen ? undefined : (activity) => keepsOnOverlay(activity, activityLevel))
  }, [isChatOpen, activityLevel])

  return playa
}
