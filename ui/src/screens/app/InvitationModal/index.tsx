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
import { useReducer, useMemo } from 'react'
import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'
import getAirDetails from '~/utils/shows/getAirDetails'

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

  usePusher(`private-user.${auth.state.data.id}`, 'invitation.received', (event: { invitation: AppPartyInvitation }) => {
    auth.receiveInvitation(event.invitation)
  })

  usePusher(`private-user.${auth.state.data.id}`, 'invitation.cancelled', (event: { invitation: AppPartyInvitation }) => {
    auth.cancelInvitation(event.invitation)
  })

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

  const isLoading = state.isDeclining || state.isAccepting

  const isCancelled = invitation && invitation.action === 'cancelled'

  return (
    <UiModal isOpen={invitation != null} shouldCloseOnOverlayClick={false}>
      {invitation != null && <div className={cx('invitation-modal', { 'is-cancelled': isCancelled })}>
        <div className="actions">
          {isCancelled && <UiButton onClick={handleCloseCancelled} disabled={isLoading}>
            Close
          </UiButton>}

          {!isCancelled && (
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

          <div
            className="thumbnail"
            style={{ backgroundImage: `url(${invitation.party.video.show.preview_image})` }}>
            <div className="overlay" />
            <div className="details">
              <div className="tag">
                <h6 className="ui-subheading">{getAirDetails(invitation.party.video)}</h6>
              </div>
              <h3 className="title">{invitation.party.video.show.title}</h3>
            </div>
          </div>
        </div>

        <div className="invitation-modal-expiration">
          {/*<h6 className="ui-subheading">
            Expires in 10
            <span className="invitation-modal-expiration-lowercaps">s</span>
          </h6>*/}

          {isCancelled && <h6 className="ui-subheading">
            <span className='invitation-modal-expiration-warning-icon'>
              <i className='fa fa-exclamation-circle' />
            </span>
            Invitation no longer exists
          </h6>}
        </div>
      </div>}
    </UiModal>
  )
}

export default InvitationModal
