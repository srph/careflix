import * as React from 'react'
import { PlayaProvider } from '~/components/playa/playa'
import { useRouterBlock } from '~/hooks/use-router-block'
import { useParty } from '~/screens/app.watch/use-party'
import { usePartyPlaya } from './use-party-playa'

/** The room's Playa, for everything on the page: the picture, the sidebar's reactions, the modals and hotkeys. */
export function AppWatchHomePlaya(props: ReactComponentWrapper) {
  const party = useParty()
  const playa = usePartyPlaya(party)

  useRouterBlock(
    (location) => {
      if (!playa.state.isPlaying) return
      if (location.pathname.startsWith('/watch')) return
      return 'Are you sure you want to leave this page?'
    },
    [playa.state.isPlaying]
  )

  return <PlayaProvider playa={playa}>{props.children}</PlayaProvider>
}
