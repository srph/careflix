import * as React from 'react'
import { useState, useEffect } from 'react'
import { useIsPWA } from '~/hooks/use-is-pwa'
import { useWindowSize } from '~/hooks/use-window-size'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { UiButton } from '~/components/ui-button/ui-button'
import { UiModal } from '~/components/ui-modal/ui-modal'
import { getVideoDetails } from '~/utils/shows/get-video-details'

interface Props {
  party: AppParty
  onOpenSeasonSelection: () => void
}

const ACTION = 'relative p-2 text-base leading-none text-white not-last:mr-4'

export function AppWatchHomeMobileTitleBar(props: Props) {
  const { width, height } = useWindowSize()

  const [isNoteOpen, setIsNoteOpen] = useState(false)

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
      <div data-testid="mobile-title-bar" className="flex items-center justify-between border-b border-neutral-950 bg-neutral-900 p-4 pr-2 sm:hidden">
        <h3 className="max-w-full truncate pr-8 text-base leading-none font-medium">
          <span>{props.party.video.show.title}</span>
          <span className="ml-2 opacity-75">{getVideoDetails(props.party.video)}</span>
        </h3>

        <div className="flex items-center">
          {props.party.video.show.title_type === 'series' && (
            <UiPlainButton className={ACTION} aria-label="Open Episode Selection" onClick={props.onOpenSeasonSelection}>
              <i className="fa fa-list-ol" />
            </UiPlainButton>
          )}

          <UiPlainButton className={ACTION} aria-label="Enter Fullscreen" onClick={handleModalOpen}>
            <i className="fa fa-expand" />
          </UiPlainButton>
        </div>
      </div>

      <UiModal isOpen={isNoteOpen} onClose={handleModalClose} overlayClassName="bg-black/90" modalClassName="m-4 mt-10 rounded-sm bg-neutral-900 p-4 text-center sm:hidden">
        <div className="mb-2 text-neutral-400">
          <h5 className="font-label text-xs font-bold tracking-label uppercase">
            How to fullscreen on mobile
          </h5>
        </div>

        {isPWA && (
          <React.Fragment>
            <p className="mb-6 text-2xl">Manually rotate your device to go fullscreen mode.</p>
            
            <UiButton variant="primary" onClick={handleModalClose}>
              Okay, Gotcha.
            </UiButton>
          </React.Fragment>
        )}

        {!isPWA && (
          <React.Fragment>
            <p className="mb-6 text-2xl">Download the app (won't take a minute) to enable the entire fullscreen experience.</p>
            
            <UiButton link to="/download" variant="primary" onClick={handleModalClose}>
              Download Now
            </UiButton>
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}
