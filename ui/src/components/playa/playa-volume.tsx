import * as React from 'react'
import { useState } from 'react'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { UiInputSlider } from '~/components/ui-input-slider/ui-input-slider'
import { usePlayaContext } from './playa'
import { PLAYA_DESKTOP_ITEM } from './playa-controls'
import { PlayaTooltip } from './playa-tooltip'

/** Mute, and a volume slider that opens on hover. Desktop only. */
export function PlayaVolume() {
  const playa = usePlayaContext()
  const [isHovered, setIsHovered] = useState(false)
  const { isMuted, volume } = playa.state

  return (
    <div className={PLAYA_DESKTOP_ITEM}>
      <div
        data-testid="volume-control"
        className="group flex items-center py-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        <div className={isMuted ? 'text-red-500 group-hover:mr-4' : 'group-hover:mr-4'}>
          <PlayaTooltip text={isMuted ? 'Unmute' : 'Mute'} align="left">
            <UiPlainButton aria-label={isMuted ? 'Unmute' : 'Mute'} onClick={playa.toggleMute}>
              <i className="fa fa-volume-up" />
            </UiPlainButton>
          </PlayaTooltip>
        </div>

        {/* The slider opens on hover: it widens at once and fades in; on the way out it fades after a beat. */}
        <div className="w-0 opacity-0 transition-[width,opacity] delay-[0ms,200ms] duration-[200ms,400ms] group-hover:w-20 group-hover:opacity-100 group-hover:delay-0">
          <UiInputSlider
            ariaLabel="Volume"
            value={volume}
            min={0}
            max={1}
            step={0.1}
            onChange={playa.setVolume}
            styles={{
              active: { background: 'var(--color-pink-500)' },
              track: {
                width: '100%',
                cursor: 'pointer'
              },
              thumb: {
                display: isHovered ? 'block' : 'none'
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}
