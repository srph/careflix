import * as React from 'react'
import { use, useMemo, useRef, useState } from 'react'
import { UiInputSlider } from '~/components/ui-input-slider/ui-input-slider'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { toReadableTime } from '~/utils/date/to-readable-time'
import { clamp } from '~/utils/clamp'
import { usePlayaContext } from './playa'
import { PlayaOpenTooltips } from './playa-controls'
import { PlayaTooltip } from './playa-tooltip'

const TIME = 'shrink-0 text-base leading-none tabular-nums not-last:mr-4 lg:not-last:mr-8'
const LABEL_WIDTH = 80

/**
 * The timeline: time, the seek bar, and the duration (or what's left, on a click).
 * It steps aside while another control's tooltip shows, or while something is pinned open from the controls.
 */
export function PlayaSlider() {
  const playa = usePlayaContext()
  const openTooltips = use(PlayaOpenTooltips)
  const [isRemainingTime, setIsRemainingTime] = useState(false)
  const [isTimeTooltipOpen, setIsTimeTooltipOpen] = useState(false)
  const { time, duration } = playa.state

  if (playa.state.isOverlayPinned || (openTooltips > 0 && !isTimeTooltipOpen)) {
    return null
  }

  return (
    <div data-testid="player-controls" className="flex items-center p-4 sm:px-4 sm:py-0 lg:px-8">
      <div className={TIME}>{toReadableTime(time, { max: duration > 3600 ? 'hh' : 'mm' })}</div>

      <Seeker time={time} duration={duration} onSeek={playa.seek} />

      <div className={TIME}>
        <PlayaTooltip
          text={isRemainingTime ? 'Display remaining time' : 'Display duration'}
          align="right"
          padding={16}
          onOpen={() => setIsTimeTooltipOpen(true)}
          onClose={() => setIsTimeTooltipOpen(false)}>
          <UiPlainButton onClick={() => setIsRemainingTime(!isRemainingTime)}>
            {isRemainingTime ? toReadableTime(duration - time) : toReadableTime(duration)}
          </UiPlainButton>
        </PlayaTooltip>
      </div>
    </div>
  )
}

function Seeker(props: { time: number; duration: number; onSeek: (time: number) => void }) {
  const [percentage, setPercentage] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)

  const translateX = useMemo(() => {
    if (!containerRef.current) {
      return ''
    }
    const containerWidth = containerRef.current.getBoundingClientRect().width
    return percentage === -1 ? '' : `${percentage * containerWidth - LABEL_WIDTH / 2}px`
  }, [percentage])

  function handleMouseMove(evt: React.MouseEvent<HTMLDivElement>) {
    const box = evt.currentTarget.getBoundingClientRect()
    const x = evt.clientX - box.left
    const total = box.width
    setPercentage(clamp(x / total, 0, total))
  }

  return (
    <div
      data-testid="player-seeker"
      className="relative mr-4 w-full lg:mr-8 lg:py-4"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPercentage(-1)}>
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
        onChange={props.onSeek}
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
