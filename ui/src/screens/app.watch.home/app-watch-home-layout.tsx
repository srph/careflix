import * as React from 'react'
import { createContext, use, useMemo, useState } from 'react'
import { useAuthUser } from '~/lib/auth/auth-queries'
import { type ActivityLevel, useActivityLevel } from './app-watch-home-activity/app-watch-home-activity-level'

// The column beside the picture shows chat, the invite panel over it, or nothing.
export type WatchSidebar = 'chat' | 'invite' | 'closed'
// One modal at a time.
export type WatchModal = 'season-selection' | 'keyboard-info' | null

export interface WatchLayout {
  sidebar: WatchSidebar
  setSidebar: (sidebar: WatchSidebar) => void
  /** Opens chat, or closes the sidebar. */
  toggleChat: () => void
  modal: WatchModal
  setModal: (modal: WatchModal) => void
  // How much of the room the picture shows while chat is closed, chosen from the bell.
  activityLevel: ActivityLevel
  setActivityLevel: (level: ActivityLevel) => void
}

const LayoutContext = createContext<WatchLayout | null>(null)

/** What's open around the picture. Nothing about the video itself. */
export function AppWatchHomeLayout(props: ReactComponentWrapper) {
  const user = useAuthUser()
  const [sidebar, setSidebar] = useState<WatchSidebar>('chat')
  const [modal, setModal] = useState<WatchModal>(null)
  const [activityLevel, setActivityLevel] = useActivityLevel(user.id)

  const layout = useMemo<WatchLayout>(
    () => ({
      sidebar,
      setSidebar,
      toggleChat: () => setSidebar((current) => (current === 'closed' ? 'chat' : 'closed')),
      modal,
      setModal,
      activityLevel,
      setActivityLevel
    }),
    [sidebar, modal, activityLevel, setActivityLevel]
  )

  return <LayoutContext value={layout}>{props.children}</LayoutContext>
}

export function useWatchLayout(): WatchLayout {
  const layout = use(LayoutContext)
  if (!layout) throw new Error('useWatchLayout needs the watch page')
  return layout
}
