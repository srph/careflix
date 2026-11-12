import { cn } from '~/utils/cn'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { AppWatchHomeChatInvitationPanel } from '../app-watch-home-chat-invitation-panel/app-watch-home-chat-invitation-panel'
import { useHostInvitations } from '../app-watch-home-chat-invitation-panel/use-host-invitations'
import { AnimatePresence } from 'motion/react'
import { AppWatchHomeChatStatus } from '../app-watch-home-chat-status/app-watch-home-chat-status'
import { isJoinActivity } from '../app-watch-home-chat-status/app-watch-home-chat-status-status'
import { useTypingStatus } from './use-typing-status'
import { useChatScroll } from './use-chat-scroll'
import { AppWatchHomeChatWidgetInviteStrip } from './app-watch-home-chat-widget-invite-strip'
import { AppWatchHomeChatWidgetReactionRow } from './app-watch-home-chat-widget-reaction-row'
import { AppWatchHomeChatWidgetMessages } from './app-watch-home-chat-widget-messages'
import { AppWatchHomeChatWidgetComposer } from './app-watch-home-chat-widget-composer'
import type { Reaction } from '../use-reactions'
import { useTransientState } from '~/hooks/use-transient-state'
import { AppWatchHomePartyCode } from '../app-watch-home-party-code'
import { useAuthUser } from '~/contexts/auth/auth'
import { useEffect, useRef } from 'react'
import { usePusher } from '~/hooks/use-pusher'
import { useWindowVisibility } from '~/hooks/use-window-visibility'
import {
  useAppendChatLog,
  useChatLogsQuery,
  useSendMessageMutation
} from '~/screens/app.watch/queries/app-watch-chat-queries'

import asset_chatInactive from '~/assets/audio/chat-inactive.ogg'
import { UiAvatarGroup } from '~/components/ui-avatar-group/ui-avatar-group'
import { useActiveMembers } from '../use-active-members'

interface Props {
  party: AppParty
  isChatOpen: boolean
  isSeasonSelectionOpen: boolean
  isInvitationOpen: boolean
  isKeyboardInfoOpen: boolean
  onOpenInvitationModal: () => void
  onCloseInvitationModal: () => void
  onReact: (emoji: Reaction) => void
}

// Hype lines stay up this long after a friend arrives.
const JOIN_FLASH_MS = 3200

// Until the log loads (or if it fails), the chat is empty.
const NO_LOGS: AppPartyLog[] = []

export function AppWatchHomeChatWidget(props: Props) {
  const user = useAuthUser()
  const invitations = useHostInvitations()
  const inviteButton = useRef<HTMLButtonElement>(null)
  const wasInvitationOpen = useRef(false)
  useEffect(() => {
    if (wasInvitationOpen.current && !props.isInvitationOpen) inviteButton.current?.focus({ preventScroll: true })
    wasInvitationOpen.current = props.isInvitationOpen
  }, [props.isInvitationOpen])
  const logs = useChatLogsQuery(props.party.id).data ?? NO_LOGS
  const appendLog = useAppendChatLog(props.party.id)
  const sendMessage = useSendMessageMutation(props.party, user)
  const scroll = useChatScroll(logs.length)
  const idleAudioRef = useRef<HTMLAudioElement>(null)
  const typing = useTypingStatus(props.party.id, user)
  const members = useActiveMembers(props.party)
  // A friend who just arrived; the status row shows their hype line for a few seconds.
  const [joined, showJoined] = useTransientState<AppUser | null>(null, JOIN_FLASH_MS)

  const isWindowVisible = useWindowVisibility()

  usePusher(`private-party.${props.party.id}`, 'log', (event: { log: AppPartyLog }) => {
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
    <div
      data-testid="chat-pane"
      data-open={props.isChatOpen}
      // Under the picture on phones; from `sm` a column that slides in from the right edge.
      className={cn(
        'relative flex h-full min-h-0 shrink flex-col overflow-hidden bg-neutral-900 sm:absolute sm:inset-y-0 sm:w-(--player-chat-pane-width) sm:shrink-0 sm:transition-all sm:duration-200',
        props.isChatOpen ? 'sm:right-0' : 'sm:right-[calc(-1*var(--player-chat-pane-width))]'
      )}>
      {/* The invite panel is a solid sheet over this, so the chat stays put underneath; it only can't be reached. */}
      <div data-testid="chat-content" className="flex min-h-0 flex-1 flex-col" inert={props.isInvitationOpen}>
        {/* Faces, the party code chip and invite in one row. */}
        <div
          data-testid="chat-canopy"
          className="flex shrink-0 items-center gap-2 bg-neutral-900 pt-3 pr-3 pb-2 pl-3.5">
          <UiAvatarGroup
            users={members}
            className="mr-auto"
            itemClassName="not-last:-mr-2"
            avatarClassName="size-6 text-10 ring-2 ring-neutral-900"
            statusClassName="-right-0.5 -bottom-0.5 size-2.5"
          />

          <AppWatchHomePartyCode code={props.party.join_code} chip />

          <UiPlainButton
            type="button"
            ref={inviteButton}
            className="flex size-7.5 flex-none items-center justify-center rounded-full bg-neutral-800 text-13 leading-none text-white transition-colors duration-200 hover:bg-neutral-700 motion-reduce:[transition:none]"
            aria-label="Invite people"
            aria-expanded={props.isInvitationOpen}
            onClick={props.onOpenInvitationModal}>
            <i className="fa fa-user-plus" aria-hidden="true" />
          </UiPlainButton>
        </div>

        <AppWatchHomeChatWidgetInviteStrip invitations={invitations} onOpen={props.onOpenInvitationModal} />
        <AppWatchHomeChatWidgetMessages logs={logs} scroll={scroll} />

        {/* A tray in the LayerCard style: the status row on top, the composer card flush below it. */}
        <div data-testid="chat-tray" className="mx-2.5 mt-1 mb-2.5 shrink-0 rounded-xl bg-neutral-800">
          <AppWatchHomeChatStatus logs={logs} typing={typing.names} joined={joined} meId={user.id} />

          <AppWatchHomeChatWidgetComposer
            canFocusWithSlash={
              props.isChatOpen && !props.isInvitationOpen && !props.isSeasonSelectionOpen && !props.isKeyboardInfoOpen
            }
            onTyping={typing.notify}
            onSend={handleSend}
          />
        </div>

        <AppWatchHomeChatWidgetReactionRow onReact={props.onReact} />
      </div>
      <AnimatePresence>
        {props.isInvitationOpen && (
          <AppWatchHomeChatInvitationPanel
            key="host-invites"
            invitations={invitations}
            onClose={props.onCloseInvitationModal}
          />
        )}
      </AnimatePresence>

      <audio className="hidden" ref={idleAudioRef}>
        <source src={asset_chatInactive} type="audio/ogg" />
      </audio>
    </div>
  )
}
