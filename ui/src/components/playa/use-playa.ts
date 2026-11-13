import { useEffect, useReducer, useRef, useState } from 'react'
import { useFullscreen } from '~/hooks/use-fullscreen'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import { clamp } from '~/utils/clamp'
import { LINE_MS, MAX_LINES, type PlayaActivity } from './playa-activity'
import { MAX_FLOATS, makePath, type PlayaFloat } from './playa-reactions'

/** Someone in the room, as Playa needs them: a name for labels, an avatar for lines. */
export interface PlayaPerson {
  id: string | number
  name: string
  avatar?: string | null
}

export interface PlayaOptions {
  src: string
  /** Where the video starts, in seconds. */
  initialTime?: number
  /** In seconds, when the caller already knows it; otherwise the video's own. */
  duration?: number
  /** You played, paused or seeked. Never called for `sync()`. */
  onPlayback?: (state: { time: number; isPlaying: boolean }) => void
  /** You reacted. Never called for a reaction with `by`. */
  onReact?: (emoji: string) => void
}

export interface PlayaState {
  time: number
  duration: number
  volume: number
  isPlaying: boolean
  // The video has loaded its first frame; until then the poster shows.
  isReady: boolean
  isBuffering: boolean
  isMuted: boolean
  isSubtitlesOn: boolean
  isFullscreen: boolean
  // The controls are up.
  isOverlayOpen: boolean
  // Something opened from the controls (a menu) keeps them up and the timeline out of its way.
  isOverlayPinned: boolean
}

type ReducerState = Omit<PlayaState, 'isFullscreen' | 'duration'> & { elementDuration: number }

type Action =
  | ReducerAction<'ready'>
  | ReducerAction<'time', { time: number }>
  | ReducerAction<'move', { time: number; isPlaying: boolean }>
  | ReducerAction<'playing', { isPlaying: boolean }>
  | ReducerAction<'ended'>
  | ReducerAction<'buffer', { isBuffering: boolean }>
  | ReducerAction<'duration', { duration: number }>
  | ReducerAction<'source'>
  | ReducerAction<'volume', { volume: number }>
  | ReducerAction<'toggle-mute'>
  | ReducerAction<'toggle-subtitles'>
  | ReducerAction<'overlay', { isOpen: boolean }>
  | ReducerAction<'pin', { isPinned: boolean }>

function reducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'ready':
      return { ...state, isReady: true }
    case 'time':
      return { ...state, time: action.payload.time }
    case 'move':
      return { ...state, time: action.payload.time, isPlaying: action.payload.isPlaying }
    case 'playing':
      return { ...state, isPlaying: action.payload.isPlaying }
    case 'ended':
      return { ...state, isPlaying: false }
    case 'buffer':
      return { ...state, isBuffering: action.payload.isBuffering }
    case 'duration':
      return { ...state, elementDuration: action.payload.duration }
    case 'source':
      return { ...state, isReady: false, isBuffering: false }
    case 'volume':
      return { ...state, volume: action.payload.volume }
    case 'toggle-mute':
      return { ...state, isMuted: !state.isMuted }
    case 'toggle-subtitles':
      return { ...state, isSubtitlesOn: !state.isSubtitlesOn }
    case 'overlay':
      return { ...state, isOverlayOpen: action.payload.isOpen }
    case 'pin':
      return { ...state, isOverlayPinned: action.payload.isPinned }
  }
}

// The controls hide this long after the pointer last moved over the picture.
export const OVERLAY_MS = 5000

let lastId = 0
const nextId = () => String(++lastId)

interface Line {
  activity: PlayaActivity
  until: number
}

/**
 * A watch-together player for one `<video>`: playback, the controls overlay, reaction floats
 * and activity lines. It knows nothing about where moves come from. What you do calls back
 * (`onPlayback`, `onReact`); what others did comes in through `sync()`, `react(emoji, { by })`
 * and `activity()`, and never calls back, so nothing echoes.
 */
export function usePlaya(options: PlayaOptions) {
  const $video = useRef<HTMLVideoElement>(null)
  const latest = useRef(options)
  latest.current = options

  const [state, dispatch] = useReducer(reducer, {
    time: options.initialTime ?? 0,
    elementDuration: 0,
    volume: 1,
    isPlaying: false,
    isReady: false,
    isBuffering: false,
    isMuted: false,
    isSubtitlesOn: true,
    isOverlayOpen: false,
    isOverlayPinned: false
  })
  const [isFullscreen, toggleFullscreen] = useFullscreen()
  const [floats, setFloats] = useState<PlayaFloat[]>([])
  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    // Start where the caller says.
    $video.current!.currentTime = state.time
  }, [])

  // A new source loads from scratch: the poster shows again until its first frame.
  useUpdateEffect(() => {
    dispatch({ type: 'source' })
  }, [options.src])

  useUpdateEffect(() => {
    if (state.isPlaying) $video.current!.play()
    else $video.current!.pause()
  }, [state.isPlaying])

  // Lines leave once their time is up.
  useEffect(() => {
    if (!lines.length) return
    const soonest = Math.min(...lines.map((line) => line.until))
    const timer = setTimeout(
      () => setLines((current) => current.filter((line) => line.until > Date.now())),
      Math.max(0, soonest - Date.now()) + 10
    )
    return () => clearTimeout(timer)
  }, [lines])

  const overlayTimer = useRef<number | undefined>(undefined)
  const isPinned = useRef(false)
  useEffect(() => () => window.clearTimeout(overlayTimer.current), [])

  function armOverlayTimer() {
    window.clearTimeout(overlayTimer.current)
    if (isPinned.current) return
    overlayTimer.current = window.setTimeout(
      () => dispatch({ type: 'overlay', payload: { isOpen: false } }),
      OVERLAY_MS
    )
  }

  function move(next: { time: number; isPlaying: boolean }, isMine: boolean) {
    dispatch({ type: 'move', payload: next })
    $video.current!.currentTime = next.time
    if (isMine) latest.current.onPlayback?.(next)
  }

  function setPlaying(isPlaying: boolean) {
    dispatch({ type: 'playing', payload: { isPlaying } })
    latest.current.onPlayback?.({ time: state.time, isPlaying })
  }

  const duration = options.duration ?? state.elementDuration
  const { elementDuration: _, ...rest } = state

  return {
    $video,
    state: { ...rest, duration, isFullscreen } satisfies PlayaState,
    /** Newest last. */
    floats,
    /** Newest last; at most four, each for 8 seconds. */
    lines: lines.map((line) => line.activity),

    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    toggle: () => setPlaying(!state.isPlaying),
    seek: (time: number) => move({ time, isPlaying: state.isPlaying }, true),
    /** Seconds forward, or back when negative; stays within the video. */
    skip: (by: number) => move({ time: clamp(state.time + by, 0, duration), isPlaying: state.isPlaying }, true),
    /** Someone else's play, pause or seek. Moves the video; never calls back. */
    sync: (next: { time: number; isPlaying: boolean }) => move(next, false),

    setVolume(volume: number) {
      volume = clamp(volume, 0, 1)
      dispatch({ type: 'volume', payload: { volume } })
      $video.current!.volume = volume
    },
    toggleMute() {
      $video.current!.muted = !state.isMuted
      dispatch({ type: 'toggle-mute' })
    },
    toggleSubtitles: () => dispatch({ type: 'toggle-subtitles' }),
    toggleFullscreen,

    /** Floats an emoji over the picture. Without `by` it's yours: labelled "You" and sent through `onReact`. */
    react(emoji: string, from?: { by: PlayaPerson }) {
      const float = { id: nextId(), emoji, name: from?.by.name ?? 'You', path: makePath() }
      setFloats((current) => [...current, float].slice(-MAX_FLOATS))
      if (!from) latest.current.onReact?.(emoji)
    },
    /** For PlayaReactions: a float finished its path. */
    dropFloat: (id: string) => setFloats((current) => current.filter((float) => float.id !== id)),

    /** Shows a line over the picture. Older lines make way past four; each leaves after 8 seconds. */
    activity(activity: PlayaActivity) {
      setLines((current) => [...current, { activity, until: Date.now() + LINE_MS }].slice(-MAX_LINES))
    },
    /** Drops the lines `keep` turns down, or all of them. */
    clearActivity(keep: (activity: PlayaActivity) => boolean = () => false) {
      setLines((current) => {
        const kept = current.filter((line) => keep(line.activity))
        return kept.length === current.length ? current : kept
      })
    },

    overlay: {
      open: () => dispatch({ type: 'overlay', payload: { isOpen: true } }),
      close: () => dispatch({ type: 'overlay', payload: { isOpen: false } }),
      /** Opens the controls and hides them again a while after the pointer stops. */
      peek() {
        dispatch({ type: 'overlay', payload: { isOpen: true } })
        armOverlayTimer()
      },
      /** Keeps the controls up while something opened from them is open. */
      pin(isOpen: boolean) {
        isPinned.current = isOpen
        dispatch({ type: 'pin', payload: { isPinned: isOpen } })
        armOverlayTimer()
      }
    },

    /** Spread onto the `<video>`; PlayaElement does. */
    events: {
      onTimeUpdate: () => dispatch({ type: 'time', payload: { time: $video.current!.currentTime } }),
      onEnded: () => dispatch({ type: 'ended' }),
      onLoadedData() {
        if (!state.isReady) dispatch({ type: 'ready' })
      },
      onDurationChange: () => dispatch({ type: 'duration', payload: { duration: $video.current!.duration || 0 } }),
      onWaiting: () => dispatch({ type: 'buffer', payload: { isBuffering: true } }),
      onPlaying: () => dispatch({ type: 'buffer', payload: { isBuffering: false } })
    }
  }
}

export type Playa = ReturnType<typeof usePlaya>
