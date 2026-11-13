import * as React from 'react'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import { useBufferState } from '~/hooks/use-buffer-state'
import { UiLoader } from '~/components/ui-loader/ui-loader'
import { usePlayaContext } from './playa'

/** A ▶ or ❚❚ that flashes in the middle on play and pause (desktop), and a spinner while the video buffers. */
export function PlayaStatus() {
  const playa = usePlayaContext()
  const [isFlashing, flash] = useBufferState({ timeout: 400 })
  const { isPlaying, isBuffering } = playa.state

  useUpdateEffect(() => {
    flash()
  }, [isPlaying])

  return (
    <>
      {isFlashing && (
        <div className="pointer-events-none absolute top-[calc(50%-60px)] left-[calc(50%-60px)] z-(--zindex-player-state-buffered-indicator) hidden size-30 animate-fade-out items-center justify-center rounded-full bg-black/75 text-5xl leading-none text-white opacity-0 select-none lg:flex">
          {isPlaying ? <i className="fa fa-play" /> : <i className="fa fa-pause" />}
        </div>
      )}

      {isBuffering && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/75">
          <UiLoader size="large" />
        </div>
      )}
    </>
  )
}
