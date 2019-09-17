import './style.css'
import * as React from 'react'
import { useState } from 'react'
import cx from 'classnames'
import Popover from 'react-tiny-popover'

interface Props {
  onOpen: () => void
  onClose: () => void
  text: string
  align: 'left' | 'right'
  padding?: number
  children: React.ReactNode
}

function VolumeControl(props: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  function handleMouseEnter() {
    props.onOpen()
    setIsOpen(true)
  }

  function handleMouseLeave() {
    props.onClose()
    setIsOpen(false)
  }

  return (
    <Popover
      isOpen={isOpen}
      position="top"
      align={props.align === 'left' ? 'start' : 'end'}
      content={<div className="app-watch-player-tooltip-popover">{props.text}</div>}
      containerClassName="app-watch-player-tooltip-popover-container"
      padding={props.padding}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {props.children}
      </div>
    </Popover>
  )
}

VolumeControl.defaultProps = {
  padding: 32
}

export default VolumeControl
