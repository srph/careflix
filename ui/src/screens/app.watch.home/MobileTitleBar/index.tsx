import './style.css'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { useIsPWA } from '~/hooks/useIsPWA'
import useWindowSize from 'react-use/lib/useWindowSize'
import UiPlainButton from '~/components/UiPlainButton'
import UiButton from '~/components/UiButton'
import UiModal from '~/components/UiModal'
import getVideoDetails from '~/utils/shows/getVideoDetails'

interface Props {
  party: AppParty
  onOpenSeasonSelection: () => void
}

function MobileTitleBar(props: Props) {
  const { width, height } = useWindowSize()

  const [isNoteOpen, setIsNoteOpen] = useState(true)

  const isPWA = useIsPWA()

  useEffect(() => {
    if (isNoteOpen && width >= 640) {
      setIsNoteOpen(false)
    }
  }, [width, height])

  function handleModalOpen() {
    setIsNoteOpen(true)
  }

  function handleModalClose() {
    setIsNoteOpen(false)
  }

  return (
    <React.Fragment>
      <div className="watch-screen-mobile-title-bar">
        <h3 className="title">
          <span className="title">{props.party.video.show.title}</span>
          <span className="info">{getVideoDetails(props.party.video)}</span>
        </h3>

        <div className="menu">
          {props.party.video.show.title_type === 'series' && (
            <UiPlainButton className="action" onClick={props.onOpenSeasonSelection}>
              <i className="fa fa-list-ol" />
            </UiPlainButton>
          )}

          <UiPlainButton className="action" onClick={handleModalOpen}>
            <i className="fa fa-expand" />
          </UiPlainButton>
        </div>
      </div>

      <UiModal isOpen={isNoteOpen} onClose={handleModalClose} overlayClassName="watch-screen-mobile-fs-note-overlay" modalClassName="watch-screen-mobile-fs-note-modal">
        <div className="heading">
          <h5 className="ui-subheading">
            How to fullscreen on mobile
          </h5>
        </div>

        {!isPWA && (
          <React.Fragment>
            <p className="text">Manually rotate your device to go fullscreen mode.</p>
            
            <UiButton variant="primary" onClick={handleModalClose}>
              Okay, Gotcha.
            </UiButton>
          </React.Fragment>
        )}

        {isPWA && (
          <React.Fragment>
            <p className="text">Download the app (won't take a minute) to enable the entire fullscreen experience.</p>
            
            <UiButton link to="/download" variant="primary" onClick={handleModalClose}>
              Download Now
            </UiButton>
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}

export default MobileTitleBar
