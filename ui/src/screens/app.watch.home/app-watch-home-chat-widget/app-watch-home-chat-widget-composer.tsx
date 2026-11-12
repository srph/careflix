import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { isFocusedToInput } from '~/utils/dom/is-focused-to-input'
import asset_chatSend from '~/assets/audio/chat-send.ogg'

interface Props {
  /** Whether `/` jumps into the field: only while the chat is open and nothing sits over it. */
  canFocusWithSlash: boolean
  onTyping: () => void
  onSend: (text: string) => void
}

/** The message field and send button. Enter sends, Shift+Enter makes a new line, Escape leaves the field. */
export function AppWatchHomeChatWidgetComposer(props: Props) {
  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const sendAudioRef = useRef<HTMLAudioElement>(null)
  const canFocusWithSlash = useRef(props.canFocusWithSlash)
  canFocusWithSlash.current = props.canFocusWithSlash
  const isSubmittable = text.trimRight().trimLeft().length > 0

  useEffect(() => {
    sendAudioRef.current!.volume = 0.1
  }, [])

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      // @TODO Turn / into a shortcut to open up chat. At the moment,
      // causes bugs like breaking layout because we're forcing focus to
      // an element that's off-canvas.
      if (!canFocusWithSlash.current) {
        return
      }

      // We simply don't want to interfere if the user is focused on any input.
      if (isFocusedToInput()) {
        return
      }

      if (evt.keyCode === 191 && !evt.shiftKey) {
        // Otherwise, the `/` keydown would be appended to the input.
        setTimeout(() => {
          inputRef.current!.focus()
        }, 0)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  function handleInput(evt: React.FormEvent<HTMLTextAreaElement>) {
    if (evt.currentTarget.value.trim()) props.onTyping()
    setText(evt.currentTarget.value)
  }

  function handleMessage(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault()

    if (!isSubmittable) {
      return
    }

    props.onSend(text)
    setText('')
    sendAudioRef.current!.play()
  }

  function handleInputKeyDown(evt: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (evt.keyCode === 27) {
      // We want to blur the input if the user presses escape to make it
      // convenient to access video player hotkeys without having to press anywhere
      inputRef.current!.blur()
    }

    if (evt.keyCode === 13 && !evt.shiftKey) {
      // We want the message to be sent if the user presses enter;
      // To make a new line, the user has to press shift.
      buttonRef.current!.click()

      // If we don't call this, we would send the message then make a new line.
      evt.preventDefault()
    }
  }

  return (
    <React.Fragment>
      {/* The focus ring belongs to the field (text and send), drawn inside because the field is flush with the tray. */}
      <form
        onSubmit={handleMessage}
        data-testid="chat-composer"
        className="relative flex min-h-11 items-end gap-1 rounded-xl bg-neutral-900 pr-1.5 pl-3.75 ring-1 ring-neutral-700 transition-colors duration-150 focus-within:bg-neutral-950 has-[textarea:focus-visible]:outline-2 has-[textarea:focus-visible]:-outline-offset-2 has-[textarea:focus-visible]:outline-pink-700 motion-reduce:[transition:none]">
        <textarea
          rows={1}
          placeholder="Message"
          aria-label="Message"
          value={text}
          ref={inputRef}
          onChange={handleInput}
          onKeyDown={handleInputKeyDown}
          // Grows with the message where the browser can; elsewhere it stays one line tall and scrolls.
          className="block field-sizing-content max-h-33 min-h-11 min-w-0 flex-1 resize-none overflow-y-auto py-3 text-sm/5 text-white outline-none not-supports-[field-sizing:content]:h-11 placeholder:text-neutral-500"
        />

        <UiPlainButton
          disabled={!isSubmittable}
          ref={buttonRef}
          aria-label="Send message"
          className="mb-1.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-pink-500 text-13 leading-none text-white transition-[filter] duration-150 not-disabled:hover:brightness-112 disabled:cursor-default motion-reduce:[transition:none]">
          <i className="fa fa-arrow-up" aria-hidden="true" />
        </UiPlainButton>
      </form>

      <audio className="hidden" ref={sendAudioRef}>
        <source src={asset_chatSend} type="audio/ogg" />
      </audio>
    </React.Fragment>
  )
}
