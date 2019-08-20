import { useEffect } from 'react'
import pusher from '~/lib/pusher'

/** 
 * @REFACTOR Make a PusherProvider
 */
function usePusherPurePresence(channelName: string, isDisabled: boolean = false) {
  useEffect(() => {
    let channel = null

    if (!isDisabled) {
      channel = pusher().subscribe(channelName)
    }

    return () => {
      // @TODO Since we're using hooks and functions are recreated each render
      // let's check in the future the callback is being unbinded properly.
      if (channel) {
        pusher().unsubscribe(channelName)
      }
    }
  }, [isDisabled])
}

export {
  usePusherPurePresence,
  usePusherPurePresence as default
}