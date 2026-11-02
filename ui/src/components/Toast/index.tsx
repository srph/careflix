import './style.css'
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
    <div className="toast-container">
      <div className='toast-float'>
      <AnimatePresence initial={false}>
        {state.messages.map(message =>
          <motion.div className='item' key={message.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
            {message.text}
            <button className='close' onClick={() => close(message.id)}>
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