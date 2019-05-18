import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import PlayerModal from './PlayerModal'

import useUpdateEffect from 'react-use/lib/useUpdateEffect'
import useMount from 'react-use/lib/useMount'
import { useReducer, useEffect, useRef } from 'react'
import { usePartyContext } from '~/screens/app.watch/Context'
import axios from '~lib/axios';

interface State {
  time: number
  isComplete: boolean
  isPlaying: boolean
  isOpen: boolean
}

type Action =
  | ReducerAction<'controls:open'>
  | ReducerAction<'controls:close'>
  | ReducerAction<'controls:seek', { time: number }>
  | ReducerAction<'time-update', { time: number }>
  | ReducerAction<'controls:play'>
  | ReducerAction<'controls:pause'>
  | ReducerAction<'video-complete'>
  | ReducerAction<'sync', { time: number, isPlaying: boolean }>

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
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
  }

  return state
}

/**
 * Use this to create a route instead of typing everything down
 */
function AppWatchHome(props: ReactComponentWrapper) {
  const context = usePartyContext()

  const [state, dispatch] = useReducer(reducer, {
    time: context.party.current_time,
    isComplete: false,
    isPlaying: false,
    isOpen: false
  })

  const $video = useRef<HTMLVideoElement>()

  useEffect(() => {
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

  function handleOpen() {
    dispatch({
      type: 'controls:open'
    })
  }

  function handleClose() {
    dispatch({
      type: 'controls:close'
    })
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
        onClose={handleClose}
        onPlay={handlePlay}
        onSeek={handleSeek}
      />

      <div className="watch-screen">
        <div
          className="watch-screen-video"
          style={{
            backgroundImage: `url(${require('~/assets/show-thumbnail-218x146.jpg')})`
          }}
          onClick={handleOpen}>
          <video src={context.party.video.video_url} ref={$video} onTimeUpdate={handleTimeUpdate} onEnded={handleVideoEnded} />
        </div>

        <div className="watch-screen-chat">
          <div className="watch-screen-chat-group is-self">
            <div className="avatar">
              <UiAvatar img={require('~/assets/dummy-avatar.png')} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">kinda</div>
              </div>

              <div className="message">
                <div className="inner">it wasn't that bad if you ask me. it was just weird.</div>
              </div>
            </div>
          </div>

          <div className="watch-screen-chat-group">
            <div className="avatar">
              <UiAvatar img={require('~/assets/dummy-avatar.png')} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">what'd you think</div>
              </div>

              <div className="message">
                <div className="inner">did you like it?</div>
              </div>

              <div className="message">
                <div className="inner">hey</div>
              </div>
            </div>
          </div>

          <div className="watch-screen-chat-group is-self">
            <div className="avatar">
              <UiAvatar img={require('~/assets/dummy-avatar.png')} />
            </div>

            <div className="messages">
              <div className="message">
                <div className="inner">kinda</div>
              </div>

              <div className="message">
                <div className="inner">it wasn't that bad if you ask me. it was just weird.</div>
              </div>
            </div>
          </div>

          <div className="watch-screen-activity-group">
            <div className="activity">
              <div className="avatar">
                <UiAvatar img={require('~/assets/dummy-avatar.png')} size="sm" />
              </div>

              <h6 className="ui-subheading">Kier left the room.</h6>
            </div>

            <div className="activity">
              <div className="avatar">
                <UiAvatar img={require('~/assets/dummy-avatar.png')} size="sm" />
              </div>

              <h6 className="ui-subheading">Kier joined the room.</h6>
            </div>
          </div>
        </div>

        <div className="watch-screen-chatbar">
          <input type="text" className="ui-input" placeholder="Write something..." />
        </div>
      </div>
      {props.children}
    </React.Fragment>
  )
}

export default AppWatchHome
