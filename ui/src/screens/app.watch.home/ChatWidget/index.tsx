
import * as React from 'react'
import { cn } from '~/utils/cn'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import ChatInvitationPanel from '../ChatInvitationPanel'
import useHostInvitations from '../ChatInvitationPanel/useHostInvitations'
import { AnimatePresence } from 'motion/react'
import ChatStatus from '../ChatStatus'
import { isJoinActivity } from '../ChatStatus/status'
import useTypingStatus from './useTypingStatus'
import InviteStrip from './InviteStrip'
import ReactionRow from './ReactionRow'
import type { Reaction } from '../useReactions'
import useTransientState from '~/hooks/useTransientState'
import PartyCode from '../PartyCode'

import { usePropRef } from '~/hooks/usePropRef'
import { useAuth } from '~/contexts/Auth'

import axios from '~/lib/axios'
import last from '~/utils/last'
import uuid from '~/lib/uuid'
import immer from 'immer'
import { useReducer, useState, useEffect, useMemo, useRef } from 'react'
import { useAsyncEffect } from '~/hooks/useAsyncEffect'
import { usePusher } from '~/hooks/usePusher'
import { useWindowVisibility } from '~/hooks/useWindowVisibility'
import useWindowSize from '~/hooks/useWindowSize'
import getStandardFormattedDateTime from '~/utils/date/getStandardFormattedDateTime'
import { differenceInMinutes, format, parse } from 'date-fns-v1'

import asset_chatInactive from '~/assets/audio/chat-inactive.ogg'
import asset_chatSend from '~/assets/audio/chat-send.ogg'
import { UiAvatarGroup } from '~/components/ui-avatar-group/ui-avatar-group'
import isFocusedToInput from '~/utils/dom/isFocusedToInput'

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
  isChatOpen: boolean
  isSeasonSelectionOpen: boolean
  isInvitationOpen: boolean
  isKeyboardInfoOpen: boolean
  onOpenInvitationModal: () => void
  onCloseInvitationModal: () => void
  onReact: (emoji: Reaction) => void
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

// Hype lines stay up this long after a friend arrives.
const JOIN_FLASH_MS = 3200
// A time divider appears after this long without messages.
const TIME_BREAK_MINUTES = 10

const init: State = {
  logs: [],
  message: { text: '' },
  isSending: {},
  isLoading: false
}

// Bubbles from the same person tighten the corners where they meet.
const BUBBLE = 'max-w-full rounded-2xl px-3 py-1.75 text-sm wrap-anywhere whitespace-pre-wrap'
const BUBBLE_FRIEND = 'bg-neutral-800 not-first:rounded-tl-md not-last:rounded-bl-md'
const BUBBLE_SELF = 'bg-pink-500 not-first:rounded-tr-md not-last:rounded-br-md'

function ChatWidget(props: Props) {
  const auth = useAuth()
  const invitations = useHostInvitations()
  const inviteButton = useRef<HTMLButtonElement>(null)
  const wasInvitationOpen = useRef(false)
  useEffect(() => {
    if (wasInvitationOpen.current && !props.isInvitationOpen) inviteButton.current?.focus({ preventScroll: true })
    wasInvitationOpen.current = props.isInvitationOpen
  }, [props.isInvitationOpen])
  const [state, dispatch] = useReducer(reducer, init)
  const { height } = useWindowSize()
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false)
  const chatbarRef = useRef<HTMLDivElement>(null)
  const idleAudioRef = useRef<HTMLAudioElement>(null)
  const sendAudioRef = useRef<HTMLAudioElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  // One-off flag used to check if we're supposed to scroll to the bottom
  const shouldScrollToBottomRef = useRef<boolean>(true)
  // The last stored scroll distance from the bottom of our chat list container
  // We want to update when then the user scrolls the container or the container size changes.
  const lastScrollDistanceFromBottom = useRef<number>(0)
  // One-off flag used to check if it's a message sent through pusher
  const isReceivingRef = useRef<boolean>(true)
  const isSubmittable = state.message.text.trimRight().trimLeft().length > 0
  const typing = useTypingStatus(props.party.id, auth.data)
  // A friend who just arrived; the status row shows their hype line for a few seconds.
  const [joined, showJoined] = useTransientState<AppUser | null>(null, JOIN_FLASH_MS)

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

      scrollToBottom(chatbarRef.current)
    },
    null,
    []
  )

  React.useLayoutEffect(() => {
    if (!isReceivingRef.current || shouldScrollToBottomRef.current) {
      // Scroll to bottom whenever:
      // A new log gets sent by someone else while we're scrolled a bit from above.
      // We sent the message by ourself.
      scrollToBottom(chatbarRef.current)
    } else if (isReceivingRef.current) {
      // If we received a message while not scrolled to the bottom.
      // It may seem like it works if you remove the wrapping condition,
      // but we don't want a race condition. We also don't want it to flash
      // if it we sent the message ourself.
      setHasUnreadMessages(true)
    }

    lastScrollDistanceFromBottom.current = getScrollDistanceFromBottom(chatbarRef.current)
  }, [state.logs.length])

  const isWindowVisible = useWindowVisibility()

  usePusher(`private-party.${props.party.id}`, 'log', (event: { log: AppPartyLog }) => {
    isReceivingRef.current = true

    // If the user was scrolled to the bottom before receiving a new message
    // we'll keep the illusion that they still are.
    shouldScrollToBottomRef.current = isScrolledToBottom(chatbarRef.current)

    dispatch({
      type: 'logs:push',
      payload: { log: event.log }
    })

    const activity = event.log.type === 'activity' ? event.log.activity : null
    if (isJoinActivity(activity) && String(activity.user.id) !== String(auth.data.id)) {
      showJoined(activity.user)
    }

    if (event.log.type === 'message') typing.clear(event.log.message.user.id)

    if (!isWindowVisible && event.log.type === 'message') {
      // Let's play a sound if the user receives a message while switched to another tab.
      idleAudioRef.current.play()
    }
  })

  useEffect(() => {
    // @TODO Make a reusable component that does this kasi tangina nito hahahah
    // <Audio volume={pakyu} />
    idleAudioRef.current.volume = 0.1
    sendAudioRef.current.volume = 0.1
  }, [])

  const propsRef = usePropRef(props)

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      // @TODO Turn / into a shortcut to open up chat. At the moment,
      // causes bugs like breaking layout because we're forcing focus to
      // an element that's off-canvas.
      if (!propsRef.current.isChatOpen) {
        return
      }

      // We don't want keyboard events to fire while a modal is open
      if (
        propsRef.current.isInvitationOpen ||
        propsRef.current.isSeasonSelectionOpen ||
        propsRef.current.isKeyboardInfoOpen
      ) {
        return
      }

      // We simply don't want to interfere if the user is focused on any input.
      if (isFocusedToInput()) {
        return
      }

      if (props.isInvitationOpen) return

      if (evt.keyCode === 191 && !evt.shiftKey) {
        // Otherwise, the `/` keydown would be appended to the input.
        setTimeout(() => {
          inputRef.current.focus()
        }, 0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [props.isInvitationOpen])

  // Whether the user toggles fullscreen or changes their orientation,
  // we want to keep them at the same position as they were from the bottom.
  // @TODO Maybe we can have a component that scrolls from the bottom.
  useEffect(() => {
    scrollFromBottom(chatbarRef.current, lastScrollDistanceFromBottom.current)
  }, [height])

  function handleInput(evt: React.FormEvent<HTMLTextAreaElement>) {
    if (evt.currentTarget.value.trim()) typing.notify()
    dispatch({
      type: 'chat:input',
      payload: { input: evt.currentTarget.value }
    })
  }

  async function handleMessage(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    if (!isSubmittable) {
      return
    }

    const id = uuid()

    const date = getStandardFormattedDateTime()

    const log: AppPartyLog = {
      id,
      party_id: props.party.id,
      type: 'message',
      message: {
        id: uuid(),
        text: state.message.text,
        user: auth.data,
        created_at: date,
        updated_at: date
      },
      activity: null,
      created_at: date,
      updated_at: date
    }

    isReceivingRef.current = false
    typing.sent()

    dispatch({
      type: 'chat:init',
      payload: { log }
    })

    sendAudioRef.current.play()

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

  // Activity lines live in the status row, so the list only groups messages.
  const grouped = useMemo(() => {
    return groupPartyLogs(state.logs.filter(log => log.type === 'message'))
  }, [state.logs])

  const inputRef = useRef<HTMLTextAreaElement>(null)

  function handleInputKeyDown(evt: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (evt.keyCode === 27) {
      // We want to blur the input if the user presses escape to make it
      // convenient to access video player hotkeys without having to press anywhere
      inputRef.current.blur()
    }

    if (evt.keyCode === 13 && !evt.shiftKey) {
      // We want the message to be sent if the user presses enter;
      // To make a new line, the user has to press shift.
      buttonRef.current.click()

      // If we don't call this, we would send the message then make a new line.
      evt.preventDefault()
    }
  }

  function handleMessagesContainerScroll() {
    lastScrollDistanceFromBottom.current = getScrollDistanceFromBottom(chatbarRef.current)

    if (hasUnreadMessages && isScrolledToBottom(chatbarRef.current)) {
      // We'll remove the "has unread messages" note when the user scrolls to the bottom.
      // This the removal of the unread messages when the user himself sends a message,
      // since it also auto-scrolls the user to the bottom of the list.
      setHasUnreadMessages(false)
    }
  }

  function handleClickUnreadMessages() {
    scrollToBottom(chatbarRef.current)
  }

  return (
    <div
      data-testid="chat-pane" data-open={props.isChatOpen}
      // Under the picture on phones; from `sm` a column that slides in from the right edge.
      className={cn('relative flex h-full min-h-0 shrink flex-col overflow-hidden bg-neutral-900 sm:absolute sm:inset-y-0 sm:w-(--player-chat-pane-width) sm:shrink-0 sm:transition-all sm:duration-200',
        props.isChatOpen ? 'sm:right-0' : 'sm:right-[calc(-1*var(--player-chat-pane-width))]')}>
      {/* The invite panel is a solid sheet over this, so the chat stays put underneath; it only can't be reached. */}
      <div data-testid="chat-content" className="flex min-h-0 flex-1 flex-col" inert={props.isInvitationOpen}>
        {/* Faces, the party code chip and invite in one row. */}
        <div data-testid="chat-canopy" className="flex shrink-0 items-center gap-2 bg-neutral-900 pt-3 pr-3 pb-2 pl-3.5">
          <UiAvatarGroup users={props.party.members} className="mr-auto" itemClassName="not-last:-mr-2"
            avatarClassName="size-6 text-10 ring-2 ring-neutral-900" statusClassName="-right-0.5 -bottom-0.5 size-2.5" />

          <PartyCode code={props.party.join_code} chip />

          <UiPlainButton type="button" ref={inviteButton}
            className="flex size-7.5 flex-none items-center justify-center rounded-full bg-neutral-800 text-13 leading-none text-white transition-colors duration-200 hover:bg-neutral-700 motion-reduce:[transition:none]"
            aria-label="Invite people" aria-expanded={props.isInvitationOpen} onClick={props.onOpenInvitationModal}>
            <i className="fa fa-user-plus" aria-hidden="true" />
          </UiPlainButton>
        </div>

        <InviteStrip invitations={invitations} onOpen={props.onOpenInvitationModal} />
        {/* Friends on the left with a small face and name, yours in pink on the right. */}
        <div className="relative min-h-0 flex-1">
          {/* A short chat sits on the composer; the auto margin (not justify-end) keeps the top reachable once it scrolls. */}
          <div data-testid="chat-messages" className="flex h-full flex-col gap-2 overflow-y-auto bg-neutral-900 px-3 py-4 *:first:mt-auto" ref={chatbarRef} onScroll={handleMessagesContainerScroll}>
            {grouped.map((group, i) => {
              const isSelf = group.user.id === auth.data.id
              const previous = grouped[i - 1]
              // Mark the time at the start and after a quiet stretch, instead of stamping every message.
              const showTime = !previous || differenceInMinutes(parse(group.logs[0].created_at), parse(last(previous.logs).created_at)) >= TIME_BREAK_MINUTES

              return (
                <React.Fragment key={i}>
                  {showTime && <div data-testid="chat-time" className="mt-1.5 text-center text-11 leading-none text-neutral-400">{format(parse(group.logs[0].created_at), 'h:mm A')}</div>}
                  <div data-testid="chat-group" data-self={isSelf} className={cn('flex gap-2', isSelf && 'justify-end')}>
                    {!isSelf && <div className="mt-4.75 flex-none"><UiAvatar user={group.user} className="size-6 text-10" /></div>}

                    <div className="max-w-4/5 min-w-0">
                      {!isSelf && <div className="mb-0.5 ml-1 text-xs leading-none text-neutral-400">{group.user.name}</div>}

                      <div className={cn('flex flex-col gap-0.5', isSelf ? 'items-end' : 'items-start')}>
                        {group.logs.map(log => (
                          <div data-testid="chat-message" className={cn(BUBBLE, isSelf ? BUBBLE_SELF : BUBBLE_FRIEND)} key={log.id}>{log.message.text}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              )
            })}
          </div>

          {hasUnreadMessages && (
            <UiPlainButton type="button" className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-neutral-950 shadow-pop" onClick={handleClickUnreadMessages}>
              New messages
              <i className="fa fa-arrow-down" aria-hidden="true" />
            </UiPlainButton>
          )}
        </div>

        {/* A tray in the LayerCard style: the status row on top, the composer card flush below it. */}
        <div data-testid="chat-tray" className="mx-2.5 mt-1 mb-2.5 shrink-0 rounded-xl bg-neutral-800">
          <ChatStatus logs={state.logs} typing={typing.names} joined={joined} meId={auth.data.id} />

          {/* The focus ring belongs to the field (text and send), drawn inside because the field is flush with the tray. */}
          <form onSubmit={handleMessage} data-testid="chat-composer"
            className="relative flex min-h-11 items-end gap-1 rounded-xl bg-neutral-900 pr-1.5 pl-3.75 ring-1 ring-neutral-700 transition-colors duration-150 focus-within:bg-neutral-950 has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:-outline-offset-2 has-[textarea:focus-visible]:outline-pink-700 motion-reduce:[transition:none]">
            <textarea
              rows={1}
              placeholder="Message"
              aria-label="Message"
              value={state.message.text}
              ref={inputRef}
              onChange={handleInput}
              onKeyDown={handleInputKeyDown}
              // Grows with the message where the browser can; elsewhere it stays one line tall and scrolls.
              className="block field-sizing-content max-h-33 min-h-11 min-w-0 flex-1 resize-none overflow-y-auto py-3 text-sm/5 text-white outline-none not-supports-[field-sizing:content]:h-11 placeholder:text-neutral-500"
            />

            <UiPlainButton disabled={!isSubmittable} ref={buttonRef} aria-label="Send message"
              className="mb-1.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-pink-500 text-13 leading-none text-white transition-[filter] duration-150 not-disabled:hover:brightness-112 disabled:cursor-default motion-reduce:[transition:none]">
              <i className="fa fa-arrow-up" aria-hidden="true" />
            </UiPlainButton>
          </form>
        </div>

        <ReactionRow onReact={props.onReact} />

      </div>
      <AnimatePresence>
        {props.isInvitationOpen && <ChatInvitationPanel key="host-invites" invitations={invitations} onClose={props.onCloseInvitationModal} />}
      </AnimatePresence>

      <audio className="hidden" ref={idleAudioRef}>
        <source src={asset_chatInactive} type="audio/ogg" />
      </audio>

      <audio className="hidden" ref={sendAudioRef}>
        <source src={asset_chatSend} type="audio/ogg" />
      </audio>
    </div>
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

function scrollToBottom(el: HTMLElement, opts: { treshold?: number } = {}) {
  const treshold = opts.treshold || 0
  el.scrollTop = getScrollableContainerHeight(el) - treshold
}

/**
 * In long terms "Scroll to <distance from bottom>".
 * We'll use `distance` as relative scroll distance from the bottom.
 */
function scrollFromBottom(el: HTMLElement, distance: number) {
  el.scrollTop = getScrollableContainerHeight(el) - distance
}

function getScrollDistanceFromBottom(el: HTMLElement): number {
  return getScrollableContainerHeight(el) - el.scrollTop
}

function isScrolledToBottom(el: HTMLElement, opts: { treshold?: number } = {}) {
  const treshold = opts.treshold || 0
  return el.scrollTop >= getScrollableContainerHeight(el) - treshold
}

function getScrollableContainerHeight(el: HTMLElement) {
  return el.scrollHeight - el.offsetHeight
}

export default ChatWidget
