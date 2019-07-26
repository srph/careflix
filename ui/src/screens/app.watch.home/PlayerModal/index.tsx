import './style.css'
import * as React from 'react'
import { useRef, useEffect } from 'react'
import Transition from 'react-addons-css-transition-group'
import UiPlainButton from '~/components/UiPlainButton'
import Slider, { SliderValue } from 'react-input-slider'
import toReadableTime from '~/utils/date/toReadableTime'
import getVideoDetails from '~/utils/shows/getVideoDetails'
import { Link } from 'react-router-dom'
import { useMediaMode } from '~/hooks/useMediaMode'
import { useFullscreen } from '~/hooks/useFullscreen'

interface Props {
  party: AppParty
  time: number
  getVideoElement: () => HTMLVideoElement
  isOpen: boolean
  isPlaying: boolean
  isChatOpen: boolean
  onClose: () => void
  onPlay: () => void
  onSeek: (time: number) => void
  onOpenSeasonSelection: () => void
  onToggleChat: () => void
}

/**
 * @TODO We might not need to use a modal here since it's only an overlay on desktop screens.
 */
function PlayerModal({ party, ...props }: Props) {
  const overlayRef = useRef<HTMLDivElement>()

  const media = useMediaMode()

  const [isFullscreen, toggleIsFullsceen] = useFullscreen()

  useEffect(() => {
    return () => {
      if (isFullscreen) {
        toggleIsFullsceen()
      }
    }
  }, [])

  function handleSeek({ x }: SliderValue) {
    props.onSeek(x)
  }

  function handleForward() {
    props.onSeek(Math.min(props.time + 10, party.video.duration))
  }

  function handleBackward() {
    props.onSeek(Math.max(props.time - 10, 0))
  }

  function handleClickOverlay(evt: React.MouseEvent<HTMLDivElement>) {
    if (media === 'desktop') {
      props.getVideoElement().click()
    } else {
      props.onClose()
    }
  }

  return (
    <Transition
      component="div"
      transitionName={{
        enter: '-enter',
        leave: '-leave'
      }}
      transitionEnterTimeout={100}
      transitionLeaveTimeout={100}>
      {props.isOpen && (
        <div className="watch-player-container">
          <div className="watch-player-overlay" ref={overlayRef} onClick={handleClickOverlay} />

          <Link to="/" className="watch-player-browse">
            <span className="icon">
              <i className="fa fa-long-arrow-left" />
            </span>

            Back to Browse
          </Link>

          <div className="watch-player-mobile-actions">
            <UiPlainButton className="action" onClick={handleBackward}>
              <i className="fa fa-backward" />
            </UiPlainButton>

            <UiPlainButton className="play" onClick={props.onPlay}>
              {props.isPlaying ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
            </UiPlainButton>

            <UiPlainButton className="action" onClick={handleForward}>
              <i className="fa fa-forward" />
            </UiPlainButton>
          </div>

          <div className="watch-player-contents">
            <div className="watch-player-controls">
              <div className="time">
                {toReadableTime(props.time, {
                  max: party.video.duration > 3600 ? 'hh' : 'mm'
                })}
              </div>

              <div className="slider">
                <Slider
                  axis="x"
                  x={props.time}
                  xmin={0}
                  xmax={party.video.duration}
                  onChange={handleSeek}
                  styles={{ track: { width: '100%' } }}
                />
              </div>

              <div className="time">{toReadableTime(party.video.duration)}</div>
            </div>

            <div className="watch-player-modal-actions">
              <div className="section">
                <div className="action">
                  <UiPlainButton className="icon" onClick={props.onPlay}>
                    {props.isPlaying ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
                  </UiPlainButton>
                </div>

                <div className="action">
                  <UiPlainButton className="icon" onClick={handleBackward}>
                    <i className="fa fa-backward" />
                  </UiPlainButton>
                </div>

                <div className="action">
                  <UiPlainButton className="icon" onClick={handleForward}>
                    <i className="fa fa-forward" />
                  </UiPlainButton>
                </div>

                <div className="action">
                  <UiPlainButton className="icon">
                    <i className="fa fa-volume-up" />
                  </UiPlainButton>
                </div>

                <h3 className="watch-player-modal-title">
                  <span className="title">Boku no Hero Academia</span>
                  <span className="info">Season 1: Episode 2</span>
                </h3>
              </div>

              <div className="section">
                <div className="action">
                  <UiPlainButton className="icon">
                    <i className="fa fa-info-circle" />
                  </UiPlainButton>
                </div>

                <div className="action">
                  <UiPlainButton className="icon">
                    <i className="fa fa-cog" />
                  </UiPlainButton>
                </div>

                <div className="action" onClick={toggleIsFullsceen}>
                  <UiPlainButton className="icon">
                    {isFullscreen ? <i className="fa fa-compress" /> : <i className="fa fa-expand" />}
                  </UiPlainButton>
                </div>

                <div className="action">
                  <UiPlainButton className="icon" onClick={props.onToggleChat}>
                    {props.isChatOpen ? <i className="fa fa-comment-o" /> : <i className="fa fa-comment" />}
                  </UiPlainButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Transition>
  )
}

export default PlayerModal
