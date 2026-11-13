import { AppWatchHomeChatStatus } from '../app-watch-home-chat-status/app-watch-home-chat-status'
import { isJoinActivity } from '../app-watch-home-chat-status/app-watch-home-chat-status-status'
import { useWatchLayout } from '../app-watch-home-layout'
import { useTypingStatus } from './use-typing-status'
import { useChatScroll } from './use-chat-scroll'
import { AppWatchHomeChatWidgetReactionRow } from './app-watch-home-chat-widget-reaction-row'
import { AppWatchHomeChatWidgetMessages } from './app-watch-home-chat-widget-messages'
import { AppWatchHomeChatWidgetComposer } from './app-watch-home-chat-widget-composer'
import { useTransientState } from '~/hooks/use-transient-state'
import { useAuthUser } from '~/lib/auth/auth-queries'
import { useEffect, useRef } from 'react'
import { usePusher } from '~/hooks/use-pusher'
import { useWindowVisibility } from '~/hooks/use-window-visibility'
import { useParty } from '~/screens/app.watch/use-party'
import {
  useAppendChatLog,
  useChatLogsQuery,
  useSendMessageMutation
} from '~/screens/app.watch/queries/app-watch-chat-queries'

import asset_chatInactive from '~/assets/audio/chat-inactive.ogg'

// Hype lines stay up this long after a friend arrives.
const JOIN_FLASH_MS = 3200

// Until the log loads (or if it fails), the chat is empty.
const NO_LOGS: AppPartyLog[] = []

/**
 * The conversation: messages, the status row and composer, and the reaction row.
 * Sits in the sidebar, under its header.
 */
export function AppWatchHomeChatWidget() {
  const party = useParty()
  const layout = useWatchLayout()
  const user = useAuthUser()
  const logs = useChatLogsQuery(party.id).data ?? NO_LOGS
  const appendLog = useAppendChatLog(party.id)
  const sendMessage = useSendMessageMutation(party, user)
  const scroll = useChatScroll(logs.length)
  const idleAudioRef = useRef<HTMLAudioElement>(null)
  const typing = useTypingStatus(party.id, user)
  // A friend who just arrived; the status row shows their hype line for a few seconds.
  const [joined, showJoined] = useTransientState<AppUser | null>(null, JOIN_FLASH_MS)

  const isWindowVisible = useWindowVisibility()

  usePusher(`private-party.${party.id}`, 'log', (event: { log: AppPartyLog }) => {
    scroll.receive()
    appendLog(event.log)

    const activity = event.log.type === 'activity' ? event.log.activity : null
    if (activity && isJoinActivity(activity) && String(activity.user.id) !== String(user.id)) {
      showJoined(activity.user)
    }

    if (event.log.type === 'message') typing.clear(event.log.message.user.id)

    if (!isWindowVisible && event.log.type === 'message') {
      // Let's play a sound if the user receives a message while switched to another tab.
      idleAudioRef.current!.play()
    }
  })

  useEffect(() => {
    // @TODO Make a reusable component that does this kasi tangina nito hahahah
    // <Audio volume={pakyu} />
    idleAudioRef.current!.volume = 0.1
  }, [])

  function handleSend(text: string) {
    scroll.send()
    typing.sent()
    sendMessage.mutate(text)
  }

  return (
    <>
      <AppWatchHomeChatWidgetMessages logs={logs} scroll={scroll} />

      {/* A tray in the LayerCard style: the status row on top, the composer card flush below it. */}
      <div data-testid="chat-tray" className="mx-2.5 mt-1 mb-2.5 shrink-0 rounded-xl bg-neutral-800">
        <AppWatchHomeChatStatus logs={logs} typing={typing.names} joined={joined} meId={user.id} />

        <AppWatchHomeChatWidgetComposer
          canFocusWithSlash={layout.sidebar === 'chat' && layout.modal === null}
          onTyping={typing.notify}
          onSend={handleSend}
        />
      </div>

      <AppWatchHomeChatWidgetReactionRow />

      <audio className="hidden" ref={idleAudioRef}>
        <source src={asset_chatInactive} type="audio/ogg" />
      </audio>
    </>
  )
}
