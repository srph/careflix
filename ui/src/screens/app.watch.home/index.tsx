import './style'

import * as React from 'react'
import cx from 'classnames'
import BodyClassName from 'react-body-classname'
import UiLoader from '~/components/UiLoader'
import PlayerModal from './PlayerModal'
import ChatWidget from './ChatWidget'
import SubtitleSlot from './SubtitleSlot'
import SeasonSelectionModal from './SeasonSelectionModal'
import MobileTitleBar from './MobileTitleBar'
import PlayerStateBufferedIndicator from './PlayerStateBufferedIndicator'

import useUpdateEffect from 'react-use/lib/useUpdateEffect'
import { useReducer, useEffect, useRef } from 'react'
import { usePartyContext } from '~/screens/app.watch/Context'
import { useBufferState } from '~/hooks/useBufferState'
import { useMediaMode } from '~/hooks/useMediaMode'
import { useRouterBlock } from '~/hooks/useRouterBlock'
import axios from '~lib/axios'

import getVideoPreviewImage from '~/utils/shows/getVideoPreviewImage'

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
  isMuted: boolean
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
  | ReducerAction<'toggle-chat'>
  | ReducerAction<'toggle-mute'>

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
  }

  return state
}

/**
 * @TODO Sync time every 5 minutes or so.
 */
function AppWatchHome(props: ReactComponentWrapper) {
  const context = usePartyContext()

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
    isMuted: false
  })

  const $video = useRef<HTMLVideoElement>()

  const media = useMediaMode()

  useEffect(() => {
    // Initialize the video to start on the current time.
    $video.current.currentTime = state.time
  }, [])

  useUpdateEffect(() => {
    dispatch({
      type: 'sync',
      payload: {
        time: context.party.current_time,
        isPlaying: context.party.is_playing
      }
    })

    $video.current.currentTime = context.party.current_time
  }, [context.party])

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

    window.clearTimeout(timeoutRef.current)

    timeoutRef.current = window.setTimeout(() => {
      dispatch({
        type: 'controls:close'
      })
    }, 2000)
  }

  function handleOverlayClose() {
    // FYI, PlayerModal lets overlay clicks to pass through to the video.
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
    console.log('haha')

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

  return (
    <React.Fragment>
      <BodyClassName className="watch-screen-html-body" />

      <div className="watch-screen">
        <div
          className={cx('watch-screen-video', {
            'has-overlay': changeEpisodeBuffer,
            'is-chat-open': state.isChatOpen
          })}>
          <div
            className="container"
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
            <div className="watch-screen-message">
              <div className="content">
                <div className="status">
                  <h5 className="ui-subheading">Now Playing</h5>
                </div>

                <h4>
                  {context.party.video.group.title}: {context.party.video.title}
                </h4>
              </div>
            </div>
          )}

          <PlayerStateBufferedIndicator isPlaying={state.isPlaying} />

          {state.isBuffering && (
            <div className="watch-screen-video-loader">
              <UiLoader size="large" />
            </div>
          )}

          {state.isInitialized && (
            <SubtitleSlot video={context.party.video} isPlayerOpen={state.isOpen} time={state.time} />
          )}

          <PlayerModal
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
            onClose={handleOverlayClose}
            onPlay={handlePlay}
            onSeek={handleSeek}
            onOpenSeasonSelection={handleSeasonSelectionOpen}
            onChangeVolume={handleChangeVolume}
            onToggleChat={handleToggleChat}
            onToggleMute={handleToggleMute}
          />

          <SeasonSelectionModal
            party={context.party}
            show={context.party.video.show}
            isOpen={log(state.isSeasonSelectionOpen)}
            onClose={handleSeasonSelectionClose}
            onChangeVideo={handleChangeVideo}
          />
        </div>

        <MobileTitleBar party={context.party} onOpenSeasonSelection={handleSeasonSelectionOpen} />

        <ChatWidget
          party={context.party}
          isChatOpen={state.isChatOpen}
          isInvitationOpen={state.isInvitationOpen}
          isSeasonSelectionOpen={state.isSeasonSelectionOpen}
          onOpenInvitationModal={handleInvitationOpen}
          onCloseInvitationModal={handleInvitationClose}
        />
      </div>

      {props.children}
    </React.Fragment>
  )
}

function log(value) {
  console.log(value)
  return value
}

export default AppWatchHome
