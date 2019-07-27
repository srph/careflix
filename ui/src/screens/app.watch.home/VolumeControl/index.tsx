import './style.css'
import * as React from 'react'
import { useState, useEffect } from 'react'
import cx from 'classnames'
import UiPlainButton from '~/components/UiPlainButton'
import Slider, { SliderValue } from 'react-input-slider'

interface Props {
  volume: number
  isMuted: boolean
  onChangeVolume: (volume: number) => void
  onToggleMute: () => void
}

function VolumeControl(props: Props) {
  const [isOpen, setIsOpen] = useState(true)

  function handleMouseEnter() {
    setIsOpen(true)
  }

  function handleMouseLeave() {
    setIsOpen(false)
  }

  function handleChange({ y }: SliderValue) {
    props.onChangeVolume(y)
  }

  return (
    <div className={cx('app-watch-volume-control-action', {
      'is-muted': props.isMuted
    })} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <UiPlainButton className="icon" onClick={props.onToggleMute}>
        <i className="fa fa-volume-up" />
      </UiPlainButton>

      {isOpen && (
        <div className="app-watch-volume-control">
          <Slider
            axis="y"
            y={props.volume}
            ymin={0}
            ymax={1}
            ystep={0.1}
            onChange={handleChange}
            styles={{
              track: {
                height: '100%'
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

export default VolumeControl
