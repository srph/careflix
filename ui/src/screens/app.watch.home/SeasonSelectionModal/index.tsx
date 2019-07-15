import './style'
import * as React from 'react'
import cx from 'classnames'
import UiModal from '~/components/UiModal'
import UiPlainButton from '~/components/UiPlainButton'
import SeasonSelection from '~/components/SeasonSelection'
import axios from '~/lib/axios' 
import { useMediaMode } from '~/hooks/useMediaMode'

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
function ShowModal(props: Props) {
  async function handleVideoClick(video: AppShowVideo) {
    const [err, res] = await axios.put(`/api/parties/${props.party.id}/change-video`, {
      show_video_id: video.id
    })

    if (err) {
      // Launch toast notification
      return
    }

    props.onChangeVideo(res.data)
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
        overlayClassName="watch-home-season-selection-overlay"
        modalClassName="watch-home-season-selection-modal"
        onClose={props.onClose}>
        {() => (
          <React.Fragment>
            <div className="watch-home-season-selection-close">
              <UiPlainButton onClick={props.onClose}>
                <div className="watch-home-season-selection-close-button">
                  <i className='fa fa-close' />
                </div>
              </UiPlainButton>
            </div>

            <SeasonSelection show={props.show} currentVideo={props.party.video} onEpisodeClick={handleVideoClick} mode={media === 'desktop' ? 'light' : 'dark'} />
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}

export default ShowModal
