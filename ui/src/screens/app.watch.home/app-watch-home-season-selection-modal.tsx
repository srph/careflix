import * as React from 'react'
import { UiModal } from '~/components/ui-modal/ui-modal'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { SeasonSelection } from '~/components/season-selection/season-selection'
import { useMediaMode } from '~/hooks/use-media-mode'
import { useShowGroupsQuery } from '~/queries/show-queries'
import { useChangeVideoMutation } from '~/screens/app.watch/queries/app-watch-party-queries'

interface Props {
  party: AppParty
  show: AppShow | null
  isOpen: boolean
  onClose: () => void
  onChangeVideo: (party: AppParty) => void
}

/**
 * @TODO Add group loader
 * @TODO For series with no shows, we'll show an empty placeholder.
 * @TODO Create party loader
 */
export function AppWatchHomeSeasonSelectionModal(props: Props) {
  // Seasons load when the picker opens.
  const groups = useShowGroupsQuery(props.show, props.isOpen)
  const changeVideo = useChangeVideoMutation(props.party.id)

  function handleVideoClick(video: AppShowVideo) {
    // @TODO Launch toast notification on failure
    changeVideo.mutateAsync(video).then(props.onChangeVideo, () => {})
  }

  const media = useMediaMode()

  if (props.party.video.show.title_type !== 'series') {
    return null
  }

  return (
    <React.Fragment>
      <UiModal
        isOpen={props.isOpen}
        shouldCloseOnOverlayClick={false}
        overlayClassName="bg-neutral-950 sm:bg-black/75"
        modalClassName="relative sm:mx-auto sm:my-16 sm:w-90 sm:rounded-sm sm:bg-white"
        onClose={props.onClose}>
        {() => (
          <React.Fragment>
            <div className="absolute top-4 right-4">
              <UiPlainButton onClick={props.onClose}>
                <div className="flex size-8 items-center justify-center rounded-full bg-neutral-400 text-white">
                  <i className="fa fa-close" />
                </div>
              </UiPlainButton>
            </div>

            <SeasonSelection
              groups={groups.data ?? []}
              show={props.show}
              currentVideo={props.party.video}
              onEpisodeClick={handleVideoClick}
              mode={media === 'desktop' ? 'light' : 'dark'}
            />
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}
