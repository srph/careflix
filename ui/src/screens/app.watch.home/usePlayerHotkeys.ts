import { useEffect } from 'react'
import { usePropRef } from '~/hooks/usePropRef'
import isFocusedToInput from '~/utils/dom/isFocusedToInput'

interface Props {
  isDisabled: () => boolean
  onToggleChat: () => void
  onToggleMute: () => void
  onFullscreen: () => void
  onPlay: () => void
  onForward: () => void
  onBackward: () => void
  onIncreaseVolume: () => void
  onDecreaseVolume: () => void
  onToggleKeyboardInfo: () => void
}

const keys = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  UP_ARROW: 38,
  DOWN_ARROW: 40,
  SPACE: 32,
  F: 70,
  C: 67,
  M: 77,
  SLASH: 191
}

function usePlayerHotkeys(hookProps: Props) {
  const props = usePropRef(hookProps)

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      // If any modals are open, we don't want any of the hotkeys to fire.
      if (props.current.isDisabled()) {
        return
      }

      // We could've put this in `isDisabled`, but the document tracks the focused element for us anyway.
      // We simply don't want to interfere if the user is focused on an input.
      if (isFocusedToInput()) {
        return
      }

      switch (evt.keyCode) {
        case keys.LEFT_ARROW: {
          props.current.onBackward()
          break
        }

        case keys.RIGHT_ARROW: {
          props.current.onForward()
          break
        }

        case keys.UP_ARROW: {
          props.current.onIncreaseVolume()
          break
        }

        case keys.DOWN_ARROW: {
          props.current.onDecreaseVolume()
          break
        }

        case keys.F: {
          props.current.onFullscreen()
          break
        }

        case keys.C: {
          props.current.onToggleChat()
          break
        }

        case keys.M: {
          props.current.onToggleMute()
          break
        }

        case keys.SPACE: {
          // We don't want the spacebar to trigger focused buttons
          evt.preventDefault()

          props.current.onPlay()
          break
        }

        case keys.SLASH: {
          // We want to trigger ?, not /
          if (evt.shiftKey) {
            // @TODO Make toggle actually work because we're disabling all hotkeys
            // while any modal is open. Ideally, we can make an exception for `?`
            props.current.onToggleKeyboardInfo()
          }

          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [props])

  return null
}

export { usePlayerHotkeys, usePlayerHotkeys as default }
