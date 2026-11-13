import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { cn } from '~/utils/cn'
import { Playa, PlayaElement, PlayaOverlay } from '~/components/playa/playa'
import { PlayaCenterControls } from '~/components/playa/playa-controls'
import { PlayaReactions } from '~/components/playa/playa-reactions'
import { PlayaStatus } from '~/components/playa/playa-status'
import { PlayaSubtitles } from '~/components/playa/playa-subtitles'
import { getVideoPreviewImage } from '~/utils/shows/get-video-preview-image'
import { useParty } from '~/screens/app.watch/use-party'
import { useInvitationOverlay } from '~/screens/app/app-invitation-modal/app-invitation-modal-context'
import { AppWatchHomeActivityOverlay } from '../app-watch-home-activity/app-watch-home-activity-overlay'
import { useWatchLayout } from '../app-watch-home-layout'
import { AppWatchHomeStageControls } from './app-watch-home-stage-controls'
import { AppWatchHomeStageNowPlaying } from './app-watch-home-stage-now-playing'

/** The picture and everything over it. It narrows to make room for the sidebar from 640px up. */
export function AppWatchHomeStage() {
  const party = useParty()
  const { sidebar } = useWatchLayout()
  const { registerPlayer } = useInvitationOverlay()
  const $pane = useRef<HTMLDivElement>(null)

  // An incoming invitation docks over the picture.
  useEffect(() => {
    registerPlayer({ partyId: party.id, element: $pane.current! })
    return () => registerPlayer(null)
  }, [party.id, registerPlayer])

  return (
    <Playa
      ref={$pane}
      className={cn(
        'w-full shrink-0 sm:shrink sm:transition-all sm:duration-200',
        sidebar !== 'closed' && 'sm:w-[calc(100%-var(--player-chat-pane-width))]'
      )}>
      <PlayaElement src={party.video.video_url} poster={getVideoPreviewImage(party)} />
      <AppWatchHomeStageNowPlaying />
      <PlayaStatus />
      <PlayaSubtitles />
      <PlayaReactions />
      <AppWatchHomeActivityOverlay />

      <PlayaOverlay>
        <Link
          to="/"
          className="absolute top-4 left-4 text-base leading-none text-white text-shadow-[0_1px_2px_rgb(0_0_0/0.5)] lg:text-xl">
          <span className="mr-4">
            <i className="fa fa-long-arrow-left" />
          </span>
          Back to Browse
        </Link>

        <PlayaCenterControls />
        <AppWatchHomeStageControls />
      </PlayaOverlay>
    </Playa>
  )
}
