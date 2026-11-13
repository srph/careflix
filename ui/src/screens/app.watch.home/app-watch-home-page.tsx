import * as React from 'react'
import { AppWatchHomeHotkeys } from './app-watch-home-hotkeys'
import { AppWatchHomeKeyboardInfoModal } from './app-watch-home-keyboard-info-modal'
import { AppWatchHomeLayout } from './app-watch-home-layout'
import { AppWatchHomeMobileTitleBar } from './app-watch-home-mobile-title-bar'
import { AppWatchHomePlaya } from './app-watch-home-playa'
import { AppWatchHomeSeasonSelectionModal } from './app-watch-home-season-selection-modal'
import { AppWatchHomeShell } from './app-watch-home-shell'
import { AppWatchHomeSidebar } from './app-watch-home-sidebar'
import { AppWatchHomeStage } from './app-watch-home-stage/app-watch-home-stage'

/**
 * The watch room: Layout (what's open) around Playa (the video and what's on it), and inside them
 * the picture, the sidebar and two modals. The room itself comes from AppWatchPage (`useParty()`).
 */
export function AppWatchHomePage(props: ReactComponentWrapper) {
  return (
    <AppWatchHomeLayout>
      <AppWatchHomePlaya>
        <AppWatchHomeHotkeys />

        <AppWatchHomeShell>
          <AppWatchHomeStage />
          <AppWatchHomeMobileTitleBar />
          <AppWatchHomeSidebar />
        </AppWatchHomeShell>

        {props.children}

        <AppWatchHomeSeasonSelectionModal />
        <AppWatchHomeKeyboardInfoModal />
      </AppWatchHomePlaya>
    </AppWatchHomeLayout>
  )
}
