import './style'

import * as React from 'react'
import UiButton from '~/components/UiButton'
import UiPresenceAvatar from '~/components/UiPresenceAvatar'
import UiInput from '~/components/UiInput'
import UiLoader from '~/components/UiLoader'
import UiPlainButton from '~/components/UiPlainButton'
import UiModal from '~/components/UiModal'

import immer from 'immer'
import { useReducer, useMemo, useEffect } from 'react'
import { usePartyContext } from '~/screens/app.watch/Context'
import { usePusher } from '~/hooks/usePusher'
import { useUpdateDebounce } from '~/hooks/useUpdateDebounce'
import axios from '~/lib/axios'
import toSearchObject from '~/utils/toSearchObject'
import toSearchIndexObject from '~/utils/toSearchIndexObject'

import { useNow } from '~/hooks/useNow'
import { isBefore, parse } from 'date-fns'
import getFormattedRemainingTime from '~utils/date/getFormattedRemainingTime'

interface State {
  data: AppUser[]
  isLoading: boolean
  isSendingInvitation: {
    [key: number]: boolean
  }
  isCancellingInvitation: {
    [key: number]: boolean
  }
  input: string
}

type Action =
  | ReducerAction<'request:init'>
  | ReducerAction<'request:success', { data: any[] }>
  | ReducerAction<'request:error'>
  | ReducerAction<'input', { input: string }>
  | ReducerAction<'invitation.send:init', { id: AppId }>
  | ReducerAction<'invitation.send:error', { id: AppId }>
  | ReducerAction<'invitation.send:success', { id: AppId }>
  | ReducerAction<'invitation.cancel:init', { id: AppId }>
  | ReducerAction<'invitation.cancel:error', { id: AppId }>
  | ReducerAction<'invitation.cancel:success', { id: AppId }>
  | ReducerAction<'modal:toggle', { open: boolean }>
  | ReducerAction<'presence', { id: AppId; isOnline: boolean }>

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'request:init': {
      return {
        ...state,
        isLoading: true
      }
    }

    case 'request:success': {
      return {
        ...state,
        data: action.payload.data,
        isLoading: false
      }
    }

    case 'request:error': {
      return {
        ...state,
        isLoading: false
      }
    }

    case 'input': {
      return {
        ...state,
        input: action.payload.input,
        // We'll empty the current list if the input gets cleared
        data: action.payload.input ? [] : state.data
      }
    }

    case 'invitation.send:init': {
      return {
        ...state,
        isSendingInvitation: immer(state.isSendingInvitation, draft => {
          draft[action.payload.id] = true
        })
      }
    }

    case 'invitation.send:success': {
      return {
        ...state,
        isSendingInvitation: immer(state.isSendingInvitation, draft => {
          delete draft[action.payload.id]
        })
      }
    }

    case 'invitation.send:error': {
      return {
        ...state,
        isSendingInvitation: immer(state.isSendingInvitation, draft => {
          delete draft[action.payload.id]
        })
      }
    }

    case 'invitation.cancel:init': {
      return {
        ...state,
        isCancellingInvitation: immer(state.isCancellingInvitation, draft => {
          draft[action.payload.id] = true
        })
      }
    }

    case 'invitation.cancel:success': {
      return {
        ...state,
        isCancellingInvitation: immer(state.isCancellingInvitation, draft => {
          delete draft[action.payload.id]
        })
      }
    }

    case 'invitation.cancel:error': {
      return {
        ...state,
        isCancellingInvitation: immer(state.isCancellingInvitation, draft => {
          delete draft[action.payload.id]
        })
      }
    }

    case 'presence': {
      return {
        ...state,
        data: immer(state.data, draft => {
          const user = draft.find(user => user.id === Number(action.payload.id))
          if (user == null) return
          user.is_online = action.payload.isOnline
        })
      }
    }
  }
}

interface Props {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const init = {
  data: [],
  isLoading: false,
  isSendingInvitation: {},
  isCancellingInvitation: {},
  input: ''
}

/**
 * Use this to create a route instead of typing everything down
 */
function ChatInvitationModal(props: Props) {
  const context = usePartyContext()

  const [state, dispatch] = useReducer(reducer, init)

  usePusher(`presence-chat`, 'pusher:member_added', (event: PusherPresenceEvent) => {
    dispatch({
      type: 'presence',
      payload: {
        id: event.id,
        isOnline: true
      }
    })
  })

  usePusher(`presence-chat`, 'pusher:member_removed', (event: PusherPresenceEvent) => {
    dispatch({
      type: 'presence',
      payload: {
        id: event.id,
        isOnline: false
      }
    })
  })

  usePusher(`private-party.${context.party.id}`, 'invitation.sent', (event: { invitation: AppPartyInvitation }) => {
    context.onInvite(event.invitation)
  })

  usePusher(
    `private-party.${context.party.id}`,
    'invitation.cancelled',
    (event: { invitation: AppPartyInvitation }) => {
      context.onCancel(event.invitation)
    }
  )

  usePusher(
    `private-party.${context.party.id}`,
    'invitation.accepted',
    (event: { invitation: AppPartyInvitation; member: AppPartyMember }) => {
      context.onAccept(event.invitation, event.member)
    }
  )

  usePusher(`private-party.${context.party.id}`, 'invitation.declined', (event: { invitation: AppPartyInvitation }) => {
    context.onDecline(event.invitation)
  })

  async function request() {
    dispatch({
      type: 'request:init'
    })

    const [err, res] = await axios.get(`/api/parties/${context.party.id}/invitations/search`, {
      params: state.input.length
        ? {
            search: state.input
          }
        : {}
    })

    if (err) {
      return dispatch({
        type: 'request:error'
      })
    }

    dispatch({
      type: 'request:success',
      payload: { data: res.data }
    })
  }

  useEffect(() => {
    request()
  }, [])

  // @TODO We don't want multiple requests initially. `react-use.useDebounce`
  // doesn't do this, and our new function doesn't either. Investigate why.
  useUpdateDebounce(request, 500, [state.input])

  function handleInput(evt: React.FormEvent<HTMLInputElement>) {
    dispatch({
      type: 'input',
      payload: { input: evt.currentTarget.value }
    })
  }

  const isMemberMap = useMemo(() => {
    return toSearchObject(context.party.members, 'id')
  }, [context.party.members])

  const invitationMap = useMemo(() => {
    return toSearchIndexObject(context.party.invitations, 'recipient.id')
  }, [context.party.invitations])

  async function handleInvite(id: AppId) {
    if (state.isSendingInvitation[id]) {
      return
    }

    dispatch({
      type: 'invitation.send:init',
      payload: { id }
    })

    const [err, res] = await axios.post(`/api/parties/${context.party.id}/invitations/send`, {
      recipient_id: id
    })

    if (err) {
      return dispatch({
        type: 'invitation.send:error',
        payload: { id }
      })
    }

    dispatch({
      type: 'invitation.send:success',
      payload: { id }
    })

    context.onInvite(res.data)
  }

  async function handleCancel(invitation: AppPartyInvitation) {
    if (state.isCancellingInvitation[invitation.recipient.id]) {
      return
    }

    dispatch({
      type: 'invitation.cancel:init',
      payload: { id: invitation.recipient.id }
    })

    const [err, res] = await axios.post(`/api/invitations/${invitation.id}/cancel`)

    if (err) {
      return dispatch({
        type: 'invitation.cancel:error',
        payload: { id: invitation.recipient.id }
      })
    }

    dispatch({
      type: 'invitation.cancel:success',
      payload: { id: invitation.recipient.id }
    })

    context.onCancel(invitation)
  }

  function handleExpire(invitation: AppPartyInvitation) {
    context.onCancel(invitation)
  }

  return (
    <React.Fragment>
      <UiPlainButton className="invite" onClick={props.onOpen}>
        <i className="fa fa-user-plus" />
      </UiPlainButton>

      <UiModal
        isOpen={props.isOpen}
        onClose={props.onClose}
        overlayClassName="app-watch-chat-invitation-overlay"
        modalClassName="app-watch-chat-invitation-modal">
        <div className="heading">
          <h5 className="ui-subheading">Invite people to join</h5>

          <UiPlainButton className="close" onClick={props.onClose}>
            <i className="fa fa-close" />
          </UiPlainButton>
        </div>

        <div className="invite-searchbar">
          <UiInput
            isDark
            type="text"
            placeholder="Search for a friend to invite..."
            value={state.input}
            onChange={handleInput}
          />
        </div>

        {state.isLoading && <UiLoader />}

        <div className="user-list">
          {state.data.map(user => (
            <UserItem
              key={user.id}
              user={user}
              invitation={context.party.invitations[invitationMap[user.id]]}
              isMember={isMemberMap[user.id]}
              isCancellingInvitation={state.isCancellingInvitation[user.id]}
              isSendingInvitation={state.isSendingInvitation[user.id]}
              onInvite={handleInvite}
              onCancel={handleCancel}
              onExpire={handleExpire}
            />
          ))}
        </div>
      </UiModal>
    </React.Fragment>
  )
}

interface UserItemProps {
  user: AppUser
  invitation?: AppPartyInvitation
  isMember: boolean
  isCancellingInvitation: boolean
  isSendingInvitation?: boolean
  onInvite: (id: AppId) => void
  onExpire: (invitation: AppPartyInvitation) => void
  onCancel: (invitation: AppPartyInvitation) => void
}

function UserItem(props: UserItemProps) {
  function handleInvite() {
    props.onInvite(props.user.id)
  }

  function handleCancel() {
    props.onCancel(props.invitation)
  }

  const now = useNow({
    interval: 1000
  })

  const expiration = useMemo(() => {
    return props.invitation && parse(props.invitation.expires_at)
  }, [props.invitation && props.invitation.id])

  const isExpired = useMemo(() => {
    return props.invitation && isBefore(expiration, now)
  }, [now])

  useEffect(() => {
    if (isExpired) {
      props.onExpire(props.invitation)
    }
  }, [isExpired])

  return (
    <div className="user-item">
      <div className="avatar">
        <UiPresenceAvatar user={props.user} size="m" />
      </div>

      <div className="details">
        <h4 className="name">{props.user.name}</h4>
        {props.isMember && <h6 className="meta">Already a member</h6>}
        {Boolean(props.invitation) && (
          <h6 className="meta">
            {isExpired ? 'Invitation expired' : `Expires in ${getFormattedRemainingTime(expiration, now)}`}
          </h6>
        )}
      </div>

      <div className="action">
        {props.invitation != null && (
          <UiButton onClick={handleCancel}>{props.isCancellingInvitation ? 'Cancelling' : 'Cancel'}</UiButton>
        )}

        {!props.isMember && props.invitation == null && (
          <UiButton variant="primary" onClick={handleInvite} disabled={props.isSendingInvitation}>
            {props.isSendingInvitation ? 'Inviting' : 'Invite'}
          </UiButton>
        )}
      </div>
    </div>
  )
}

export default ChatInvitationModal
