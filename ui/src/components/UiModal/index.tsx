import './style.css'
import * as React from 'react'
import ReactModal from 'react-modal'
import cx from 'classnames'

interface Props {
  isOpen: boolean
  shouldCloseOnOverlayClick?: boolean
  onClose?: () => void
  padding?: boolean
  children?: React.ReactNode
  modalClassName?: string
  overlayClassName?: string
}

function UiModal(props: Props) {
  // Because `ReactModal` handles the enter and leaving state, the children
  // we pass over to UiModal gets executed even when it's closed.
  // We can pass a render prop if we don't want the children to be executed while closed.
  const children = typeof props.children === 'function' ? (props.isOpen ? props.children() : null) : props.children

  return (
    <ReactModal
      isOpen={props.isOpen}
      shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
      onRequestClose={props.onClose}
      className={cx('ui-modal', [props.modalClassName])}
      overlayClassName={cx('ui-modal-overlay', [props.overlayClassName])}
      closeTimeoutMS={200}>
      {children}
    </ReactModal>
  )
}

UiModal.defaultProps = {
  padding: true
}

ReactModal.setAppElement('#mount')

export default UiModal
