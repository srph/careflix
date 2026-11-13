import * as React from 'react'
import { useBufferState } from '~/hooks/use-buffer-state'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import { useParty } from '~/screens/app.watch/use-party'

/** "Now Playing" over the picture for a few seconds after the room switches episodes. */
export function AppWatchHomeStageNowPlaying() {
  const party = useParty()
  const [isShowing, show] = useBufferState({ timeout: 4000 })

  // Only series change videos, so any change is a new episode.
  useUpdateEffect(() => {
    show()
  }, [party.video.id])

  if (!isShowing) {
    return null
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-center">
      <div className="relative animate-now-playing">
        <div className="mb-1 opacity-75">
          <h5 className="font-label text-xs font-bold tracking-label uppercase">Now Playing</h5>
        </div>

        <h4 className="text-base font-bold">
          {party.video.group.title}: {party.video.title}
        </h4>
      </div>
    </div>
  )
}
