import './style.css'
import * as React from 'react'
import UiPlainButton from '~/components/UiPlainButton'
import UiModal from '~/components/UiModal'

interface Props {
  isOpen: boolean
  onClose: () => void
}

interface Shortcut {
  name: string,
  combo: string
}

const shortcuts: Shortcut[] = [
  { name: 'Play/pause video', combo: 'Space' },
  { name: 'Move forward by 10 seconds', combo: '→' },
  { name: 'Move backward by 10 seconds', combo: '←' },
  { name: 'Enter/exit fullscreen mode', combo: 'F' },
  { name: 'Open/close chat', combo: 'C' },
  { name: 'Focus to chat input (while chat is open)', combo: '/' },
  { name: 'Open keyboard shortcuts info', combo: '?' },
]

function PlayerKeyboardInfoModal(props: Props) {
  return (
    <UiModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      overlayClassName="app-watch-keyboard-info-overlay"
      modalClassName="app-watch-keyboard-info-modal">
      <div className="heading">
        <h5 className="ui-subheading">Keyboard Shortcuts</h5>

        <UiPlainButton className="close" onClick={props.onClose}>
          <i className="fa fa-close" />
        </UiPlainButton>
      </div>

      {shortcuts.map((shortcut, i) =>
        <div className="app-watch-keyboard-info-item" key={i}>
          <div className="description">
            {shortcut.name}
          </div>

          <div className="combo">
            <code>{shortcut.combo}</code>
          </div>
        </div>
      )}
    </UiModal>
  )
}

export default PlayerKeyboardInfoModal
