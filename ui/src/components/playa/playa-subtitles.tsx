import * as React from 'react'
import { useMemo } from 'react'
import { cn } from '~/utils/cn'
import { usePlayaContext } from './playa'
import { placements, HAS_PLACEMENT_PATTERN } from './playa-subtitles-constants'
import { srt2obj } from './playa-subtitles-utils'

// White text with a black edge. <font> tags in a subtitle file keep their colour but not their own size or face.
// The md step is the only place 768px is used: a hotfix for a split-screen setup on a small laptop.
const SLOT =
  'pointer-events-none absolute inset-x-0 z-(--zindex-player-subtitles) p-2 text-base/normal font-medium text-white select-none text-shadow-outline md:pb-12 md:text-xl/normal lg:p-8 lg:text-2xl/normal [&_font]:[font:inherit]'

/** The cues of the playa's `.srt` at the current time, once the video is up and while subtitles are on. */
export function PlayaSubtitles() {
  const playa = usePlayaContext()
  const srt = playa.subtitles
  const tracks = useMemo(() => {
    if (!srt) return []
    try {
      return srt2obj(srt)
    } catch {
      // Missing or malformed subtitles should not interrupt the watch party.
      return []
    }
  }, [srt])

  const { time, isReady, isSubtitlesOn, isOverlayOpen } = playa.state
  if (!isReady || !isSubtitlesOn || !tracks.length) {
    return null
  }

  const subtitles = tracks.filter((track) => time >= track.start && time <= track.end)
  if (!subtitles.length) {
    return null
  }

  return (
    <React.Fragment>
      {placements.map((placement) => {
        const placementSubtitles = subtitles.filter((subtitle) => {
          // Cues without a placement go to the bottom center.
          if (placement.key === 'bottom-center' && !HAS_PLACEMENT_PATTERN.test(subtitle.text)) {
            return true
          }

          return subtitle.text.includes(placement.indicator)
        })

        // While the controls are up, subtitles hide on phones and tablets; on desktop the bottom row lifts above the controls.
        const className = cn(
          SLOT,
          placement.className,
          isOverlayOpen && 'hidden lg:block',
          isOverlayOpen && placement.vertical === 'bottom' && 'lg:pb-45'
        )

        return (
          <div key={placement.key} className={className}>
            {placementSubtitles.map((subtitle) => (
              <p
                data-testid="subtitle"
                key={subtitle.index}
                dangerouslySetInnerHTML={{
                  __html: subtitle.text.replace('\n', '<br />').replace(placement.indicator, '')
                }}
              />
            ))}
          </div>
        )
      })}
    </React.Fragment>
  )
}
