import * as React from 'react'
import { UiModal } from '~/components/ui-modal/ui-modal'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { SeasonSelection } from '~/components/season-selection/season-selection'
import { useMediaMode } from '~/hooks/use-media-mode'
import { useShowGroupsQuery } from '~/queries/show-queries'
import { useChangeVideoMutation } from '~/screens/app.watch/queries/app-watch-party-queries'
import { useParty } from '~/screens/app.watch/use-party'
import { usePlayaContext } from '~/components/playa/playa'
import { useWatchLayout } from './app-watch-home-layout'

/**
 * @TODO Add group loader
 * @TODO For series with no shows, we'll show an empty placeholder.
 * @TODO Create party loader
 */
export function AppWatchHomeSeasonSelectionModal() {
  const party = useParty()
  const playa = usePlayaContext()
  const { modal, setModal } = useWatchLayout()
  const isOpen = modal === 'season-selection'
  const close = () => setModal(null)
  // Seasons load when the picker opens.
  const groups = useShowGroupsQuery(party.video.show, isOpen)
  const changeVideo = useChangeVideoMutation(party.id)

  function handleVideoClick(video: AppShowVideo) {
    // @TODO Launch toast notification on failure
    changeVideo.mutateAsync(video).then(handleChangedVideo, () => {})
  }

  function handleChangedVideo(next: AppParty) {
    close()
    // Clicks on the picture then do the right thing for desktop and mobile.
    playa.overlay.close()
    // The same video keeps its source, so it syncs straight away; a new one syncs once it renders (usePartyPlaya).
    if (String(next.video.id) === String(party.video.id)) {
      playa.sync({ time: next.current_time, isPlaying: next.is_playing })
    }
  }

  const media = useMediaMode()

  if (party.video.show.title_type !== 'series') {
    return null
  }

  return (
    <React.Fragment>
      <UiModal
        isOpen={isOpen}
        shouldCloseOnOverlayClick={false}
        overlayClassName="bg-neutral-950 sm:bg-black/75"
        modalClassName="relative sm:mx-auto sm:my-16 sm:w-90 sm:rounded-sm sm:bg-white"
        onClose={close}>
        {() => (
          <React.Fragment>
            <div className="absolute top-4 right-4">
              <UiPlainButton onClick={close}>
                <div className="flex size-8 items-center justify-center rounded-full bg-neutral-400 text-white">
                  <i className="fa fa-close" />
                </div>
              </UiPlainButton>
            </div>

            <SeasonSelection
              groups={groups.data ?? []}
              show={party.video.show}
              currentVideo={party.video}
              onEpisodeClick={handleVideoClick}
              mode={media === 'desktop' ? 'light' : 'dark'}
            />
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}
