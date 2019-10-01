import './style.css'
import * as React from 'react'
import { useState, useEffect } from 'react'
import cx from 'classnames'
import UiPlainButton from '~/components/UiPlainButton'
import UiInputSlider from '~/components/UiInputSlider'
import PlayerTooltip from '../PlayerTooltip'

interface Props {
  volume: number
  // @TODO Remove this in-case we don't use it for 
  // https://github.com/swiftcarrot/react-input-slider/pull/47
  // https://www.notion.so/Improve-volume-handle-to-not-close-when-we-re-still-dragging-eb8b056b918e4efbb04999a29cfb7552
  isOpen: boolean
  isMuted: boolean
  isOverlayOpen: boolean
  onOpen: () => void
  onClose: () => void
  onChangeVolume: (volume: number) => void
  onToggleMute: () => void
  onOpenTooltip: () => void
  onCloseTooltip: () => void
}

function VolumeControl(props: Props) {
  const [isHovered, setIsHovered] = useState(false)

  const onMouseEnter = () => setIsHovered(true)
  const onMouseLeave = () => setIsHovered(false)

  return (
    <div
      className={cx('app-watch-volume-control-action', {
        'is-muted': props.isMuted
      })}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div className="icon">
        <PlayerTooltip
          text={props.isMuted ? 'Unmute' : 'Mute'}
          align="left"
          onOpen={props.onOpenTooltip}
          onClose={props.onCloseTooltip}>
          <UiPlainButton onClick={props.onToggleMute}>
            <i className="fa fa-volume-up" />
          </UiPlainButton>
        </PlayerTooltip>
      </div>

      <div className="slider">
        <UiInputSlider
          value={props.volume}
          min={0}
          max={1}
          step={0.1}
          onChange={props.onChangeVolume}
          styles={{
            active: { background: 'var(--color-primary)' },
            track: {
              width: '100%'
            },
            thumb: {
              display: isHovered ? 'block' : 'none'
            }
          }}
        />
      </div>
    </div>
  )
}

export default VolumeControl
