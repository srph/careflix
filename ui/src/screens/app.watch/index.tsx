import './style'
import * as React from 'react'
import AppHeadingSettings from '~/screens/app/AppHeadingSettings'

import { useReducer, useMemo } from 'react'
import { usePusher } from '~/hooks/usePusher'
import { useAsyncEffect } from 'use-async-effect'
import useReactRouter from 'use-react-router'
import axios from '~/lib/axios'
import immer from 'immer'

import { Context } from './Context'
import { State, ContextType, Action, RouteParams } from './types'

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
        party: action.payload.party
      }
    }

    case 'data:sync-state': {
      return immer(state, draft => {
        draft.party.current_time = action.payload.state.current_time
        draft.party.is_playing = action.payload.state.is_playing
      })
    }

    case 'invitation.send': {
      return {
        ...state,
        party: immer(state.party, draft => {
          draft.invitations.push(action.payload.invitation)
        })
      }
    }

    case 'invitation.cancel': {
      return {
        ...state,
        party: immer(state.party, draft => {
          draft.invitations = draft.invitations.filter(invitation => invitation.id !== action.payload.invitation.id)
        })
      }
    }

    case 'invitation.accept': {
      return {
        ...state,
        party: immer(state.party, draft => {
          draft.members.push(action.payload.member)
          draft.invitations = draft.invitations.filter(invitation => invitation.id !== action.payload.invitation.id)
        })
      }
    }

    case 'invitation.decline': {
      return {
        ...state,
        party: immer(state.party, draft => {
          draft.invitations = draft.invitations.filter(invitation => invitation.id !== action.payload.invitation.id)
        })
      }
    }

    case 'presence': {
      return {
        ...state,
        party: immer(state.party, draft => {
          const user = draft.members.find(user => user.id === Number(action.payload.id))
          if (user == null) return
          user.pivot.is_active = action.payload.isActive
        })
      }
    }
  }

  return state
}

/**
 * Use this to create a route instead of typing everything down
 */
function AppWatch(props: ReactComponentWrapper) {
  const { match } = useReactRouter<RouteParams>()

  const [state, dispatch] = useReducer(reducer, {
    party: null,
    isLoading: true
  })

  useAsyncEffect(
    async () => {
      dispatch({
        type: 'data:init'
      })

      const [err, res] = await axios.get(`/api/parties/${match.params.partyId}`)

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
    []
  )

  usePusher(
    state.party ? `presence-chat-party.${state.party.id}` : '',
    'pusher:member_added',
    (event: PusherPresenceEvent) => {
      dispatch({
        type: 'presence',
        payload: {
          id: event.id,
          isActive: true
        }
      })
    },
    state.party == null
  )

  usePusher(
    state.party ? `presence-chat-party.${state.party.id}` : '',
    'pusher:member_removed',
    (event: PusherPresenceEvent) => {
      dispatch({
        type: 'presence',
        payload: {
          id: event.id,
          isActive: false
        }
      })
    },
    state.party == null
  )

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
          invitations: state.party.invitations
        }
      }
    })
  }

  const context = useMemo<ContextType>(() => {
    return {
      ...state,
      onCancel: handleCancel,
      onInvite: handleInvite,
      onAccept: handleAccept,
      onDecline: handleDecline,
      onChangeVideo: handleChangeVideo
    }
  }, [state])

  if (state.isLoading) {
    return null
  }

  return (
    <React.Fragment>
      <AppHeadingSettings title="Watch" backUrl="/" />

      <Context.Provider value={context}>{props.children}</Context.Provider>
    </React.Fragment>
  )
}

export default AppWatch
