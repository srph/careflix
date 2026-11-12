import { useEffect, useReducer, useRef } from 'react'
import { usePusher } from '~/hooks/use-pusher'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import { setPlayback } from '~/screens/app.watch/app-watch-party-updates'
import { useSetParty, useSyncStateMutation } from '~/screens/app.watch/queries/app-watch-party-queries'

interface State {
  time: number
  volume: number
  isComplete: boolean
  isPlaying: boolean
  isInitialized: boolean
  isBuffering: boolean
  isMuted: boolean
}

type Action =
  | ReducerAction<'init'>
  | ReducerAction<'seek', { time: number }>
  | ReducerAction<'time-update', { time: number }>
  | ReducerAction<'play'>
  | ReducerAction<'video-complete'>
  | ReducerAction<'sync', { time: number; isPlaying: boolean }>
  | ReducerAction<'buffer', { isBuffering: boolean }>
  | ReducerAction<'change-video'>
  | ReducerAction<'change-volume', { volume: number }>
  | ReducerAction<'toggle-mute'>

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'init':
      return { ...state, isInitialized: true }
    case 'seek':
    case 'time-update':
      return { ...state, time: action.payload.time }
    case 'play':
      return { ...state, isPlaying: !state.isPlaying }
    case 'sync':
      return { ...state, isPlaying: action.payload.isPlaying, time: action.payload.time }
    case 'video-complete':
      return { ...state, isPlaying: false, isComplete: false }
    case 'buffer':
      return { ...state, isBuffering: action.payload.isBuffering }
    case 'change-video':
      return { ...state, isInitialized: false, isBuffering: false }
    case 'change-volume':
      return { ...state, volume: action.payload.volume }
    case 'toggle-mute':
      return { ...state, isMuted: !state.isMuted }
  }

  return state
}

/**
 * Keeps the `<video>` and the room in step: your play and seek go to the server, and the server's
 * state events (everyone's play and seek) move your video.
 */
export function usePlayerSync(party: AppParty) {
  const $video = useRef<HTMLVideoElement>(null)
  const setParty = useSetParty(party.id)
  const syncState = useSyncStateMutation(party.id)

  const [state, dispatch] = useReducer(reducer, {
    time: party.current_time,
    volume: 1,
    isComplete: false,
    isPlaying: false,
    isInitialized: false,
    isBuffering: false,
    isMuted: false
  })

  useEffect(() => {
    // Initialize the video to start on the current time.
    $video.current!.currentTime = state.time
  }, [])

  function sync(time: number, isPlaying: boolean) {
    dispatch({ type: 'sync', payload: { time, isPlaying } })

    $video.current!.currentTime = time
  }

  // Every state event syncs, even when its time and play/pause match the previous one.
  usePusher(`private-party.${party.id}`, 'state', (event: { state: AppPartyState }) => {
    setParty((current) => setPlayback(current, event.state))
    sync(event.state.current_time, event.state.is_playing)
  })

  // A new video starts where the server says. This waits for the render that swaps the source,
  // which would otherwise undo the seek.
  useUpdateEffect(() => {
    sync(party.current_time, party.is_playing)
  }, [party.video.id])

  useUpdateEffect(() => {
    if (state.isPlaying) {
      if (state.isComplete) {
        dispatch({ type: 'time-update', payload: { time: 0 } })

        $video.current!.currentTime = 0
      }

      $video.current!.play()
    } else {
      $video.current!.pause()
    }
  }, [state.isPlaying])

  useUpdateEffect(() => {
    dispatch({ type: 'change-video' })
  }, [party.video.id])

  return {
    $video,
    state,
    play() {
      dispatch({ type: 'play' })
      syncState.mutate({ is_playing: !state.isPlaying, current_time: state.time })
    },
    seek(time: number) {
      dispatch({ type: 'seek', payload: { time } })
      $video.current!.currentTime = time
      syncState.mutate({ is_playing: state.isPlaying, current_time: time })
    },
    changeVolume(volume: number) {
      volume = Math.max(0, Math.min(volume, 1))
      dispatch({ type: 'change-volume', payload: { volume } })
      $video.current!.volume = volume
    },
    toggleMute() {
      $video.current!.muted = !state.isMuted
      dispatch({ type: 'toggle-mute' })
    },
    /** After picking a video: the same one keeps its source, so it syncs straight away; a new one syncs once it renders. */
    changedVideo(next: AppParty) {
      if (String(next.video.id) === String(party.video.id)) sync(next.current_time, next.is_playing)
    },
    /** Spread onto the `<video>`. */
    events: {
      onTimeUpdate() {
        dispatch({ type: 'time-update', payload: { time: $video.current!.currentTime } })
      },
      onEnded() {
        dispatch({ type: 'video-complete' })
      },
      onLoadedData() {
        if (!state.isInitialized) dispatch({ type: 'init' })
      },
      onWaiting() {
        dispatch({ type: 'buffer', payload: { isBuffering: true } })
      },
      onPlaying() {
        dispatch({ type: 'buffer', payload: { isBuffering: false } })
      }
    }
  }
}

export type PlayerSync = ReturnType<typeof usePlayerSync>
