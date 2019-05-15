import './style'

import * as React from 'react'
import { useAsyncEffect } from 'use-async-effect'
import axios from '~/lib/axios'
import history from '~/lib/history'

interface State {
  shows: AppShow[]
  isLoading: boolean
}

const reducer = (state: State, action) => {
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
  }

  return state
}

function AppHome() {
  const [state, dispatch] = React.useReducer(reducer, {
    shows: [],
    isLoading: true
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
    console.log(show)

    const [err, res] = await axios.post('/api/parties', {
      // @TODO Work on series
      show_video_id: show.movie.id
    })

    if (err) {
      // Launch toast notification
    }

    history.push(`/watch/${res.data.id}`)
  }

  return (
    <div className="show-list">
      <h5 className="ui-subheading">New Releases</h5>

      <div className="show-carousel">
        <div className="inner">
          {state.shows.map((show, j) => (
              <div className="card" key={j}>
                <button
                  type="button"
                  className="show-carousel-card"
                  style={{ backgroundImage: `url(${require('~/assets/show-thumbnail-218x146.jpg')})` }}
                  onClick={() => handleShowClick(show)}>
                  <div className="overlay" />

                  <div className="details">
                    <div className="tags">
                      <span className="tag">{new Date(show.air_start).getFullYear()}</span>
                    </div>

                    <h3 className="title">{show.title}</h3>
                  </div>
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  )

  // @TODO
  // We're not supporting genres or tags yet
  // Don't forget to bring group shows by genre, and display each show's genres
  // return (
  //   <React.Fragment>
  //     {Array(10)
  //       .fill(0)
  //       .map((category, i) => (
  //         <div className="show-list" key={i}>
  //           <h5 className="ui-subheading">New Releases</h5>

  //           <div className="show-carousel">
  //             <div className="inner">
  //               {Array(10)
  //                 .fill(0)
  //                 .map((show, j) => (
  //                   <div className="card" key={j}>
  //                     <button
  //                       type="button"
  //                       className="show-carousel-card"
  //                       style={{ backgroundImage: `url(${require('~/assets/show-thumbnail-218x146.jpg')})` }}
  //                       onClick={() => handleShowClick(j)}>
  //                       <div className="overlay" />

  //                       <div className="details">
  //                         <div className="tags">
  //                           <span className="tag">2018</span>

  //                           <span className="tag">•</span>

  //                           <span className="tag">Anime</span>
  //                         </div>

  //                         <h3 className="title">My Hero Academia</h3>
  //                       </div>
  //                     </button>
  //                   </div>
  //                 ))}
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //   </React.Fragment>
  )
}

export default AppHome
