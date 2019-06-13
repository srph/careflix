import './style'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiPlainButton from '~/components/UiPlainButton'
import SeasonSelection from '~/components/SeasonSelection'
import axios from '~/lib/axios' 

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

  if (props.party.video.show.title_type !== 'series') {
    return null
  }

  return (
    <React.Fragment>
      <UiModal
        isOpen={props.isOpen}
        shouldCloseOnOverlayClick={false}
        overlayClassName="show-modal-overlay"
        onClose={props.onClose}>
        {() => (
          <React.Fragment>
            <div className="show-modal-close">
              <UiPlainButton onClick={props.onClose}>
                <div className="show-modal-close-button">
                  <i className='fa fa-close' />
                </div>
              </UiPlainButton>
            </div>

            <SeasonSelection show={props.show} currentVideo={props.party.video} onEpisodeClick={handleVideoClick} />
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}

export default ShowModal
