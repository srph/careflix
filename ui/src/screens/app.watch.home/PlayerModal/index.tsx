import './style.css'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiPlainButton from '~/components/UiPlainButton'

interface Props {
  party: AppParty
}

function PlayerModal({ party, ...props }: Props) {
  const [isOpen, setIsOpen] = React.useState<boolean>(true)
  
  return (
    <UiModal isOpen={isOpen} shouldCloseOnOverlayClick={false}>
      <div className="watch-player-modal">
        <div className="watch-player-actions">
          <div className="section">
            <div className="action">
              <UiPlainButton onClick={() => setIsOpen(false)}>
                <i className="fa fa-close" />
              </UiPlainButton>
            </div>
          </div>

          <div className="section">
            <div className="action">
              <UiPlainButton>
                <i className="fa fa-comments" />
              </UiPlainButton>
            </div>

            <div className="action">
              <UiPlainButton>
                <i className="fa fa-cc" />
              </UiPlainButton>
            </div>
            <div className="action">
              <UiPlainButton>
                <i className="fa fa-cog" />
              </UiPlainButton>
            </div>
          </div>
        </div>

        <div className="watch-player-contents">
          <div className="watch-player-controls">
            <div className="control">
              <UiPlainButton>
                <i className="fa fa-play" />
              </UiPlainButton>
            </div>

            <div className="control">
              <UiPlainButton>
                <i className="fa fa-fast-backward" />
              </UiPlainButton>
            </div>

            <div className="control">
              <UiPlainButton>
                <i className="fa fa-fast-forward" />
              </UiPlainButton>
            </div>
          </div>

          <div className="watch-player-modal-card">
            <div className="meta">
              <h6 className="ui-subheading">
                Season 6: Episode 9
              </h6>
            </div>

            <h2 className="title">{party.video.show.title}</h2>
            <p className="summary">{party.video.show.synopsis}</p>
          </div>
        </div>
      </div>
    </UiModal>
  )
}

export default PlayerModal