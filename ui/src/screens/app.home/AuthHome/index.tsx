import './style'

import * as React from 'react'
import { useAsyncEffect } from 'use-async-effect'
import axios from '~/lib/axios'
import UiContainer from '~/components/UiContainer'
import UiPlainButton from '~/components/UiPlainButton'
import UiSpacer from '~/components/UiSpacer'
import ShowModal from '../ShowModal'
import YouWereWatching from '../YouWereWatching'
import parseStandardTime from '~/utils/date/parseStandardTime'

interface State {
  shows: AppShow[]
  isLoading: boolean
  selectedShow: AppShow | null
}

type Action =
  | ReducerAction<'data:init'>
  | ReducerAction<'data:success', { shows: AppShow[] }>
  | ReducerAction<'data:error'>
  | ReducerAction<'show:select', { show: AppShow }>
  | ReducerAction<'show:close', { show: AppShow }>

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
        shows: action.payload.shows,
        isLoading: false
      }
    }

    case 'data:error': {
      return {
        ...state,
        isLoading: false
      }
    }

    case 'show:select': {
      return {
        ...state,
        selectedShow: action.payload.show
      }
    }

    case 'show:close': {
      return {
        ...state,
        selectedShow: null
      }
    }
  }

  return state
}

function AuthHome() {
  const [state, dispatch] = React.useReducer(reducer, {
    shows: [],
    isLoading: true,
    selectedShow: null
  })

  useAsyncEffect(
    async () => {
      const [err, res] = await axios.get('/api/shows')

      if (err) {
        dispatch({ type: 'data:error' })
        // Launch toast notification
      }

      dispatch({
        type: 'data:success',
        payload: { shows: res.data }
      })
    },
    null,
    []
  )

  async function handleShowClick(show: AppShow) {
    dispatch({
      type: 'show:select',
      payload: { show }
    })
  }

  function handleShowClose() {
    dispatch({
      type: 'show:close'
    })
  }

  return (
    <React.Fragment>
      <YouWereWatching />

      <UiSpacer size={4} />

      <UiContainer size="xl">
        <h5 className="ui-subheading">New Releases</h5>

        <UiSpacer size={2} />

        <div className="show-layout">
          {state.shows.map((show, j) => (
            <div className="column" key={j}>
              <UiPlainButton className="show-carousel-card-button">
                <div className="show-carousel-card-container">
                  <div
                    className="show-carousel-card"
                    style={{ backgroundImage: `url(${show.preview_image})` }}
                    onClick={() => handleShowClick(show)}>
                    <div className="overlay" />

                    <div className="details">
                      <div className="tags">
                        <span className="tag">{parseStandardTime(show.air_start).getFullYear()}</span>
                      </div>

                      <h3 className="title">{show.title}</h3>
                    </div>
                  </div>
                </div>
              </UiPlainButton>
            </div>
          ))}
        </div>

        <ShowModal show={state.selectedShow} onClose={handleShowClose} />
      </UiContainer>
    </React.Fragment>
  )
}

export default AuthHome
