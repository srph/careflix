import './style.css'
import * as React from 'react'
import { Dialog } from '@base-ui/react/dialog'
import cx from 'classnames'

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

export default function UiModal(props: Props) {
  const children = typeof props.children === 'function' ? (props.isOpen ? props.children() : null) : props.children
  return (
    <Dialog.Root open={props.isOpen} onOpenChange={(open, details) => {
      if (open) return
      if (details.reason === 'outside-press' && props.shouldCloseOnOverlayClick === false) {
        details.cancel()
        return
      }
      props.onClose?.()
    }}>
      <Dialog.Portal>
        <Dialog.Backdrop className={cx('ui-modal-backdrop', props.overlayClassName)} />
        <Dialog.Viewport className={cx('ui-modal-overlay', props.overlayClassName)} style={{ background: 'transparent' }}>
          <Dialog.Popup className={cx('ui-modal', props.modalClassName)} aria-label={props.ariaLabel ?? 'Dialog'} finalFocus={props.finalFocus}>
            {children}
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
