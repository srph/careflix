import './style.css'
import * as React from 'react'
import { useState, useRef, useMemo } from 'react'
import Slider, { SliderValue } from 'react-input-slider'
import toReadableTime from '~/utils/date/toReadableTime'

interface Props {
  time: number
  duration: number
  onSeek: (time: number) => void
}

function PlayerSeeker(props: Props) {
  const [percentage, setPercentage] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  function handleSeek({ x }: SliderValue) {
    props.onSeek(x)
  }

  function handleMouseMove(evt: React.MouseEvent<HTMLDivElement>) {
    const box = evt.currentTarget.getBoundingClientRect()
    const x = evt.clientX - box.left
    const total = box.width
    setPercentage(x / total)
  }

  function handleMouseLeave() {
    setPercentage(-1)
  }

  const translateX = useMemo(() => {
    if (!labelRef.current || !containerRef.current) {
      return ''
    }

    const containerWidth = containerRef.current.getBoundingClientRect().width
    const labelWidth = labelRef.current.getBoundingClientRect().width

    return percentage === -1 ? '' : `${percentage * containerWidth - labelWidth / 2}px`
  }, [percentage])

  return (
    <div
      className="slider app-watch-player-seeker"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      {percentage != -1 && (
        <div className="time" ref={labelRef} style={{ transform: `translateX(${translateX})` }}>
          {toReadableTime(props.duration * percentage, {
            max: props.duration > 3600 ? 'hh' : 'mm'
          })}
        </div>
      )}

      <Slider
        axis="x"
        x={props.time}
        xmin={0}
        xmax={props.duration}
        onChange={handleSeek}
        styles={{
          active: { background: 'var(--color-primary)' },
          thumb: {
            background: 'var(--color-primary)',
            height: 28,
            width: 28
          },
          track: {
            width: '100%',
            height: 8,
            background: 'var(--color-black-4)',
            cursor: 'pointer'
          }
        }}
      />
    </div>
  )
}

export default PlayerSeeker
