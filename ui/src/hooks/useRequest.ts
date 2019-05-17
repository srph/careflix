import { useReducer } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import axios from '~/lib/axios'

interface State<T> {
  data: T,
  isLoading: boolean
}

const reducer = (state: State<any>, action) => {
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
        data: action.payload.data,
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
 * Basic data resolver
 * @TODO Error handling
 * @TODO Refetch
 */
function useRequest(endpoint: string) {
  const [state, dispatch] = useReducer(reducer, {
    data: null,
    isLoading: true
  })

  useAsyncEffect(async () => {
    dispatch({
      type: 'data:init'
    })

    const [err, res] = await axios.get(endpoint)

    if (err) {
      return dispatch({
        type: 'data:error',
      })
    }

    dispatch({
      type: 'data:success',
      payload: { data: res.data }
    })
  }, null, [endpoint])

  return [
    state.data,
    state.isLoading
  ]
}


export {
  useRequest,
  useRequest as default
}