import './style'

import * as React from 'react'
import UiAvatar from '~/components/UiAvatar'
import cx from 'classnames'

import { useUnstated } from '~/lib/unstated'
import { AuthContainer } from '~/containers'

import axios from '~/lib/axios'
import last from '~/utils/last'
import uuid from '~/lib/uuid'
import immer from 'immer'
import { useReducer, useEffect, useMemo, useRef } from 'react'
import { useAsyncEffect } from 'use-async-effect'
import { usePusher } from '~/hooks/usePusher'
import getStandardFormattedDateTime from '~/utils/date/getStandardFormattedDateTime'

interface State {
  logs: AppPartyLog[]
  message: {
    text: string
  }
  isSending: {
    [key: number]: string
  }
  isLoading: boolean
}

type Action =
  | ReducerAction<'request:init'>
  | ReducerAction<'request:error'>
  | ReducerAction<'request:success', { logs: AppPartyLog[] }>
  | ReducerAction<'logs:push', { log: AppPartyLog }>
  | ReducerAction<'chat:input', { input: string }>
  | ReducerAction<'chat:init', { log: AppPartyLog }>
  | ReducerAction<'chat:success', { id: AppId; log: AppPartyLog }>
  | ReducerAction<'chat:error', { id: AppId }>

interface Props {
  party: AppParty
}

interface GroupedLog {
  type: 'activity' | 'message'
  user: AppUser
  logs: AppPartyLog[]
}

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
        logs: action.payload.logs,
        isLoading: false
      }
    }

    case 'request:error': {
      return {
        ...state,
        isLoading: false
      }
    }

    case 'logs:push': {
      return {
        ...state,
        logs: [...state.logs, action.payload.log]
      }
    }

    case 'chat:input': {
      return immer(state, draft => {
        draft.message.text = action.payload.input
      })
    }

    case 'chat:init': {
      return immer(state, draft => {
        draft.message.text = ''
        draft.logs.push(action.payload.log)
      })
    }

    case 'chat:error': {
      // @TODO
      return {
        ...state
      }
    }

    case 'chat:success': {
      return immer(state, draft => {
        const index = draft.logs.findIndex(log => log.id === action.payload.id)
        draft.logs[index] = action.payload.log
      })
    }
  }
}

const init: State = {
  logs: [],
  message: { text: '' },
  isSending: {},
  isLoading: false
}

function ChatWidget(props: Props) {
  const auth = useUnstated(AuthContainer)

  const [state, dispatch] = useReducer(reducer, init)

  const chatbarRef = useRef<HTMLDivElement>(null)

  useAsyncEffect(
    async () => {
      dispatch({
        type: 'request:init'
      })

      const [err, res] = await axios.get(`/api/parties/${props.party.id}/logs`)

      if (err != null) {
        return dispatch({
          type: 'request:error'
        })
      }

      dispatch({
        type: 'request:success',
        payload: { logs: res.data }
      })

      chatbarRef.current.scrollTop = chatbarRef.current.scrollHeight
    },
    null,
    []
  )

  usePusher(`private-party.${props.party.id}`, 'activity', (event: { log: AppPartyLog }) => {
    console.log('NEW MESSAGE---')
    dispatch({
      type: 'logs:push',
      payload: { log: event.log }
    })
  })

  function handleInput(evt: React.FormEvent<HTMLInputElement>) {
    dispatch({
      type: 'chat:input',
      payload: { input: evt.currentTarget.value }
    })
  }

  async function handleMessage(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    const id = uuid()

    const date = getStandardFormattedDateTime()

    const log: AppPartyLog = {
      id,
      party_id: props.party.id,
      type: 'message',
      message: {
        id: uuid(),
        text: state.message.text,
        user: auth.state.data,
        created_at: date,
        updated_at: date
      },
      activity: null,
      created_at: date,
      updated_at: date
    }

    dispatch({
      type: 'chat:init',
      payload: { log }
    })

    const [err, res] = await axios.post(`/api/parties/${props.party.id}/logs/message`, {
      message: state.message.text
    })

    if (err != null) {
      return dispatch({
        type: 'chat:error',
        payload: { id }
      })
    }

    dispatch({
      type: 'chat:success',
      payload: {
        id,
        log: res.data
      }
    })
  }

  const grouped = useMemo(() => {
    return groupPartyLogs(state.logs)
  }, [state.logs])

  return (
    <React.Fragment>
      <div className="watch-screen-chat" ref={chatbarRef}>
        {grouped.map((group, i) => {
          if (group.type === 'activity') {
            return (
              <div className="watch-screen-activity-group" key={i}>
                {group.logs.map(log => (
                  <div className="activity" key={log.id}>
                    <div className="avatar">
                      <UiAvatar img={log.activity.user.avatar} size="sm" />
                    </div>

                    <h6 className="ui-subheading">
                      {log.activity.user.name} {log.activity.text}.
                    </h6>
                  </div>
                ))}
              </div>
            )
          }

          return (
            <div
              className={cx('watch-screen-chat-group', {
                'is-self': group.user.id === auth.state.data.id
              })} key={i}>
              <div className="avatar">
                <UiAvatar img={group.user.avatar} />
              </div>

              <div className="messages">
                {group.logs.map(log => (
                  <div className="message" key={log.id}>
                    <div className="inner">{log.message.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
        {/* <div className="watch-screen-chat-group is-self">
          <div className="avatar">
            <UiAvatar img={require('~/assets/dummy-avatar.png')} />
          </div>

          <div className="messages">
            <div className="message">
              <div className="inner">kinda</div>
            </div>

            <div className="message">
              <div className="inner">it wasn't that bad if you ask me. it was just weird.</div>
            </div>
          </div>
        </div>

        <div className="watch-screen-chat-group">
          <div className="avatar">
            <UiAvatar img={require('~/assets/dummy-avatar.png')} />
          </div>

          <div className="messages">
            <div className="message">
              <div className="inner">what'd you think</div>
            </div>

            <div className="message">
              <div className="inner">did you like it?</div>
            </div>

            <div className="message">
              <div className="inner">hey</div>
            </div>
          </div>
        </div>

        <div className="watch-screen-chat-group is-self">
          <div className="avatar">
            <UiAvatar img={require('~/assets/dummy-avatar.png')} />
          </div>

          <div className="messages">
            <div className="message">
              <div className="inner">kinda</div>
            </div>

            <div className="message">
              <div className="inner">it wasn't that bad if you ask me. it was just weird.</div>
            </div>
          </div>
        </div>

        <div className="watch-screen-activity-group">
          <div className="activity">
            <div className="avatar">
              <UiAvatar img={require('~/assets/dummy-avatar.png')} size="sm" />
            </div>

            <h6 className="ui-subheading">Kier left the room.</h6>
          </div>

          <div className="activity">
            <div className="avatar">
              <UiAvatar img={require('~/assets/dummy-avatar.png')} size="sm" />
            </div>

            <h6 className="ui-subheading">Kier joined the room.</h6>
          </div>
        </div> */}
      </div>

      <div className="watch-screen-chatbar">
        <form onSubmit={handleMessage}>
          <input
            type="text"
            className="ui-input"
            placeholder="Write something..."
            value={state.message.text}
            onChange={handleInput}
          />
        </form>
      </div>
    </React.Fragment>
  )
}

/**
 * This will group chat based on the criteria:
 *
 * Suceeding logs
 * Succeeding messages sent by the same user
 */
function groupPartyLogs(logs: AppPartyLog[]): GroupedLog[] {
  if (logs.length === 0) {
    return []
  }

  const first: AppPartyLog = logs[0]

  const groups: GroupedLog[] = [
    {
      type: first.type,
      user: first[first.type].user,
      logs: [first]
    }
  ]

  // Since we've initialized the group with the first log, we'll start with the second log.
  logs.slice(1).forEach(log => {
    const recent = last(groups)

    console.log(recent)

    // We'll add it to the last group if it fits the criteria
    if (
      (log.type === 'activity' && recent.type === log.type) ||
      (log.type === 'message' && recent.type === log.type && recent.user.id === log.message.user.id)
    ) {
      recent.logs.push(log)
    } else {
      // Otherwise, we'll create a new group and push it there
      groups.push({
        type: log.type,
        user: log[log.type].user,
        logs: [log]
      })
    }
  })

  return groups
}

export default ChatWidget
