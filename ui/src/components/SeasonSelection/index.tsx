import * as React from 'react'
import { cn } from '~/utils/cn'
import { useReducer, useMemo } from 'react'
import { useAsyncEffect } from '~/hooks/useAsyncEffect'
import UiSelect from '~/components/UiSelect'
import StandardImageAspectRatio from '~/components/StandardImageAspectRatio'
import getFormattedDurationWithoutSeconds from '~/utils/date/getFormattedDurationWithoutSeconds'
import axios from '~/lib/axios'

interface Props {
  groups?: AppShowGroup[]
  isDisabled?: boolean
  party?: AppParty
  show: AppShow | null
  currentVideo?: AppShowVideo
  onFetch?: (groups: AppShowGroup[]) => void
  onEpisodeClick: (video: AppShowVideo) => void
  mode?: 'dark' | 'light'
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
        selectedGroupId:
          state.selectedGroupId === -1
            ? // If no selectedGroupId was provided, we'll apply the first season if it exists.
              action.payload.groups.length
              ? action.payload.groups[0].id
              : -1
            : state.selectedGroupId,
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
    selectedGroupId: props.currentVideo ? props.currentVideo.show_group_id : -1
  })

  const groups = props.groups ?? state.groups
  const group = useMemo(() => {
    return groups.find(group => group.id === state.selectedGroupId) ?? groups[0]
  }, [groups, state.selectedGroupId])

  useAsyncEffect(
    async () => {
      if (props.groups != null || props.show == null || props.show.title_type === 'movie') {
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

      props.onFetch && props.onFetch(res.data)
    },
    null,
    [props.show, props.groups]
  )

  function handleGroupChange(evt: React.FormEvent<HTMLSelectElement>) {
    dispatch({
      type: 'group:change',
      payload: { id: Number(evt.currentTarget.value) }
    })
  }

  function handleEpisodeClick(video: AppShowVideo) {
    if (props.currentVideo && video.id === props.currentVideo.id) {
      // @TODO Show a toast message, "this is already playing."
      // @TODO Add API validation.
      return
    }

    props.onEpisodeClick(video)
  }

  if (props.show.title_type === 'movie' || state.isLoading || !groups.length) {
    return null
  }

  const light = props.mode === 'light'

  return (
    <React.Fragment>
      <div className="mb-4 w-1/2">
        <UiSelect value={group.id} onChange={handleGroupChange} mode={props.mode}>
          {groups.map(group => (
            <option value={group.id} key={group.id}>
              {group.title}
            </option>
          ))}
        </UiSelect>
      </div>

      <section>
        {group.videos.map(video => {
          const active = Boolean(props.currentVideo) && props.currentVideo.id === video.id

          return (
            <button
              type="button"
              disabled={props.isDisabled}
              className={cn(
                'flex w-full cursor-pointer items-center py-4 text-left not-last:border-b first:border-t',
                light ? 'border-neutral-200 text-neutral-700' : 'border-neutral-800 text-white'
              )}
              key={video.id}
              onClick={() => handleEpisodeClick(video)}>
              <div className="relative mr-3 w-30 shrink-0">
                {active && (
                  <span className="absolute top-1 right-1 z-1 inline-block rounded-sm bg-pink-500 p-1 text-white">
                    <h5 className="font-label text-10 leading-none font-bold tracking-label uppercase">Playing</h5>
                  </span>
                )}
                <div className="relative overflow-hidden rounded-sm">
                  <StandardImageAspectRatio src={props.show.preview_image} />
                </div>
              </div>

              <div className="mr-6 w-full">
                <div className="text-neutral-400">
                  <h5 className="font-label text-xs font-bold uppercase">{getFormattedDurationWithoutSeconds(video.duration)}</h5>
                </div>

                <h3 className="text-xl font-bold">{video.title}</h3>
              </div>

              {!active && (
                <span className={cn('shrink-0', light ? 'text-neutral-300' : 'text-neutral-400')}>
                  <i className="fa fa-play" />
                </span>
              )}
            </button>
          )
        })}
      </section>
    </React.Fragment>
  )
}

export default ShowModal
