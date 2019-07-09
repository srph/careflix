import './style'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiPlainButton from '~/components/UiPlainButton'
import SeasonSelection from '~/components/SeasonSelection'
import axios from '~/lib/axios'
import history from '~/lib/history'
import getAirDetails from '~utils/shows/getAirDetails';
import { useMediaMode } from '~/hooks/useMediaMode'

interface Props {
  show: AppShow | null
  onClose: () => void
}

/**
 * @TODO Add group loader
 * @TODO For series with no shows, we'll show an empty placeholder.
 * @TODO Create party loader
 */
function ShowModal(props: Props) {
  async function handleVideoClick(video: AppShowVideo) {
    const [err, res] = await axios.post('/api/parties', {
      show_video_id: video.id
    })

    if (err) {
      // Launch toast notification
      return
    }

    history.push(`/watch/${res.data.id}`)
  }

  function handleMoviePlayClick() {
    handleVideoClick(props.show.movie)
  }

  const media = useMediaMode()

  return (
    <React.Fragment>
      <UiModal
        isOpen={Boolean(props.show)}
        shouldCloseOnOverlayClick={media === 'desktop'}
        overlayClassName="show-modal-overlay"
        modalClassName="show-modal"
        onClose={props.onClose}>
        {() => (
          <React.Fragment>
            <div className="show-modal-cover">
              <img src={props.show.preview_image} alt={props.show.title} className="image" />

              <div className="overlay">
                {props.show.title_type === 'movie' && (
                  <UiPlainButton onClick={handleMoviePlayClick}>
                    <div className="show-modal-play-button">
                      <i className='fa fa-play' />
                    </div>
                  </UiPlainButton>
                )}
              </div>

              <div className="show-modal-close">
                <UiPlainButton onClick={props.onClose}>
                  <div className="show-modal-close-button">
                    <i className='fa fa-close' />
                  </div>
                </UiPlainButton>
              </div>
            </div>

            <div className="show-modal-body">
              <header className="show-modal-heading">
                <div className="tags">
                  <h5 className="ui-subheading">
                    {props.show.title_type === 'series' && getAirDetails(props.show)}
                    {props.show.title_type === 'movie' && getAirDetails(props.show)}
                  </h5>
                </div>

                <h3 className="title">{props.show.title}</h3>

                <p className="synopsis">{props.show.synopsis}</p>
              </header>

              <SeasonSelection show={props.show} onEpisodeClick={handleVideoClick} />
            </div>
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}

export default ShowModal
