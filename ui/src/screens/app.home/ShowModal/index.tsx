import './style'
import * as React from 'react'
import { useReducer, useMemo } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import UiModal from '~/components/UiModal'
import UiSelect from '~/components/UiSelect'
import StandardImageAspectRatio from '~/components/StandardImageAspectRatio'
import getFormattedDurationWithoutSeconds from '~/utils/date/getFormattedDurationWithoutSeconds'
import axios from '~/lib/axios'
import history from '~/lib/history'

interface Props {
  show: AppShow | null
  onClose: () => void
}

interface State {
  groups: AppShowGroup[]
  selectedGroupId: AppId
  isLoading: boolean
}

type Action =
  | ReducerAction<'request:init'>
  | ReducerAction<'request:success', { groups: AppShowGroup[] }>
  | ReducerAction<'request:error'>
  | ReducerAction<'modal:close'>
  | ReducerAction<'group:change', { id: AppId }>

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'request:init': {
      return {
        ...state,
        groups: [],
        isLoading: true
      }
    }

    case 'request:success': {
      return {
        ...state,
        groups: action.payload.groups,
        selectedGroupId: action.payload.groups.length ? action.payload.groups[0].id : -1,
        isLoading: false
      }
    }

    // @TODO
    case 'request:error': {
      return {
        ...state,
        isLoading: false
      }
    }

    case 'modal:close': {
      return {
        ...state,
        groups: [],
        selectedGroupId: -1
      }
    }

    case 'group:change': {
      return {
        ...state,
        selectedGroupId: action.payload.id
      }
    }
  }
}

/**
 * @TODO Add group loader
 * @TODO For series with no shows, we'll show an empty placeholder.
 * @TODO Create party loader
 */
function ShowModal(props: Props) {
  const [state, dispatch] = useReducer(reducer, {
    groups: [],
    isLoading: false,
    selectedGroupId: -1
  })

  const group = useMemo(() => {
    return state.groups.find(group => group.id === state.selectedGroupId)
  }, [state.selectedGroupId])

  useAsyncEffect(
    async () => {
      if (props.show == null || props.show.title_type === 'movie') {
        return
      }

      dispatch({
        type: 'request:init'
      })

      const [err, res] = await axios.get(`api/shows/${props.show.id}/groups`)

      if (err != null) {
        return dispatch({
          type: 'request:error'
        })
      }

      dispatch({
        type: 'request:success',
        payload: { groups: res.data }
      })
    },
    null,
    [props.show]
  )

  function handleModalClose() {
    dispatch({ type: 'modal:close' })
    props.onClose()
  }

  function handleGroupChange(evt: React.FormEvent<HTMLSelectElement>) {
    dispatch({
      type: 'group:change',
      payload: { id: Number(evt.currentTarget.value) }
    })
  }

  async function handleVideoClick(video: AppShowVideo) {
    const [err, res] = await axios.post('/api/parties', {
      show_video_id: video.id
    })

    if (err) {
      // Launch toast notification
      return
    }

    history.push(`/watch/${res.data.id}`)
  }

  return (
    <React.Fragment>
      <UiModal
        isOpen={Boolean(props.show)}
        shouldCloseOnOverlayClick={false}
        overlayClassName="show-modal-overlay"
        modalClassName="show-modal"
        onClose={handleModalClose}>
        {() => (
          <React.Fragment>
            <div className="show-modal-cover">
              <img src={props.show.preview_image} alt={props.show.title} className="image" />
              <div className="overlay" />
            </div>

            <div className="show-modal-body">
              <header className="show-modal-heading">
                <div className="tags">
                  <h5 className="ui-subheading">8 Seasons</h5>
                </div>

                <h3 className="title">{props.show.title}</h3>

                <p className="synopsis">{props.show.synopsis}</p>
              </header>

              {!state.isLoading && props.show.title_type === 'series' && Boolean(state.groups.length) && (
                <React.Fragment>
                  <div className="show-modal-select">
                    <UiSelect value={state.selectedGroupId} onChange={handleGroupChange}>
                      {state.groups.map(group => (
                        <option value={group.id} key={group.id}>
                          {group.title}
                        </option>
                      ))}
                    </UiSelect>
                  </div>

                  <section>
                    {group.videos.map(video => (
                      <button type="button" className="show-modal-episode" key={video.id} onClick={() => handleVideoClick(video)}>
                        <div className="thumbnail">
                          <StandardImageAspectRatio src={props.show.preview_image} />
                        </div>

                        <div className="info">
                          <div className="meta">
                            <h5 className="ui-subheading is-compact">{getFormattedDurationWithoutSeconds(video.duration)}</h5>
                          </div>

                          <h3 className="title">{video.title}</h3>
                        </div>

                        <span className="play">
                          <i className="fa fa-play" />
                        </span>
                      </button>
                    ))}
                  </section>
                </React.Fragment>
              )}
            </div>
          </React.Fragment>
        )}
      </UiModal>
    </React.Fragment>
  )
}

export default ShowModal
