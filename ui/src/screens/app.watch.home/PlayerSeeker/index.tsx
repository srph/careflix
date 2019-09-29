import './style.css'
import * as React from 'react'
import { useState, useRef, useMemo } from 'react'
import UiInputSlider from '~/components/UiInputSlider'
import toReadableTime from '~/utils/date/toReadableTime'
import clamp from '~/utils/clamp'

interface Props {
  time: number
  duration: number
  onSeek: (time: number) => void
}

const LABEL_WIDTH = 80

function PlayerSeeker(props: Props) {
  const [percentage, setPercentage] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const translateX = useMemo(() => {
    if (!containerRef.current) {
      return ''
    }
    const containerWidth = containerRef.current.getBoundingClientRect().width
    return percentage === -1 ? '' : `${percentage * containerWidth - LABEL_WIDTH / 2}px`
  }, [percentage])

  function handleSeek(time: number) {
    props.onSeek(time)
  }

  function handleMouseMove(evt: React.MouseEvent<HTMLDivElement>) {
    const box = evt.currentTarget.getBoundingClientRect()
    const x = evt.clientX - box.left
    const total = box.width
    setPercentage(clamp(x / total, 0, total))
  }

  function handleMouseLeave() {
    setPercentage(-1)
  }

  return (
    <div
      className="slider app-watch-player-seeker"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      {percentage != -1 && (
        <div className="time" style={{ transform: `translateX(${translateX})` }}>
          {toReadableTime(props.duration * percentage, {
            max: props.duration > 3600 ? 'hh' : 'mm'
          })}
        </div>
      )}

      <UiInputSlider
        value={props.time}
        min={0}
        max={props.duration}
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
