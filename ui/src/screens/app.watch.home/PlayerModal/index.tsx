import './style.css'
import * as React from 'react'
import { useRef } from 'react'
import Transition from 'react-addons-css-transition-group'
import UiPlainButton from '~/components/UiPlainButton'
import Slider, { SliderValue } from 'react-input-slider'
import toReadableTime from '~/utils/date/toReadableTime'
import getVideoDetails from '~/utils/shows/getVideoDetails'
import { useMediaMode } from '~/hooks/useMediaMode'

interface Props {
  party: AppParty
  time: number
  getVideoElement: () => HTMLVideoElement
  isOpen: boolean
  isPlaying: boolean
  onClose: () => void
  onPlay: () => void
  onSeek: (time: number) => void
  onOpenSeasonSelection: () => void
}

/**
 * @TODO We might not need to use a modal here since it's only an overlay on desktop screens.
 */
function PlayerModal({ party, ...props }: Props) {
  const overlayRef = useRef<HTMLDivElement>()

  const media = useMediaMode()

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

          <div className="watch-player-actions">
            <div className="section">
              <div className="action is-close">
                <UiPlainButton onClick={props.onClose}>
                  <i className="fa fa-close" />
                </UiPlainButton>
              </div>
            </div>

            <div className="section">
              {/* <div className="action">
              <UiPlainButton>
                <i className="fa fa-comments" />
              </UiPlainButton>
            </div> */}

              {party.video.show.title_type === 'series' && (
                <div className="action">
                  <UiPlainButton onClick={props.onOpenSeasonSelection}>
                    <i className="fa fa-list-ol" />
                  </UiPlainButton>
                </div>
              )}

              <div className="action">
                <UiPlainButton>
                  <i className="fa fa-cog" />
                </UiPlainButton>
              </div>
            </div>
          </div>

          <div className="watch-player-contents">
            <div className="watch-player-controls">
              <div className="control">
                <UiPlainButton onClick={props.onPlay}>
                  {props.isPlaying ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
                </UiPlainButton>
              </div>

              <div className="control">
                <UiPlainButton onClick={handleBackward}>
                  <i className="fa fa-fast-backward" />
                </UiPlainButton>
              </div>

              <div className="control">
                <UiPlainButton onClick={handleForward}>
                  <i className="fa fa-fast-forward" />
                </UiPlainButton>
              </div>

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

            <div className="watch-player-modal-card">
              <div className="meta">
                <h6 className="ui-subheading">{getVideoDetails(party.video)}</h6>
              </div>

              <h2 className="title">{party.video.show.title}</h2>
              <p className="summary">{party.video.show.synopsis}</p>
            </div>
          </div>
        </div>
      )}
    </Transition>
  )
}

export default PlayerModal
