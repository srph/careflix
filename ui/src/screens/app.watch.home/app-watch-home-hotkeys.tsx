import { useEffect } from 'react'
import { usePlayaContext } from '~/components/playa/playa'
import { usePropRef } from '~/hooks/use-prop-ref'
import { isFocusedToInput } from '~/utils/dom/is-focused-to-input'
import { useInvitationOverlay } from '~/screens/app/app-invitation-modal/app-invitation-modal-context'
import { useWatchLayout } from './app-watch-home-layout'

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

/**
 * The watch page's keyboard shortcuts. Renders nothing. They're off while a modal, the invite panel,
 * a menu from the controls or an incoming invitation is open, and while you type.
 */
export function AppWatchHomeHotkeys() {
  const playa = usePlayaContext()
  const layout = useWatchLayout()
  const { isExpanded: isIncomingInvitationOpen } = useInvitationOverlay()
  const latest = usePropRef({ playa, layout, isIncomingInvitationOpen })

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      const { playa, layout, isIncomingInvitationOpen } = latest.current
      const isDisabled =
        isIncomingInvitationOpen || playa.state.isOverlayPinned || layout.modal !== null || layout.sidebar === 'invite'

      if (isDisabled) {
        return
      }

      // We simply don't want to interfere if the user is focused on an input.
      if (isFocusedToInput()) {
        return
      }

      switch (evt.keyCode) {
        case keys.LEFT_ARROW:
          playa.skip(-10)
          break

        case keys.RIGHT_ARROW:
          playa.skip(10)
          break

        case keys.UP_ARROW:
          playa.setVolume(playa.state.volume + 0.1)
          break

        case keys.DOWN_ARROW:
          playa.setVolume(playa.state.volume - 0.1)
          break

        case keys.F:
          playa.toggleFullscreen()
          break

        case keys.C:
          layout.toggleChat()
          break

        case keys.M:
          playa.toggleMute()
          break

        case keys.SPACE:
          // We don't want the spacebar to trigger focused buttons
          evt.preventDefault()
          playa.toggle()
          break

        case keys.SLASH:
          // We want to trigger ?, not /
          if (evt.shiftKey) {
            // @TODO Make toggle actually work because we're disabling all hotkeys
            // while any modal is open. Ideally, we can make an exception for `?`
            layout.setModal(layout.modal === 'keyboard-info' ? null : 'keyboard-info')
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [latest])

  return null
}
