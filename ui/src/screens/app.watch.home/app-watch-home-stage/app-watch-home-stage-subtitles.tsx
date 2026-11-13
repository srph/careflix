import * as React from 'react'
import { PlayaSubtitles } from '~/components/playa/playa-subtitles'
import { useParty } from '~/screens/app.watch/use-party'
import { useSubtitleQuery } from '~/screens/app.watch/queries/app-watch-video-queries'

/** Loads the video's subtitles from the API and hands them to Playa. */
export function AppWatchHomeStageSubtitles() {
  const party = useParty()
  const subtitle = useSubtitleQuery(party.video).data
  return <PlayaSubtitles srt={party.video.subtitle_url ? subtitle : null} />
}
