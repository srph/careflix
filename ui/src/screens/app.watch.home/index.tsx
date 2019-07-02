import './style'

import * as React from 'react'
import PlayerModal from './PlayerModal'
import ChatWidget from './ChatWidget'
import SubtitleSlot from './SubtitleSlot'

import useUpdateEffect from 'react-use/lib/useUpdateEffect'
import { useReducer, useEffect, useRef } from 'react'
import { usePartyContext } from '~/screens/app.watch/Context'
import { useBufferState } from '~/hooks/useBufferState'
import { useMediaMode } from '~/hooks/useMediaMode'
import axios from '~lib/axios'

import getVideoPreviewImage from '~/utils/shows/getVideoPreviewImage'

interface State {
  time: number
  isComplete: boolean
  isPlaying: boolean
  isOpen: boolean
  isInitialized: boolean
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
    isComplete: false,
    isPlaying: false,
    isOpen: false,
    isInitialized: false
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
    displayChangeEpisodeBuffer()
  }, [context.party.video.id])

  function handleVideoClick() {
    if (state.isOpen) {
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

    // @TODO Optimize by debounce since this event is called every mouse move.
    // For now, this is the least we can do so it's not "rerendering" all the fucking time.
    if (!state.isOpen) {
      dispatch({
        type: 'controls:open'
      })
    }

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

  return (
    <React.Fragment>
      <PlayerModal
        party={context.party}
        time={state.time}
        isOpen={state.isOpen}
        isPlaying={state.isPlaying}
        onClose={handleOverlayClose}
        onPlay={handlePlay}
        onSeek={handleSeek}
        onChangeVideo={context.onChangeVideo}
      />

      <div className="watch-screen">
        <div
          className="watch-screen-video"
          style={state.isInitialized ? {} : {
            backgroundImage: `url(${getVideoPreviewImage(context.party)})`
          }}
          onClick={handleVideoClick}
          onMouseMove={handleVideoHover}>
          <video
            src={context.party.video.video_url}
            ref={$video}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onLoadedData={handleVideoLoadedData}
          />

          {changeEpisodeBuffer && (
            <div className="watch-screen-message">
              <div className="status">
                <h5 className="ui-subheading">
                  Now Playing
                </h5>
              </div>

              <h4>{context.party.video.group.title}: {context.party.video.title}</h4>
            </div>
          )}

          {state.isInitialized && <SubtitleSlot video={context.party.video} isPlayerOpen={state.isOpen} time={state.time} />}
        </div>

        <ChatWidget party={context.party} />
      </div>
      {props.children}
    </React.Fragment>
  )
}

export default AppWatchHome
