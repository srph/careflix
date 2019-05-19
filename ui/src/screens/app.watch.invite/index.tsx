import './style'

import * as React from 'react'
import UiButton from '~/components/UiButton'
import UiAvatar from '~/components/UiAvatar'

import { useReducer } from 'react'
import { usePartyContext } from '~/screens/app.watch/Context'
import useDebounce from 'react-use/lib/useDebounce'
import axios from '~/lib/axios'

interface State {
  data: any[]
  isLoading: boolean
  input: string
}

type Action =
  | ReducerAction<'request:init'>
  | ReducerAction<'request:success', { data: any[] }>
  | ReducerAction<'request:error'>
  | ReducerAction<'input', { input: string }>

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
        input: action.payload.input
      }
    }
  }

  throw new Error(`app.watch.invite: ${action.type} is an invalid action type.`)
}

/**
 * Use this to create a route instead of typing everything down
 */
function AppWatchInvite(props: ReactComponentWrapper) {
  const context = usePartyContext()

  const [state, dispatch] = useReducer(reducer, {
    data: [],
    isLoading: false,
    input: ''
  })

  useDebounce(
    async () => {
      dispatch({
        type: 'request:init'
      })

      const [err, res] = await axios.get(`/api/parties/${context.party.id}/invitations`)

      if (err) {
        return dispatch({
          type: 'request:error'
        })
      }

      dispatch({
        type: 'request:success',
        payload: { data: res.data }
      })
    },
    1000,
    [state.input]
  )

  function handleInput(evt: React.FormEvent<HTMLInputElement>) {
    dispatch({
      type: 'input',
      payload: { input: evt.target.value }
    })
  }

  return (
    <React.Fragment>
      <div className="invite-searchbar">
        <input
          type="text"
          className="ui-input"
          placeholder="Search for a friend to invite..."
          value={state.input}
          onChange={handleInput}
        />
      </div>

      {Array(4)
        .fill(0)
        .map((user, i) => (
          <div className="user-item" key={i}>
            <div className="avatar">
              <UiAvatar img={require('~/assets/dummy-avatar.png')} size="m" />
            </div>

            <div className="details">
              <h3 className="name">Kier Borromeo</h3>
              <h6 className="meta">Expires in 10s</h6>
            </div>

            <div className="action">
              {/* <UiButton>Cancel</UiButton> */}
              <UiButton variant="primary">Accept</UiButton>
            </div>
          </div>
        ))}
    </React.Fragment>
  )
}

export default AppWatchInvite
