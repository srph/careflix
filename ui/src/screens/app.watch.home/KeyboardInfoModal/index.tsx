import * as React from 'react'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { UiModal } from '~/components/ui-modal/ui-modal'

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
  { name: 'Increase volume', combo: '↑' },
  { name: 'Decrease volume', combo: '↓' },
]

function PlayerKeyboardInfoModal(props: Props) {
  return (
    <UiModal
      isOpen={props.isOpen}
      onClose={props.onClose}
      overlayClassName="bg-neutral-900 lg:bg-black/75"
      modalClassName="p-0 lg:mx-auto lg:my-20 lg:w-120 lg:rounded-sm lg:bg-neutral-900">
      <div className="flex items-center justify-between p-4">
        <h5 className="font-label text-xs font-bold tracking-label uppercase">Keyboard Shortcuts</h5>

        <UiPlainButton className="flex size-8 items-center justify-center rounded-full bg-neutral-400 text-white" onClick={props.onClose}>
          <i className="fa fa-close" />
        </UiPlainButton>
      </div>

      {shortcuts.map((shortcut, i) =>
        <div className="flex items-center border-neutral-800 p-4 not-last:border-b" key={i}>
          <div>
            {shortcut.name}
          </div>

          <div className="ml-auto flex shrink-0">
            <code className="inline-block rounded-xs border border-neutral-400 bg-neutral-700 px-2 py-1 uppercase">{shortcut.combo}</code>
          </div>
        </div>
      )}
    </UiModal>
  )
}

export default PlayerKeyboardInfoModal
