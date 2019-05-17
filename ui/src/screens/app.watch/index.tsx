import "./style";
import * as React from "react";
import { NavLink } from "react-router-dom";
import AppHeadingSettings from '~/screens/app/AppHeadingSettings'

import { useReducer } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import useReactRouter from 'use-react-router'
import axios from '~/lib/axios'

import { Context } from './Context'
import { State, Action } from './types'

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
  }

  return state
}

/**
 * Use this to create a route instead of typing everything down
 */
function AppWatch(props: ReactComponentWrapper) {
  const { match } = useReactRouter()

  const [state, dispatch] = useReducer(reducer, {
    party: null,
    isLoading: true
  })

  useAsyncEffect(async () => {
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
  }, null, [])

  if (state.isLoading) {
    return null
  }

  return (
    <React.Fragment>
      <AppHeadingSettings title="Watch" backUrl="/" />

      <div className="nav-tabs">
        <NavLink to={`/watch/${state.party.id}`} className="link" exact activeClassName="is-active">
          Watch
        </NavLink>

        <NavLink to={`/watch/${state.party.id}/invite`} className="link" activeClassName="is-active">
          Invite Friends
        </NavLink>
      </div>

      <Context.Provider value={state}>
        {props.children}
      </Context.Provider>
    </React.Fragment>
  );
}

export default AppWatch;
