import * as React from 'react'
import {
  PlayaBackward,
  PlayaBar,
  PlayaButton,
  PlayaControls,
  PlayaForward,
  PlayaFullscreen,
  PlayaPlayPause,
  PlayaSpacer,
  PlayaSubtitlesToggle
} from '~/components/playa/playa-controls'
import { PlayaSlider } from '~/components/playa/playa-slider'
import { PlayaVolume } from '~/components/playa/playa-volume'
import { getVideoDetails } from '~/utils/shows/get-video-details'
import { useParty } from '~/screens/app.watch/use-party'
import { AppWatchHomeActivityMenu } from '../app-watch-home-activity/app-watch-home-activity-menu'
import { useWatchLayout } from '../app-watch-home-layout'

/** Playa's controls and the party's own, left to right. Playa lays them out; the page picks what goes in. */
export function AppWatchHomeStageControls() {
  const party = useParty()
  const layout = useWatchLayout()
  const isChatOpen = layout.sidebar !== 'closed'

  return (
    <PlayaControls>
      <PlayaSlider />

      <PlayaBar>
        <PlayaPlayPause />
        <PlayaBackward />
        <PlayaForward />
        <PlayaVolume />

        {/* min-w-0 lets the title shorten with an ellipsis. */}
        <h3 className="min-w-0 truncate text-xl leading-none font-medium">
          <span>{party.video.show.title}</span>
          <span className="ml-2 opacity-75">{getVideoDetails(party.video)}</span>
        </h3>

        <PlayaSpacer />

        <PlayaButton
          label="View keyboard shortcuts"
          align="right"
          className="hidden lg:block"
          onClick={() => layout.setModal('keyboard-info')}>
          <i className="fa fa-keyboard-o" />
        </PlayaButton>

        {Boolean(party.video.subtitle_url) && <PlayaSubtitlesToggle align="right" />}

        {party.video.show.title_type === 'series' && (
          <PlayaButton label="Open Episode Selection" align="right" onClick={() => layout.setModal('season-selection')}>
            <i className="fa fa-list-ol" />
          </PlayaButton>
        )}

        <PlayaFullscreen align="right" />
        <AppWatchHomeActivityMenu />

        <PlayaButton label={isChatOpen ? 'Close Chat' : 'Open Chat'} align="right" onClick={layout.toggleChat}>
          {isChatOpen ? <i className="fa fa-comment-o" /> : <i className="fa fa-comment" />}
        </PlayaButton>
      </PlayaBar>
    </PlayaControls>
  )
}
