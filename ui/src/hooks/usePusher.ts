import { useEffect } from 'react'
import pusher from '~/lib/pusher'

/** 
 * @REFACTOR Make a PusherProvider
 */
function usePusher(channelName: string, eventName: string, callback: Pusher.EventCallback, isDisabled: boolean = false) {
  useEffect(() => {
    let channel = null

    if (!isDisabled) {
      // console.log('usePusher', channelName, eventName)
      channel = pusher().subscribe(channelName)
      channel.bind(eventName, callback)
    }

    return () => {
      // @TODO Since we're using hooks and functions are recreated each render
      // let's check in the future the callback is being unbinded properly.
      if (channel) {
        channel.unbind(eventName, callback)
      }
    }
  }, [isDisabled])
}

export {
  usePusher,
  usePusher as default
}