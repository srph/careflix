import * as React from 'react'
import { useState, useRef, useMemo } from 'react'
import { UiInputSlider } from '~/components/ui-input-slider/ui-input-slider'
import { toReadableTime } from '~/utils/date/to-readable-time'
import { clamp } from '~/utils/clamp'

interface Props {
  time: number
  duration: number
  onSeek: (time: number) => void
}

const LABEL_WIDTH = 80

export function AppWatchHomePlayerSeeker(props: Props) {
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
      data-testid="player-seeker"
      className="relative mr-4 w-full lg:mr-8 lg:py-4"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}>
      {percentage != -1 && (
        <div
          className="pointer-events-none absolute -top-8 left-0 w-20 rounded-sm bg-neutral-700 p-2 text-center"
          style={{ transform: `translateX(${translateX})` }}>
          {toReadableTime(props.duration * percentage, {
            max: props.duration > 3600 ? 'hh' : 'mm'
          })}
        </div>
      )}

      <UiInputSlider
        ariaLabel="Playback position"
        value={props.time}
        min={0}
        max={props.duration}
        onChange={handleSeek}
        styles={{
          active: { background: 'var(--color-pink-500)' },
          thumb: {
            background: 'var(--color-pink-500)',
            height: 28,
            width: 28
          },
          track: {
            width: '100%',
            height: 8,
            background: 'var(--color-neutral-700)',
            cursor: 'pointer'
          }
        }}
      />
    </div>
  )
}
