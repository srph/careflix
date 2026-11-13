import * as React from 'react'
import { useEffect, useRef } from 'react'
import { AnimatePresence } from 'motion/react'
import { cn } from '~/utils/cn'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { UiAvatarGroup } from '~/components/ui-avatar-group/ui-avatar-group'
import { useParty } from '~/screens/app.watch/use-party'
import { AppWatchHomeChatInvitationPanel } from './app-watch-home-chat-invitation-panel/app-watch-home-chat-invitation-panel'
import { useHostInvitations } from './app-watch-home-chat-invitation-panel/use-host-invitations'
import { AppWatchHomeChatWidget } from './app-watch-home-chat-widget/app-watch-home-chat-widget'
import { AppWatchHomeChatWidgetInviteStrip } from './app-watch-home-chat-widget/app-watch-home-chat-widget-invite-strip'
import { useWatchLayout } from './app-watch-home-layout'
import { AppWatchHomePartyCode } from './app-watch-home-party-code'
import { useActiveMembers } from './use-active-members'

/**
 * The column beside the picture: who's here, the party code and invite, then chat, with the invite panel
 * over it when open. Under the picture on phones; from `sm` it slides in from the right edge.
 */
export function AppWatchHomeSidebar() {
  const party = useParty()
  const { sidebar, setSidebar } = useWatchLayout()
  const invitations = useHostInvitations()
  const members = useActiveMembers(party)
  const inviteButton = useRef<HTMLButtonElement>(null)
  const isInviteOpen = sidebar === 'invite'

  // Closing the invite panel hands focus back to the button that opened it.
  const previous = useRef(sidebar)
  useEffect(() => {
    if (previous.current === 'invite' && sidebar === 'chat') inviteButton.current?.focus({ preventScroll: true })
    previous.current = sidebar
  }, [sidebar])

  const openInvite = () => setSidebar('invite')

  return (
    <div
      data-testid="chat-pane"
      data-open={sidebar !== 'closed'}
      className={cn(
        'relative flex h-full min-h-0 shrink flex-col overflow-hidden bg-neutral-900 sm:absolute sm:inset-y-0 sm:w-(--player-chat-pane-width) sm:shrink-0 sm:transition-all sm:duration-200',
        sidebar !== 'closed' ? 'sm:right-0' : 'sm:right-[calc(-1*var(--player-chat-pane-width))]'
      )}>
      {/* The invite panel is a solid sheet over this, so the chat stays put underneath; it only can't be reached. */}
      <div data-testid="chat-content" className="flex min-h-0 flex-1 flex-col" inert={isInviteOpen}>
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

          <AppWatchHomePartyCode code={party.join_code} chip />

          <UiPlainButton
            type="button"
            ref={inviteButton}
            className="flex size-7.5 flex-none items-center justify-center rounded-full bg-neutral-800 text-13 leading-none text-white transition-colors duration-200 hover:bg-neutral-700 motion-reduce:[transition:none]"
            aria-label="Invite people"
            aria-expanded={isInviteOpen}
            onClick={openInvite}>
            <i className="fa fa-user-plus" aria-hidden="true" />
          </UiPlainButton>
        </div>

        <AppWatchHomeChatWidgetInviteStrip invitations={invitations} onOpen={openInvite} />
        <AppWatchHomeChatWidget />
      </div>

      <AnimatePresence>
        {isInviteOpen && (
          <AppWatchHomeChatInvitationPanel
            key="host-invites"
            invitations={invitations}
            onClose={() => setSidebar('chat')}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
