import './style.css'
import * as React from 'react'
import ReactModal from 'react-modal'

interface Props {
  isOpen: boolean
  shouldCloseOnOverlayClick?: boolean
  onClose?: () => void
  children?: React.ReactNode
}

function UiModal(props: Props) {
  return (
    <ReactModal isOpen={props.isOpen}
      shouldCloseOnOverlayClick={props.shouldCloseOnOverlayClick}
      onRequestClose={props.onClose}
      className="ui-modal"
      overlayClassName="ui-modal-overlay">
      {props.children}
    </ReactModal>
  )
}

ReactModal.setAppElement('#mount')

export default UiModal