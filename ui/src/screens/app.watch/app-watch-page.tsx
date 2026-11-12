import * as React from 'react'
import { AppHeadingSettings } from '~/screens/app/app-heading-settings'
import { UiButton } from '~/components/ui-button/ui-button'

import { useReducer, useMemo } from 'react'
import { usePusher } from '~/hooks/use-pusher'
import { usePresence } from '~/hooks/use-presence'
import { useAsyncEffect } from '~/hooks/use-async-effect'
import { useParams } from 'react-router'
import { axios } from '~/lib/axios/axios'
import immer from 'immer'

import { AppWatchContext } from './app-watch-context'
import { State, ContextType, Action } from './app-watch-types'

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'data:init': {
      return {
        ...state,
        isLoading: true
      }
    }

    case 'data:success': {
      return {
        ...state,
        party: action.payload.party,
        isLoading: false
      }
    }

    case 'data:error': {
      return {
        ...state,
        isLoading: false
      }
    }

    case 'data:update': {
      return {
        ...state,
        party: action.payload.party,
        playbackRevision: state.playbackRevision + 1
      }
    }

    case 'data:sync-state': {
      if (!state.party) return state
      return {
        ...state,
        playbackRevision: state.playbackRevision + 1,
        party: { ...state.party, current_time: action.payload.state.current_time, is_playing: action.payload.state.is_playing }
      }
    }

    case 'invitation.send': {
      if (!state.party) return state
      if (state.party.members.some(member => String(member.id) === String(action.payload.invitation.recipient.id)) ||
        state.party.invitations?.some(invitation => invitation.id === action.payload.invitation.id)) return state
      return {
        ...state,
        party: immer(state.party, draft => {
          (draft.invitations ??= []).push(action.payload.invitation)
        })
      }
    }

    case 'invitation.cancel': {
      if (!state.party) return state
      return {
        ...state,
        party: immer(state.party, draft => {
          draft.invitations = (draft.invitations ?? []).filter(invitation => invitation.id !== action.payload.invitation.id)
        })
      }
    }

    case 'invitation.accept': {
      if (!state.party) return state
      return {
        ...state,
        party: immer(state.party, draft => {
          if (!draft.members.some(member => String(member.id) === String(action.payload.member.id))) draft.members.push(action.payload.member)
          draft.invitations = (draft.invitations ?? []).filter(invitation => invitation.id !== action.payload.invitation.id)
        })
      }
    }

    case 'member.join': {
      if (!state.party) return state
      return {
        ...state,
        party: immer(state.party, draft => {
          if (!draft.members.some(member => String(member.id) === String(action.payload.member.id))) draft.members.push(action.payload.member)
        })
      }
    }

    case 'invitation.decline': {
      if (!state.party) return state
      return {
        ...state,
        party: immer(state.party, draft => {
          draft.invitations = (draft.invitations ?? []).filter(invitation => invitation.id !== action.payload.invitation.id)
        })
      }
    }
  }

  return state
}

/**
 * Use this to create a route instead of typing everything down
 */
export function AppWatchPage(props: ReactComponentWrapper) {
  const params = useParams<'partyId'>()
  // Switching rooms must reset the player, chat, and all room subscriptions together.
  return <WatchRoom key={params.partyId} partyId={params.partyId!}>{props.children}</WatchRoom>
}

function WatchRoom(props: ReactComponentWrapper & { partyId: string }) {
  const [attempt, retry] = useReducer(value => value + 1, 0)

  const [state, dispatch] = useReducer(reducer, {
    party: null,
    isLoading: true,
    playbackRevision: 0
  })

  useAsyncEffect(
    async () => {
      dispatch({
        type: 'data:init'
      })

      const [err, res] = await axios.get(`/api/parties/${props.partyId}`)

      if (err) {
        return dispatch({
          type: 'data:error'
        })
      }

      dispatch({
        type: 'data:success',
        payload: { party: res.data }
      })
    },
    null,
    [attempt]
  )

  const activeMembers = usePresence(state.party ? `presence-chat-party.${state.party.id}` : '')
  const party = useMemo(() => {
    if (!state.party || !activeMembers) return state.party
    return {
      ...state.party,
      members: state.party.members.map(member => ({
        ...member,
        pivot: { ...member.pivot, is_active: activeMembers.has(String(member.id)) }
      }))
    }
  }, [state.party, activeMembers])

  usePusher(state.party ? `private-party.${state.party.id}` : '', 'member.joined', (event: { member: AppPartyMember }) => {
    dispatch({ type: 'member.join', payload: { member: event.member } })
  }, state.party == null)

  usePusher(
    state.party ? `private-party.${state.party.id}` : '',
    'state',
    function(event: { state: AppPartyState }) {
      dispatch({
        type: 'data:sync-state',
        payload: { state: event.state }
      })
    },
    state.party == null
  )

  function handleInvite(invitation: AppPartyInvitation) {
    dispatch({
      type: 'invitation.send',
      payload: { invitation }
    })
  }

  function handleCancel(invitation: AppPartyInvitation) {
    dispatch({
      type: 'invitation.cancel',
      payload: { invitation }
    })
  }

  function handleAccept(invitation: AppPartyInvitation, member: AppPartyMember) {
    dispatch({
      type: 'invitation.accept',
      payload: { invitation, member }
    })
  }

  function handleDecline(invitation: AppPartyInvitation) {
    dispatch({
      type: 'invitation.decline',
      payload: { invitation }
    })
  }

  function handleChangeVideo(party: AppParty) {
    dispatch({
      type: 'data:update',
      payload: {
        party: {
          ...party,
          invitations: state.party?.invitations
        }
      }
    })
  }

  const context = useMemo<ContextType>(() => {
    return {
      ...state,
      party,
      onCancel: handleCancel,
      onInvite: handleInvite,
      onAccept: handleAccept,
      onDecline: handleDecline,
      onChangeVideo: handleChangeVideo
    }
  }, [state, party])

  if (state.isLoading) {
    return null
  }

  if (!state.party) {
    return <div className="mx-auto my-20 max-w-120 p-6 text-center" role="alert">
      <p className="mb-4">We couldn’t load this room. Please try again.</p>
      <UiButton onClick={retry}>Retry</UiButton>
    </div>
  }

  return (
    <React.Fragment>
      <AppHeadingSettings title="Watch" backUrl="/" />

      <AppWatchContext.Provider value={context}>{props.children}</AppWatchContext.Provider>
    </React.Fragment>
  )
}
