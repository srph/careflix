import * as React from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { cn } from '~/utils/cn'

interface Props {
  isOpen: boolean
  shouldCloseOnOverlayClick?: boolean
  onClose?: () => void
  padding?: boolean
  children?: React.ReactNode | (() => React.ReactNode)
  modalClassName?: string
  overlayClassName?: string
  ariaLabel?: string
  finalFocus?: React.RefObject<HTMLElement | null>
}

const FADE = 'transition-opacity duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0'

export default function UiModal(props: Props) {
  const children = typeof props.children === 'function' ? (props.isOpen ? props.children() : null) : props.children
  return (
    <Dialog.Root
      open={props.isOpen}
      onOpenChange={(open, details) => {
        if (open) return
        if (details.reason === 'outside-press' && props.shouldCloseOnOverlayClick === false) {
          details.cancel()
          return
        }
        props.onClose?.()
      }}>
      <Dialog.Portal>
        <Dialog.Backdrop className={cn('fixed inset-0 z-(--zindex-modal) bg-black/70', FADE, props.overlayClassName)} />
        <Dialog.Viewport
          data-testid="modal-overlay"
          className={cn('fixed inset-0 z-(--zindex-modal) overflow-y-scroll', props.overlayClassName)}
          style={{ background: 'transparent' }}>
          <Dialog.Popup
            className={cn('p-4 outline-none', FADE, props.modalClassName)}
            aria-label={props.ariaLabel ?? 'Dialog'}
            finalFocus={props.finalFocus}>
            {children}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
