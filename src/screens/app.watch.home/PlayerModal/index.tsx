import './style.css'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiButton from '~/components/UiButton'
import UiPlainButton from '~/components/UiPlainButton'
import useCountdownTimer from '~/components/CountdownTimer'

function PlayerModal() {
  const [isOpen, setIsOpen] = React.useState<boolean>(true)
  
  return (
    <UiModal isOpen={isOpen} shouldCloseOnOverlayClick={false}>
      <div className="watch-player-modal">
        <div className="watch-player-actions">
          <div className="section">
            <div className="action">
              <UiPlainButton>
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

            <h2 className="title">Boku no Hero Academia</h2>
            <p className="summary">Detective Jake Peralta, a talented and carefree cop with the best arrest record, has never had to follow the rules too closely or work very hard.</p>
          </div>
        </div>
      </div>
    </UiModal>
  )
}

export default PlayerModal