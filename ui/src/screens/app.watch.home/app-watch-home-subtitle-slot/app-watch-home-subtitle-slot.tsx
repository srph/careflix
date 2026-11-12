import * as React from 'react'
import { cn } from '~/utils/cn'
import { useMemo } from 'react'
import { useSubtitleQuery } from '~/screens/app.watch/queries/app-watch-video-queries'
import { placements, HAS_PLACEMENT_PATTERN } from './app-watch-home-subtitle-slot-constants'
import { srt2obj } from './app-watch-home-subtitle-slot-utils'

interface Props {
  video: AppShowVideo
  time: number
  isEnabled: boolean
  isPlayerOpen: boolean
}

// White text with a black edge. <font> tags in a subtitle file keep their colour but not their own size or face.
// The md step is the only place 768px is used: a hotfix for a split-screen setup on a small laptop.
const SLOT =
  'pointer-events-none absolute inset-x-0 z-(--zindex-player-subtitles) p-2 text-base/normal font-medium text-white select-none text-shadow-outline md:pb-12 md:text-xl/normal lg:p-8 lg:text-2xl/normal [&_font]:[font:inherit]'

export function AppWatchHomeSubtitleSlot(props: Props) {
  const subtitle = useSubtitleQuery(props.video).data
  const tracks = useMemo(() => {
    if (!subtitle) return []
    try {
      return srt2obj(subtitle)
    } catch {
      // Missing or malformed subtitles should not interrupt the watch party.
      return []
    }
  }, [subtitle])

  if (!props.video.subtitle_url) {
    return null
  }

  if (!tracks.length) {
    return null
  }

  if (!props.isEnabled) {
    return null
  }

  const subtitles = tracks.filter((track) => {
    return props.time >= track.start && props.time <= track.end
  })

  if (!subtitles.length) {
    return null
  }

  return (
    <React.Fragment>
      {placements.map((placement) => {
        const placementSubtitles = subtitles.filter((subtitle) => {
          // We want to position default tracks (tracks without specified positioning)
          // to be placed to the bottom center.
          if (placement.key === 'bottom-center' && !HAS_PLACEMENT_PATTERN.test(subtitle.text)) {
            return true
          }

          return subtitle.text.includes(placement.indicator)
        })

        // While the controls are up, subtitles hide on phones and tablets; on desktop the bottom row lifts above the controls.
        const className = cn(
          SLOT,
          placement.className,
          props.isPlayerOpen && 'hidden lg:block',
          props.isPlayerOpen && placement.vertical === 'bottom' && 'lg:pb-45'
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
