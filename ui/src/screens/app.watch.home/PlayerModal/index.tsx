import './style.css'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiPlainButton from '~/components/UiPlainButton'
import Slider, { SliderValue } from 'react-input-slider'

import toReadableTime from '~/utils/date/toReadableTime'
import getAirDetails from '~/utils/shows/getAirDetails';

interface Props {
  party: AppParty
  time: number
  isOpen: boolean
  isPlaying: boolean
  onClose: () => void
  onPlay: () => void
  onSeek: (time: number) => void
}

function PlayerModal({ party, ...props }: Props) {
  function handleSeek({ x }: SliderValue) {
    props.onSeek(x)
  }

  function handleForward() {
    props.onSeek(Math.min(props.time + 10, party.video.duration))
  }

  function handleBackward() {
    props.onSeek(Math.max(props.time - 10, 0))
  }

  return (
    <UiModal isOpen={props.isOpen} shouldCloseOnOverlayClick={true} onClose={props.onClose}>
      <div className="watch-player-modal">
        <div className="watch-player-actions">
          <div className="section">
            <div className="action">
              <UiPlainButton onClick={props.onClose}>
                <i className="fa fa-close" />
              </UiPlainButton>
            </div>
          </div>

          <div className="section">
            <div className="action">
              <UiPlainButton>
                <i className="fa fa-comments" />
              </UiPlainButton>
            </div>

            <div className="action">
              <UiPlainButton>
                <i className="fa fa-cc" />
              </UiPlainButton>
            </div>
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
              <Slider axis="x" x={props.time} xmin={0} xmax={party.video.duration} onChange={handleSeek} />
            </div>

            <div className="time">{toReadableTime(party.video.duration)}</div>
          </div>

          <div className="watch-player-modal-card">
            <div className="meta">
              <h6 className="ui-subheading">
                {getAirDetails(party.video)}
              </h6>
            </div>

            <h2 className="title">{party.video.show.title}</h2>
            <p className="summary">{party.video.show.synopsis}</p>
          </div>
        </div>
      </div>
    </UiModal>
  )
}

export default PlayerModal
