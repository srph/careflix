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

function KeyCastr() {
  const [state, setState] = useState<State>({
    messages: []
  })

  const counterRef = useRef<number>(0)

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      const id = counterRef.current++

      let text = evt.key
      if (text === 'ArrowLeft') {
        text = '⬅'
      } else if (text === 'ArrowRight') {
        text = '➡'
      } else if (text === ' ') {
        text = 'Space'
      }

      const message = {
        id,
        text,
        duration: 2000
      }
  
      setState(state => ({
        messages: [
          ...state.messages,
          message
        ]
      }))
  
      setTimeout(() => {
        setState(state => ({
          messages: state.messages.filter((message) => message.id !== id)
        }))
      }, message.duration)
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keyup', handleKeyDown)
    }
  }, [])

  return (
    <div className='key-castr'>
      <AnimatePresence initial={false}>
      {state.messages.map(message =>
        <motion.div className='item' key={message.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3, ease: 'easeOut' }}>
          {message.text}
        </motion.div>
        )}
    </AnimatePresence>
    </div>
  )
}

export default KeyCastr