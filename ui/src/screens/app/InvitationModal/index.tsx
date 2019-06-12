import './style.css'
import * as React from 'react'
import UiModal from '~/components/UiModal'
import UiButton from '~/components/UiButton'
import UiAvatar from '~/components/UiAvatar'
import cx from 'classnames'

// import useCountdownTimer from '~/components/CountdownTimer'
import axios from '~/lib/axios'
import history from '~/lib/history'
import { usePusher } from '~/hooks/usePusher'
import { useRef, useEffect, useReducer, useMemo } from 'react'
import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'
import getVideoDetails from '~/utils/shows/getVideoDetails'

import { useNow } from '~/hooks/useNow';
import { parse, isBefore } from 'date-fns'
import getFormattedRemainingTime from '~utils/date/getFormattedRemainingTime'

import asset_invitation from '~/assets/audio/invitation.ogg'

interface State {
  isAccepting: boolean
  isDeclining: boolean
}

type InvitationAction = 'accept' | 'decline'

type Action =
  | ReducerAction<'action:init', { action: InvitationAction }>
  | ReducerAction<'action:success', { action: InvitationAction }>
  | ReducerAction<'action:error', { action: InvitationAction }>
  | ReducerAction<'reset'>

const init = () => {
  return {
    isAccepting: false,
    isDeclining: false
  }
}

const reducer = (state: State, action: Action): State => {
  const key: string = action.type !== 'reset' && action.payload.action === 'accept' ? 'isAccepting' : 'isDeclining'

  switch (action.type) {
    case 'action:init': {
      return {
        ...state,
        [key]: true
      }
    }

    case 'action:success': {
      return {
        ...state,
        [key]: false
      }
    }

    case 'action:error': {
      return {
        ...state,
        [key]: false
      }
    }

    case 'reset': {
      return init()
    }
  }
}

function InvitationModal() {
  const auth = useUnstated(AuthContainer)

  const invitation = auth.state.data.invitations[0]

  const [state, dispatch] = useReducer(reducer, init())

  usePusher(
    `private-user.${auth.state.data.id}`,
    'invitation.received',
    (event: { invitation: AppPartyInvitation }) => {
      auth.receiveInvitation(event.invitation)
    }
  )

  usePusher(
    `private-user.${auth.state.data.id}`,
    'invitation.cancelled',
    (event: { invitation: AppPartyInvitation }) => {
      auth.cancelInvitation(event.invitation)
    }
  )

  const notificationRef = useRef<HTMLAudioElement>()

  useEffect(() => {
    if (invitation != null) {
      notificationRef.current.play()
    }
  }, [invitation])

  async function handleAccept() {
    dispatch({
      type: 'action:init',
      payload: { action: 'accept' }
    })

    const [err, res] = await axios.post(`/api/invitations/${invitation.id}/accept`)

    if (err) {
      return dispatch({
        type: 'action:error',
        payload: { action: 'accept' }
      })
    }

    dispatch({
      type: 'action:success',
      payload: { action: 'accept' }
    })

    auth.shiftInvitations()

    history.push(`/watch/${res.data.id}`)
  }

  async function handleDecline() {
    dispatch({
      type: 'action:init',
      payload: { action: 'decline' }
    })

    const [err, res] = await axios.post(`/api/invitations/${invitation.id}/decline`)

    if (err) {
      return dispatch({
        type: 'action:error',
        payload: { action: 'decline' }
      })
    }

    dispatch({
      type: 'action:success',
      payload: { action: 'decline' }
    })

    auth.shiftInvitations()
  }

  function handleCloseCancelled() {
    auth.shiftInvitations()
  }

  const isLoading = (
    state.isDeclining || state.isAccepting
  )

  const now = useNow({
    interval: 1000
  })

  const expiration = useMemo(() => {
    return invitation && parse(invitation.expires_at)
  }, [invitation && invitation.id])

  const isInvalid = useMemo(() => {
    return invitation && (invitation.action === 'cancelled' || isBefore(expiration, now))
  }, [now])

  return (
    <React.Fragment>
      <UiModal isOpen={invitation != null} shouldCloseOnOverlayClick={false}>
        {invitation != null && (
          <div className={cx('invitation-modal', { 'is-cancelled': isInvalid })}>
            <div className="actions">
              {isInvalid && (
                <UiButton onClick={handleCloseCancelled} disabled={isLoading}>
                  Close
                </UiButton>
              )}

              {!isInvalid && (
                <React.Fragment>
                  <UiButton onClick={handleDecline} disabled={isLoading}>
                    {state.isDeclining ? 'Declining...' : 'Decline'}
                  </UiButton>

                  <UiButton onClick={handleAccept} disabled={isLoading} variant="primary">
                    {state.isAccepting ? 'Accepting' : 'Accept'}
                  </UiButton>
                </React.Fragment>
              )}
            </div>

            <div className="invitation-modal-card">
              <div className="user">
                <div className="avatar">
                  <UiAvatar size="m" img={invitation.sender.avatar} />
                </div>

                <div className="details">
                  <h2>{invitation.sender.name}</h2>
                  <div className="subheading">
                    <h6 className="ui-subheading">Invited you to watch</h6>
                  </div>
                </div>
              </div>

              <div className="thumbnail" style={{ backgroundImage: `url(${invitation.party.video.show.preview_image})` }}>
                <div className="overlay" />
                <div className="details">
                  <div className="tag">
                    <h6 className="ui-subheading">{getVideoDetails(invitation.party.video)}</h6>
                  </div>
                  <h3 className="title">{invitation.party.video.show.title}</h3>
                </div>
              </div>
            </div>

            <div className="invitation-modal-expiration">
              {!isInvalid && (
                <h6 className="ui-subheading">
                  Expires in
                  <span className="invitation-modal-expiration-lowercaps">
                    &nbsp;{getFormattedRemainingTime(expiration, now)}
                  </span>
                </h6>
              )}

              {isInvalid && (
                <h6 className="ui-subheading">
                  <span className="invitation-modal-expiration-warning-icon">
                    <i className="fa fa-exclamation-circle" />
                  </span>
                  Invitation no longer exists
                </h6>
              )}
            </div>
          </div>
        )}
      </UiModal>

      <audio className="invitation-notification-audio" ref={notificationRef}>
        <source src={asset_invitation} type="audio/ogg" />
      </audio>
    </React.Fragment>
  )
}

export default InvitationModal
