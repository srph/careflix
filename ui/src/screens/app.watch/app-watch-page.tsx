import * as React from 'react'
import { useMemo } from 'react'
import { useParams } from 'react-router'
import { AppHeadingSettings } from '~/screens/app/app-heading-settings'
import { UiButton } from '~/components/ui-button/ui-button'
import { usePusher } from '~/hooks/use-pusher'
import { usePresence } from '~/hooks/use-presence'

import { AppWatchContext } from './app-watch-context'
import { addMember } from './app-watch-party-updates'
import { usePartyQuery, useSetParty } from './queries/app-watch-party-queries'

/**
 * Use this to create a route instead of typing everything down
 */
export function AppWatchPage(props: ReactComponentWrapper) {
  const params = useParams<'partyId'>()
  // Switching rooms must reset the player, chat, and all room subscriptions together.
  return (
    <WatchRoom key={params.partyId} partyId={params.partyId!}>
      {props.children}
    </WatchRoom>
  )
}

function WatchRoom(props: ReactComponentWrapper & { partyId: string }) {
  const query = usePartyQuery(props.partyId)
  const setParty = useSetParty(props.partyId)
  const party = query.data

  const activeMembers = usePresence(party ? `presence-chat-party.${party.id}` : '')
  const context = useMemo(() => {
    if (!party) return null
    if (!activeMembers) return { party }
    return {
      party: {
        ...party,
        members: party.members.map((member) => ({
          ...member,
          pivot: { ...member.pivot, is_active: activeMembers.has(String(member.id)) }
        }))
      }
    }
  }, [party, activeMembers])

  usePusher(
    party ? `private-party.${party.id}` : '',
    'member.joined',
    (event: { member: AppPartyMember }) => setParty((current) => addMember(current, event.member)),
    party == null
  )

  // A retry shows nothing while it loads, like the first load.
  if (query.status === 'pending' || (query.status === 'error' && query.fetchStatus === 'fetching')) {
    return null
  }

  if (query.status === 'error' || !context) {
    return (
      <div className="mx-auto my-20 max-w-120 p-6 text-center" role="alert">
        <p className="mb-4">We couldn’t load this room. Please try again.</p>
        <UiButton onClick={() => query.refetch()}>Retry</UiButton>
      </div>
    )
  }

  return (
    <React.Fragment>
      <AppHeadingSettings title="Watch" backUrl="/" />

      <AppWatchContext.Provider value={context}>{props.children}</AppWatchContext.Provider>
    </React.Fragment>
  )
}
