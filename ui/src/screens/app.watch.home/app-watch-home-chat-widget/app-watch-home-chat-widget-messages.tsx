import * as React from 'react'
import { useMemo } from 'react'
import { differenceInMinutes, format, parse } from 'date-fns-v1'
import { cn } from '~/utils/cn'
import { last } from '~/utils/last'
import { useAuthUser } from '~/contexts/auth/auth'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import type { ChatScroll } from './use-chat-scroll'

interface GroupedLog {
  type: 'activity' | 'message'
  user: AppUser
  logs: AppPartyLog[]
}

// A time divider appears after this long without messages.
const TIME_BREAK_MINUTES = 10

// Bubbles from the same person tighten the corners where they meet.
const BUBBLE = 'max-w-full rounded-2xl px-3 py-1.75 text-sm wrap-anywhere whitespace-pre-wrap'
const BUBBLE_FRIEND = 'bg-neutral-800 not-first:rounded-tl-md not-last:rounded-bl-md'
const BUBBLE_SELF = 'bg-pink-500 not-first:rounded-tr-md not-last:rounded-br-md'

/** The message list: friends on the left with a small face and name, yours in pink on the right. */
export function AppWatchHomeChatWidgetMessages({ logs, scroll }: { logs: AppPartyLog[]; scroll: ChatScroll }) {
  const user = useAuthUser()

  // Activity lines live in the status row, so the list only groups messages.
  const grouped = useMemo(() => {
    return groupPartyLogs(logs.filter((log) => log.type === 'message'))
  }, [logs])

  return (
    <div className="relative min-h-0 flex-1">
      {/* A short chat sits on the composer; the auto margin (not justify-end) keeps the top reachable once it scrolls. */}
      <div
        data-testid="chat-messages"
        className="flex h-full flex-col gap-2 overflow-y-auto bg-neutral-900 px-3 py-4 *:first:mt-auto"
        ref={scroll.ref}
        onScroll={scroll.onScroll}>
        {grouped.map((group, i) => {
          const isSelf = group.user.id === user.id
          const previous = grouped[i - 1]
          // Mark the time at the start and after a quiet stretch, instead of stamping every message.
          const showTime =
            !previous ||
            differenceInMinutes(parse(group.logs[0].created_at), parse(last(previous.logs).created_at)) >=
              TIME_BREAK_MINUTES

          return (
            <React.Fragment key={i}>
              {showTime && (
                <div data-testid="chat-time" className="mt-1.5 text-center text-11 leading-none text-neutral-400">
                  {format(parse(group.logs[0].created_at), 'h:mm A')}
                </div>
              )}
              <div data-testid="chat-group" data-self={isSelf} className={cn('flex gap-2', isSelf && 'justify-end')}>
                {!isSelf && (
                  <div className="mt-4.75 flex-none">
                    <UiAvatar user={group.user} className="size-6 text-10" />
                  </div>
                )}

                <div className="max-w-4/5 min-w-0">
                  {!isSelf && (
                    <div className="mb-0.5 ml-1 text-xs leading-none text-neutral-400">{group.user.name}</div>
                  )}

                  <div className={cn('flex flex-col gap-0.5', isSelf ? 'items-end' : 'items-start')}>
                    {group.logs.map((log) => (
                      <div
                        data-testid="chat-message"
                        className={cn(BUBBLE, isSelf ? BUBBLE_SELF : BUBBLE_FRIEND)}
                        key={log.id}>
                        {log.message?.text}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>

      {scroll.hasUnread && (
        <UiPlainButton
          type="button"
          className="absolute bottom-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-neutral-950 shadow-pop"
          onClick={scroll.toBottom}>
          New messages
          <i className="fa fa-arrow-down" aria-hidden="true" />
        </UiPlainButton>
      )}
    </div>
  )
}

/**
 * This will group chat based on the criteria:
 *
 * Suceeding logs
 * Succeeding messages sent by the same user
 */
function logUser(log: AppPartyLog): AppUser {
  return log.type === 'message' ? log.message.user : log.activity.user
}

function groupPartyLogs(logs: AppPartyLog[]): GroupedLog[] {
  if (logs.length === 0) {
    return []
  }

  const first: AppPartyLog = logs[0]

  const groups: GroupedLog[] = [
    {
      type: first.type,
      user: logUser(first),
      logs: [first]
    }
  ]

  // Since we've initialized the group with the first log, we'll start with the second log.
  logs.slice(1).forEach((log) => {
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
        user: logUser(log),
        logs: [log]
      })
    }
  })

  return groups
}
