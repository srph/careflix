import * as React from 'react'
import { useState, useRef } from 'react'
import Slider, { SliderValue } from 'react-input-slider'

type Style = { [key: string]: any }

interface Props {
  value: number
  min: number
  max: number
  styles?: {
    active?: Style
    thumb?: Style
    track?: Style
  }
  onChange?: (value: number) => void
}

/**
 * react-input-slider calls props.onChange each drag move.
 * This component lazily updates the value only after the drag / click.
 */
function UiInputSlider(props: Props) {
  const [slackX, setSlackX] = useState<number>(() => props.value)
  const slackXRef = useRef(slackX) // Access the updated slackX from the other event listeners
  const [isDragging, setIsDragging] = useState<boolean>(false)

  function handleQueueChange({ x }: SliderValue) {
    setIsDragging(true)
    slackXRef.current = x
    setSlackX(x)
  }

  function handleCommitChange() {
    props.onChange && props.onChange(slackXRef.current)
    setIsDragging(false)
  }

  return (
    <Slider
      axis="x"
      x={isDragging ? slackX : props.value}
      xmin={props.min}
      xmax={props.max}
      onChange={handleQueueChange}
      onClick={handleCommitChange}
      onDragEnd={handleCommitChange}
      styles={props.styles}
    />
  )
}

export default UiInputSlider
