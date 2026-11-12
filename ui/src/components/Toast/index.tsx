import * as React from 'react'
import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

interface Message {
  id: number,
  text: string
  duration: number
}

interface State {
  messages: Message[]
}

interface Instance {
  toast: (message: string) => void
}

let instance: Instance = {
  toast() {}
}

function Toast() {
  const [state, setState] = useState<State>({
    messages: []
  })

  const counterRef = useRef<number>(0)
  function open(text: string) {
    counterRef.current++

    const message = {
      id: counterRef.current + 1,
      text,
      duration: 4000
    }

    setState(state => ({
      messages: [
        ...state.messages,
        message
      ]
    }))

    setTimeout(() => {
      close(message.id)
    }, message.duration)
  }

  function close(id: number) {
    setState(state => ({
      messages: state.messages.filter(message => message.id !== id)
    }))
  }

  useEffect(() => {
    instance.toast = open
  }, [])

  return (
    <div data-testid="toasts" className="pointer-events-none fixed inset-x-8 bottom-8 z-1000 flex justify-center">
      <div className="flex flex-col">
      <AnimatePresence initial={false}>
        {state.messages.map(message =>
          <motion.div className="pointer-events-auto relative inline-block rounded-sm bg-pink-500 p-3 pr-6 text-xs text-white not-last:mb-4" key={message.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            {message.text}
            <button className="absolute top-3 right-3 cursor-pointer text-white opacity-40" onClick={() => close(message.id)}>
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  )
}

function toast(message) {
  instance.toast(message)
}

export {
  Toast,
  toast
}