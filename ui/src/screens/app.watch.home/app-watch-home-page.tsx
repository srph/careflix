import { useInvitationOverlay } from '~/screens/app/app-invitation-modal/app-invitation-modal-context'

import * as React from 'react'
import { cn } from '~/utils/cn'
import { UiLoader } from '~/components/ui-loader/ui-loader'
import { AppWatchHomePlayerControls } from './app-watch-home-player-controls'
import { AppWatchHomeChatWidget } from './app-watch-home-chat-widget/app-watch-home-chat-widget'
import { AppWatchHomeSubtitleSlot } from './app-watch-home-subtitle-slot/app-watch-home-subtitle-slot'
import { AppWatchHomeSeasonSelectionModal } from './app-watch-home-season-selection-modal'
import { AppWatchHomeMobileTitleBar } from './app-watch-home-mobile-title-bar'
import { AppWatchHomePlayerStateBufferedIndicator } from './app-watch-home-player-state-buffered-indicator'
import { AppWatchHomeKeyboardInfoModal } from './app-watch-home-keyboard-info-modal'
import { AppWatchHomeReactionLayer } from './app-watch-home-reaction-layer'
import { useReactions } from './use-reactions'
import { AppWatchHomeActivityOverlay } from './app-watch-home-activity-overlay'
import { showsReactions } from './app-watch-home-activity-level'
import { AppWatchHomePlayerContext } from './app-watch-home-player-context'
import { usePlayerSync } from './use-player-sync'
import { usePlayerChrome } from './use-player-chrome'

import { useUpdateEffect } from '~/hooks/use-update-effect'
import { useEffect, useRef } from 'react'
import { useParty } from '~/screens/app.watch/use-party'
import { useSetParty } from '~/screens/app.watch/queries/app-watch-party-queries'
import { useAuthUser } from '~/contexts/auth/auth'
import { useBufferState } from '~/hooks/use-buffer-state'
import { useMediaMode } from '~/hooks/use-media-mode'
import { useRouterBlock } from '~/hooks/use-router-block'

import { getVideoPreviewImage } from '~/utils/shows/get-video-preview-image'

/**
 * @TODO Sync time every 5 minutes or so.
 */
export function AppWatchHomePage(props: ReactComponentWrapper) {
  const party = useParty()
  const setParty = useSetParty(party.id)
  const user = useAuthUser()
  const { registerPlayer } = useInvitationOverlay()
  const player = usePlayerSync(party)
  const chrome = usePlayerChrome(party, user)
  const { state } = player

  // Other people's floats follow the Activity Overlay level while chat is closed.
  const reactions = useReactions(party, user, showsReactions(chrome.activityLevel, chrome.state.isChatOpen))

  const $pane = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerPlayer({ partyId: party.id, element: $pane.current! })
    return () => registerPlayer(null)
  }, [party.id, registerPlayer])

  const media = useMediaMode()

  // Used to show the change episode notice momentarily
  const [changeEpisodeBuffer, displayChangeEpisodeBuffer] = useBufferState({
    timeout: 4000
  })

  useUpdateEffect(() => {
    // We're not putting any other conditions here (if it's a series, etc.)
    // because we're in the assumption that only series will have a change
    // of videos.
    displayChangeEpisodeBuffer()
  }, [party.video.id])

  function handleVideoClick() {
    if (media === 'desktop') {
      // If it's open, most probably it's been opened through hover (desktop).
      // On desktop, we want overlay clicks to toggle play; for mobile screens,
      // we want overlays to open the overlay.
      return player.play()
    }

    chrome.openControls()
  }

  function handleVideoHover() {
    // We don't want this event to be called on mobile.
    if (media === 'mobile') {
      return
    }

    chrome.showControlsForAWhile()
  }

  useRouterBlock(
    (location) => {
      if (!state.isPlaying) {
        return
      }

      if (location.pathname.startsWith('/watch')) {
        return
      }

      return 'Are you sure you want to leave this page?'
    },
    [state.isPlaying]
  )

  function handleChangeVideo(next: AppParty) {
    chrome.closeSeasonSelection()

    // FYI, the controls let overlay clicks pass through to the video, where handleVideoClick
    // does the right thing for desktop and mobile.
    chrome.closeControls()

    // The change-video response leaves out the room's invitations.
    setParty((current) => ({ ...next, invitations: current.invitations }))

    player.changedVideo(next)
  }

  return (
    <AppWatchHomePlayerContext.Provider value={{ player, chrome }}>
      {/* Phones stack the picture, title bar and chat. From `sm` the picture fills the window and the chat slides in beside it. */}
      <div className="flex h-(--window-vh) w-screen flex-col overflow-hidden sm:relative sm:flex-row">
        <div
          data-testid="video-pane"
          ref={$pane}
          className={cn(
            'relative w-full shrink-0 sm:shrink sm:transition-all sm:duration-200',
            chrome.state.isChatOpen && 'sm:w-[calc(100%-var(--player-chat-pane-width))]'
          )}>
          {/* cursor-pointer: see https://github.com/facebook/react/issues/2055 */}
          <div
            data-testid="video-stage"
            className="relative w-full cursor-pointer bg-black bg-cover pb-[56.25%]"
            style={
              state.isInitialized
                ? {}
                : {
                    backgroundImage: `url(${getVideoPreviewImage(party)})`
                  }
            }
            onMouseMove={handleVideoHover}
            onClick={handleVideoClick}>
            <video
              className="pointer-events-none absolute inset-0 size-full sm:static"
              src={party.video.video_url}
              ref={player.$video}
              {...player.events}
            />
          </div>

          {changeEpisodeBuffer && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-center">
              <div className="relative animate-now-playing">
                <div className="mb-1 opacity-75">
                  <h5 className="font-label text-xs font-bold tracking-label uppercase">Now Playing</h5>
                </div>

                <h4 className="text-base font-bold">
                  {party.video.group.title}: {party.video.title}
                </h4>
              </div>
            </div>
          )}

          <AppWatchHomePlayerStateBufferedIndicator isPlaying={state.isPlaying} />

          {state.isBuffering && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/75">
              <UiLoader size="large" />
            </div>
          )}

          {state.isInitialized && (
            <AppWatchHomeSubtitleSlot
              video={party.video}
              isEnabled={chrome.state.isSubtitleEnabled}
              isPlayerOpen={chrome.state.isOpen}
              time={state.time}
            />
          )}

          <AppWatchHomeReactionLayer
            floats={reactions.floats}
            isLifted={chrome.state.isOpen}
            onDone={reactions.remove}
          />

          <AppWatchHomeActivityOverlay
            party={party}
            me={user}
            level={chrome.activityLevel}
            isChatOpen={chrome.state.isChatOpen}
            isLifted={chrome.state.isOpen}
            onOpenChat={chrome.toggleChat}
          />

          <AppWatchHomePlayerControls />

          <AppWatchHomeSeasonSelectionModal
            party={party}
            show={party.video.show}
            isOpen={chrome.state.isSeasonSelectionOpen}
            onClose={chrome.closeSeasonSelection}
            onChangeVideo={handleChangeVideo}
          />
        </div>

        <AppWatchHomeMobileTitleBar party={party} onOpenSeasonSelection={chrome.openSeasonSelection} />

        <AppWatchHomeChatWidget
          party={party}
          isChatOpen={chrome.state.isChatOpen}
          isInvitationOpen={chrome.state.isInvitationOpen}
          isSeasonSelectionOpen={chrome.state.isSeasonSelectionOpen}
          isKeyboardInfoOpen={chrome.state.isKeyboardInfoOpen}
          onOpenInvitationModal={chrome.openInvitation}
          onCloseInvitationModal={chrome.closeInvitation}
          onReact={reactions.send}
        />
      </div>

      {props.children}

      <AppWatchHomeKeyboardInfoModal isOpen={chrome.state.isKeyboardInfoOpen} onClose={chrome.closeKeyboardInfo} />
    </AppWatchHomePlayerContext.Provider>
  )
}
