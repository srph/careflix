import { useEffect } from 'react'
import { usePropRef } from '~/hooks/usePropRef'

interface Props {
  isDisabled: () => boolean
  onToggleChat: () => void
  onToggleMute: () => void
  onFullscreen: () => void
  onPlay: () => void
  onForward: () => void
  onBackward: () => void
}

const keys = {
  LEFT_ARROW: 37,
  RIGHT_ARROW: 39,
  SPACE: 32,
  F: 70,
  C: 67,
  M: 77
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
      if (document.activeElement && document.activeElement.tagName.toLowerCase() === 'input') {
        return
      }

      switch (evt.keyCode) {
        case keys.LEFT_ARROW: {
          props.current.onBackward();
          break;
        }

        case keys.RIGHT_ARROW: {
          props.current.onForward();
          break;
        }

        case keys.F: {
          props.current.onFullscreen();
          break;
        }

        case keys.C: {
          props.current.onToggleChat();
          break;
        }

        case keys.M: {
          props.current.onToggleMute();
          break;
        }

        case keys.SPACE: {
          props.current.onPlay();
          break;
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

export {
  usePlayerHotkeys,
  usePlayerHotkeys as default
}