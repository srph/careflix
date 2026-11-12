import { useInvitationOverlay } from '~/screens/app/app-invitation-modal/app-invitation-modal-context'

import * as React from 'react'
import { cn } from '~/utils/cn'
import { UiLoader } from '~/components/ui-loader/ui-loader'
import { AppWatchHomePlayerModal } from './app-watch-home-player-modal'
import { AppWatchHomeChatWidget } from './app-watch-home-chat-widget/app-watch-home-chat-widget'
import { AppWatchHomeSubtitleSlot } from './app-watch-home-subtitle-slot/app-watch-home-subtitle-slot'
import { AppWatchHomeSeasonSelectionModal } from './app-watch-home-season-selection-modal'
import { AppWatchHomeMobileTitleBar } from './app-watch-home-mobile-title-bar'
import { AppWatchHomePlayerStateBufferedIndicator } from './app-watch-home-player-state-buffered-indicator'
import { AppWatchHomeKeyboardInfoModal } from './app-watch-home-keyboard-info-modal'
import { AppWatchHomeReactionLayer } from './app-watch-home-reaction-layer'
import { useReactions } from './use-reactions'
import { AppWatchHomeActivityOverlay } from './app-watch-home-activity-overlay'
import { showsReactions, useActivityLevel } from './app-watch-home-activity-level'

import { useUpdateEffect } from '~/hooks/use-update-effect'
import { useReducer, useEffect, useRef } from 'react'
import { usePartyContext } from '~/screens/app.watch/use-party-context'
import { useAuth } from '~/contexts/auth/auth'
import { useBufferState } from '~/hooks/use-buffer-state'
import { useMediaMode } from '~/hooks/use-media-mode'
import { useRouterBlock } from '~/hooks/use-router-block'
import { axios } from '~/lib/axios/axios'

import { getVideoPreviewImage } from '~/utils/shows/get-video-preview-image'

interface State {
  time: number
  volume: number
  isComplete: boolean
  isPlaying: boolean
  isOpen: boolean
  isInitialized: boolean
  isBuffering: boolean
  isSeasonSelectionOpen: boolean
  isChatOpen: boolean
  isInvitationOpen: boolean
  isKeyboardInfoOpen: boolean
  isMuted: boolean
  isSubtitleEnabled: boolean
}

type Action =
  | ReducerAction<'init'>
  | ReducerAction<'controls:open'>
  | ReducerAction<'controls:close'>
  | ReducerAction<'controls:seek', { time: number }>
  | ReducerAction<'time-update', { time: number }>
  | ReducerAction<'controls:play'>
  | ReducerAction<'controls:pause'>
  | ReducerAction<'video-complete'>
  | ReducerAction<'sync', { time: number; isPlaying: boolean }>
  | ReducerAction<'buffer', { isBuffering: boolean }>
  | ReducerAction<'change-video'>
  | ReducerAction<'change-volume', { volume: number }>
  | ReducerAction<'season-selection:toggle', { isSeasonSelectionOpen: boolean }>
  | ReducerAction<'invitation-modal:toggle', { isInvitationOpen: boolean }>
  | ReducerAction<'keyboard-info-modal:toggle', { isKeyboardInfoOpen: boolean }>
  | ReducerAction<'toggle-chat'>
  | ReducerAction<'toggle-mute'>
  | ReducerAction<'toggle-subtitle'>

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'init': {
      return {
        ...state,
        isInitialized: true
      }
    }

    case 'controls:open': {
      return {
        ...state,
        isOpen: true
      }
    }

    case 'controls:close': {
      return {
        ...state,
        isOpen: false
      }
    }

    case 'controls:seek': {
      return {
        ...state,
        time: action.payload.time
      }
    }

    case 'controls:play': {
      return {
        ...state,
        isPlaying: !state.isPlaying
      }
    }

    case 'sync': {
      return {
        ...state,
        isPlaying: action.payload.isPlaying,
        time: action.payload.time
      }
    }

    case 'video-complete': {
      return {
        ...state,
        isPlaying: false,
        isComplete: false
      }
    }

    case 'time-update': {
      return {
        ...state,
        time: action.payload.time
      }
    }

    case 'buffer': {
      return {
        ...state,
        isBuffering: action.payload.isBuffering
      }
    }

    case 'change-video': {
      return {
        ...state,
        isInitialized: false,
        isBuffering: false
      }
    }

    case 'change-volume': {
      return {
        ...state,
        volume: action.payload.volume
      }
    }

    case 'season-selection:toggle': {
      return {
        ...state,
        isSeasonSelectionOpen: action.payload.isSeasonSelectionOpen
      }
    }

    case 'invitation-modal:toggle': {
      return {
        ...state,
        isInvitationOpen: action.payload.isInvitationOpen
      }
    }

    case 'keyboard-info-modal:toggle': {
      return {
        ...state,
        isKeyboardInfoOpen: action.payload.isKeyboardInfoOpen
      }
    }

    case 'toggle-chat': {
      return {
        ...state,
        isChatOpen: !state.isChatOpen
      }
    }

    case 'toggle-mute': {
      return {
        ...state,
        isMuted: !state.isMuted
      }
    }

    case 'toggle-subtitle': {
      return {
        ...state,
        isSubtitleEnabled: !state.isSubtitleEnabled
      }
    }
  }

  return state
}

/**
 * @TODO Sync time every 5 minutes or so.
 */
export function AppWatchHomePage(props: ReactComponentWrapper) {
  const context = usePartyContext()
  const auth = useAuth()
  const [activityLevel, setActivityLevel] = useActivityLevel(auth.data.id)
  const { registerPlayer } = useInvitationOverlay()

  const [state, dispatch] = useReducer(reducer, {
    time: context.party.current_time,
    volume: 1,
    isComplete: false,
    isPlaying: false,
    isOpen: false,
    isInitialized: false,
    isBuffering: false,
    isSeasonSelectionOpen: false,
    isChatOpen: true,
    isInvitationOpen: false,
    isKeyboardInfoOpen: false,
    isMuted: false,
    isSubtitleEnabled: Boolean(context.party.video.subtitle_url)
  })

  // Other people's floats follow the Activity Overlay level while chat is closed.
  const reactions = useReactions(context.party, auth.data, showsReactions(activityLevel, state.isChatOpen))

  const $video = useRef<HTMLVideoElement>(null)
  const $pane = useRef<HTMLDivElement>(null)

  useEffect(() => {
    registerPlayer({ partyId: context.party.id, element: $pane.current })
    return () => registerPlayer(null)
  }, [context.party.id, registerPlayer])

  const media = useMediaMode()

  useEffect(() => {
    // Initialize the video to start on the current time.
    $video.current.currentTime = state.time
  }, [])

  // Presence refreshes must not rewind playback. Each state event still syncs,
  // even when its timestamp and play/pause values match the previous event.
  useUpdateEffect(() => {
    dispatch({
      type: 'sync',
      payload: {
        time: context.party.current_time,
        isPlaying: context.party.is_playing
      }
    })

    $video.current.currentTime = context.party.current_time
  }, [context.playbackRevision])

  useUpdateEffect(() => {
    if (state.isPlaying) {
      if (state.isComplete) {
        dispatch({
          type: 'time-update',
          payload: { time: 0 }
        })

        $video.current.currentTime = 0
      }

      $video.current.play()
    } else {
      $video.current.pause()
    }
  }, [state.isPlaying])

  // Used to show the change episode notice momentarily
  const [changeEpisodeBuffer, displayChangeEpisodeBuffer] = useBufferState({
    timeout: 4000
  })

  useUpdateEffect(() => {
    // We're not putting any other conditions here (if it's a series, etc.)
    // because we're in the assumption that only series will have a change
    // of videos.
    dispatch({ type: 'change-video' })

    displayChangeEpisodeBuffer()
  }, [context.party.video.id])

  function handleVideoClick() {
    if (media === 'desktop') {
      // If it's open, most probably it's been opened through hover (desktop).
      // On desktop, we want overlay clicks to toggle play; for mobile screens,
      // we want overlays to open the overlay.
      return handlePlay()
    }

    dispatch({
      type: 'controls:open'
    })
  }

  const timeoutRef = useRef<number>(null)

  function handleVideoHover() {
    // We don't want this event to be called on mobile.
    if (media === 'mobile') {
      return
    }

    // No worries about optimizing this since `onMouseMove` no longer fires
    // after we've opened the overlay; the overlay contains the entire player.
    dispatch({
      type: 'controls:open'
    })

    armControlsTimeout()
  }

  // The controls hide a while after the pointer last moved over the picture,
  // except while the Activity Overlay menu is open from them.
  const isActivityMenuOpenRef = useRef(false)

  function armControlsTimeout() {
    window.clearTimeout(timeoutRef.current)
    if (isActivityMenuOpenRef.current) return

    timeoutRef.current = window.setTimeout(() => {
      dispatch({
        type: 'controls:close'
      })
    }, 5000)
  }

  function handleActivityMenuOpenChange(open: boolean) {
    isActivityMenuOpenRef.current = open
    armControlsTimeout()
  }

  function handleOverlayClose() {
    // FYI, AppWatchHomePlayerModal lets overlay clicks to pass through to the video.
    // In turn, handleVideoOpen handles the proper action for desktop/mobile.
    dispatch({
      type: 'controls:close'
    })
  }

  function handleVideoLoadedData() {
    if (!state.isInitialized) {
      dispatch({ type: 'init' })
    }
  }

  function handleSeek(time: number) {
    dispatch({
      type: 'controls:seek',
      payload: { time }
    })

    $video.current.currentTime = time

    axios.put(`/api/parties/${context.party.id}/state`, {
      is_playing: state.isPlaying,
      current_time: time
    })
  }

  function handlePlay() {
    dispatch({
      type: 'controls:play'
    })

    axios.put(`/api/parties/${context.party.id}/state`, {
      is_playing: !state.isPlaying,
      current_time: state.time
    })
  }

  function handleTimeUpdate() {
    dispatch({
      type: 'time-update',
      payload: { time: $video.current.currentTime }
    })
  }

  function handleVideoEnded() {
    dispatch({
      type: 'video-complete'
    })
  }

  useRouterBlock(
    location => {
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

  function handleVideoBufferStart() {
    dispatch({
      type: 'buffer',
      payload: { isBuffering: true }
    })
  }

  function handleVideoBufferEnd() {
    dispatch({
      type: 'buffer',
      payload: { isBuffering: false }
    })
  }

  function handleSeasonSelectionOpen() {
    dispatch({
      type: 'season-selection:toggle',
      payload: { isSeasonSelectionOpen: true }
    })
  }

  function handleSeasonSelectionClose() {
    dispatch({
      type: 'season-selection:toggle',
      payload: { isSeasonSelectionOpen: false }
    })
  }

  function handleInvitationOpen() {
    dispatch({
      type: 'invitation-modal:toggle',
      payload: { isInvitationOpen: true }
    })
  }

  function handleInvitationClose() {
    dispatch({
      type: 'invitation-modal:toggle',
      payload: { isInvitationOpen: false }
    })
  }

  function handleKeyboardInfoOpen() {
    dispatch({
      type: 'keyboard-info-modal:toggle',
      payload: { isKeyboardInfoOpen: true }
    })
  }

  function handleKeyboardInfoClose() {
    dispatch({
      type: 'keyboard-info-modal:toggle',
      payload: { isKeyboardInfoOpen: false }
    })
  }

  function handleChangeVideo(party: AppParty) {
    dispatch({
      type: 'season-selection:toggle',
      payload: { isSeasonSelectionOpen: false }
    })

    handleOverlayClose()

    context.onChangeVideo(party)
  }

  function handleToggleChat() {
    dispatch({
      type: 'toggle-chat'
    })
  }

  function handleChangeVolume(volume: number) {
    volume = Math.max(0, Math.min(volume, 1))

    dispatch({
      type: 'change-volume',
      payload: { volume }
    })

    $video.current.volume = volume
  }

  function handleToggleMute() {
    $video.current.muted = !state.isMuted
    
    dispatch({
      type: 'toggle-mute'
    })
  }


  function handleToggleSubtitle() {
    dispatch({
      type: 'toggle-subtitle'
    })
  }

  return (
    <React.Fragment>

      {/* Phones stack the picture, title bar and chat. From `sm` the picture fills the window and the chat slides in beside it. */}
      <div className="flex h-(--window-vh) w-screen flex-col overflow-hidden sm:relative sm:flex-row">
        <div
          data-testid="video-pane" ref={$pane}
          className={cn('relative w-full shrink-0 sm:shrink sm:transition-all sm:duration-200', state.isChatOpen && 'sm:w-[calc(100%-var(--player-chat-pane-width))]')}>
          {/* cursor-pointer: see https://github.com/facebook/react/issues/2055 */}
          <div
            data-testid="video-stage" className="relative w-full cursor-pointer bg-black bg-cover pb-[56.25%]"
            style={
              state.isInitialized
                ? {}
                : {
                    backgroundImage: `url(${getVideoPreviewImage(context.party)})`
                  }
            }
            onMouseMove={handleVideoHover}
            onClick={handleVideoClick}>
            <video
              className="pointer-events-none absolute inset-0 size-full sm:static"
              src={context.party.video.video_url}
              ref={$video}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onLoadedData={handleVideoLoadedData}
              onWaiting={handleVideoBufferStart}
              onPlaying={handleVideoBufferEnd}
            />
          </div>

          {changeEpisodeBuffer && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-center">
              <div className="relative animate-now-playing">
                <div className="mb-1 opacity-75">
                  <h5 className="font-label text-xs font-bold tracking-label uppercase">Now Playing</h5>
                </div>

                <h4 className="text-base font-bold">
                  {context.party.video.group.title}: {context.party.video.title}
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
            <AppWatchHomeSubtitleSlot video={context.party.video} isEnabled={state.isSubtitleEnabled} isPlayerOpen={state.isOpen} time={state.time} />
          )}

          <AppWatchHomeReactionLayer floats={reactions.floats} isLifted={state.isOpen} onDone={reactions.remove} />

          <AppWatchHomeActivityOverlay
            party={context.party}
            me={auth.data}
            level={activityLevel}
            isChatOpen={state.isChatOpen}
            isLifted={state.isOpen}
            onOpenChat={handleToggleChat}
          />

          <AppWatchHomePlayerModal
            party={context.party}
            time={state.time}
            volume={state.volume}
            getVideoElement={() => $video.current}
            isOpen={state.isOpen}
            isPlaying={state.isPlaying}
            isChatOpen={state.isChatOpen}
            isMuted={state.isMuted}
            isSeasonSelectionOpen={state.isSeasonSelectionOpen}
            isInvitationOpen={state.isInvitationOpen}
            isKeyboardInfoOpen={state.isKeyboardInfoOpen}
            isSubtitleEnabled={state.isSubtitleEnabled}
            activityLevel={activityLevel}
            onChangeActivityLevel={setActivityLevel}
            onActivityMenuOpenChange={handleActivityMenuOpenChange}
            onClose={handleOverlayClose}
            onPlay={handlePlay}
            onSeek={handleSeek}
            onOpenSeasonSelection={handleSeasonSelectionOpen}
            onOpenKeyboardInfo={handleKeyboardInfoOpen}
            onCloseKeyboardInfo={handleKeyboardInfoClose}
            onChangeVolume={handleChangeVolume}
            onToggleChat={handleToggleChat}
            onToggleMute={handleToggleMute}
            onToggleSubtitle={handleToggleSubtitle}
          />

          <AppWatchHomeSeasonSelectionModal
            party={context.party}
            show={context.party.video.show}
            isOpen={state.isSeasonSelectionOpen}
            onClose={handleSeasonSelectionClose}
            onChangeVideo={handleChangeVideo}
          />
        </div>

        <AppWatchHomeMobileTitleBar party={context.party} onOpenSeasonSelection={handleSeasonSelectionOpen} />

        <AppWatchHomeChatWidget
          party={context.party}
          isChatOpen={state.isChatOpen}
          isInvitationOpen={state.isInvitationOpen}
          isSeasonSelectionOpen={state.isSeasonSelectionOpen}
          isKeyboardInfoOpen={state.isKeyboardInfoOpen}
          onOpenInvitationModal={handleInvitationOpen}
          onCloseInvitationModal={handleInvitationClose}
          onReact={reactions.send}
        />
      </div>

      {props.children}

      <AppWatchHomeKeyboardInfoModal isOpen={state.isKeyboardInfoOpen} onClose={handleKeyboardInfoClose} />
    </React.Fragment>
  )
}
