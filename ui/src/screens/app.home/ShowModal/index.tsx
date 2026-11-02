import './style.css'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiPlainButton from '~/components/UiPlainButton'
import SeasonSelection from '~/components/SeasonSelection'
import { useShowGroupsQuery } from '../queries'
import getAirDetails from '~/utils/shows/getAirDetails';
import { useMediaMode } from '~/hooks/useMediaMode'

interface Props {
  show: AppShow | null
  onClose: () => void
  onPlay: (video: AppShowVideo) => void
  isCreating?: boolean
  createError?: boolean
}

function ShowModal(props: Props) {
  const groupsQuery = useShowGroupsQuery(props.show)

  function handleMoviePlayClick() {
    if (props.show?.movie) props.onPlay(props.show.movie)
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
                  <UiPlainButton onClick={handleMoviePlayClick} disabled={props.isCreating || !props.show.movie} aria-label={`Start a party for ${props.show.title}`}>
                    <div className="show-modal-play-button">
                      <i className='fa fa-play' />
                    </div>
                  </UiPlainButton>
                )}
              </div>

              <div className="show-modal-close">
                <UiPlainButton onClick={props.onClose} aria-label="Close details">
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

              {props.createError && <p role="alert">Unable to start the party. Please try again.</p>}
              {props.show.title_type === 'movie' && !props.show.movie && <p>This title is not available to play yet.</p>}
              {props.show.title_type === 'series' && (groupsQuery.isPending ? <p role="status">Loading episodes…</p>
                : groupsQuery.isError ? <p role="alert">Unable to load episodes. <button type="button" onClick={() => { void groupsQuery.refetch() }}>Retry</button></p>
                : !groupsQuery.data?.some(group => group.videos.length) && <p>No episodes available yet.</p>)}
              <SeasonSelection show={props.show} groups={groupsQuery.data ?? []} isDisabled={props.isCreating} onEpisodeClick={props.onPlay} mode={media === 'desktop' ? 'light' : 'dark'} />
            </div>
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}

export default ShowModal
