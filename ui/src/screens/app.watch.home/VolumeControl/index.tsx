import * as React from 'react'
import { useState } from 'react'
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
      data-testid="volume-control" className="group flex items-center py-4"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <div className={props.isMuted ? 'text-red-500 group-hover:mr-4' : 'group-hover:mr-4'}>
        <PlayerTooltip
          text={props.isMuted ? 'Unmute' : 'Mute'}
          align="left"
          onOpen={props.onOpenTooltip}
          onClose={props.onCloseTooltip}>
          <UiPlainButton aria-label={props.isMuted ? 'Unmute' : 'Mute'} onClick={props.onToggleMute}>
            <i className="fa fa-volume-up" />
          </UiPlainButton>
        </PlayerTooltip>
      </div>

      {/* The slider opens on hover: it widens at once and fades in; on the way out it fades after a beat. */}
      <div className="w-0 opacity-0 transition-[width,opacity] delay-[0ms,200ms] duration-[200ms,400ms] group-hover:w-20 group-hover:opacity-100 group-hover:delay-0">
        <UiInputSlider
        ariaLabel="Volume"
          value={props.volume}
          min={0}
          max={1}
          step={0.1}
          onChange={props.onChangeVolume}
          styles={{
            active: { background: 'var(--color-pink-500)' },
            track: {
              width: '100%',
              cursor: 'pointer'
            },
            thumb: {
              display: isHovered ? 'block' : 'none',
            }
          }}
        />
      </div>
    </div>
  )
}

export default VolumeControl
