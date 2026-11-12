import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useWindowSize } from '~/hooks/use-window-size'

/**
 * Keeps the chat list pinned to the newest message: your own messages always scroll into view,
 * other people's only when you were already at the bottom (otherwise "New messages" shows up).
 */
export function useChatScroll(logCount: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasUnread, setHasUnread] = useState(false)
  const { height } = useWindowSize()
  // One-off flag used to check if we're supposed to scroll to the bottom
  const shouldScrollToBottomRef = useRef<boolean>(true)
  // The last stored scroll distance from the bottom of our chat list container
  // We want to update when then the user scrolls the container or the container size changes.
  const lastScrollDistanceFromBottom = useRef<number>(0)
  // One-off flag used to check if it's a message sent through pusher
  const isReceivingRef = useRef<boolean>(true)

  useLayoutEffect(() => {
    if (!isReceivingRef.current || shouldScrollToBottomRef.current) {
      // Scroll to bottom whenever:
      // A new log gets sent by someone else while we're scrolled a bit from above.
      // We sent the message by ourself.
      scrollToBottom(ref.current!)
    } else if (isReceivingRef.current) {
      // If we received a message while not scrolled to the bottom.
      // It may seem like it works if you remove the wrapping condition,
      // but we don't want a race condition. We also don't want it to flash
      // if it we sent the message ourself.
      setHasUnread(true)
    }

    lastScrollDistanceFromBottom.current = getScrollDistanceFromBottom(ref.current!)
  }, [logCount])

  // Whether the user toggles fullscreen or changes their orientation,
  // we want to keep them at the same position as they were from the bottom.
  useEffect(() => {
    scrollFromBottom(ref.current!, lastScrollDistanceFromBottom.current)
  }, [height])

  return {
    ref,
    hasUnread,
    /** Before someone else's log lands: if we were at the bottom, we keep the illusion that we still are. */
    receive() {
      isReceivingRef.current = true
      shouldScrollToBottomRef.current = isScrolledToBottom(ref.current!)
    },
    /** Before your own message lands: it always scrolls into view. */
    send() {
      isReceivingRef.current = false
    },
    onScroll() {
      lastScrollDistanceFromBottom.current = getScrollDistanceFromBottom(ref.current!)

      if (hasUnread && isScrolledToBottom(ref.current!)) {
        // We'll remove the "has unread messages" note when the user scrolls to the bottom.
        // This the removal of the unread messages when the user himself sends a message,
        // since it also auto-scrolls the user to the bottom of the list.
        setHasUnread(false)
      }
    },
    toBottom() {
      scrollToBottom(ref.current!)
    }
  }
}

export type ChatScroll = ReturnType<typeof useChatScroll>

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
