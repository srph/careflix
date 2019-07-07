import './style.css'
import * as React from 'react'
import { useEffect, useState, useRef } from 'react'
import Transition from 'react-addons-css-transition-group'

interface Message {
  id: number,
  text: string
  duration: number
}

interface Instance {
  toast: (message: string) => void
}

let instance: Instance = {
  toast() {}
}

function Toast() {
  const [messages, setMessages] = useState<Message[]>([])
  const counterRef = useRef<number>(0)

  function open(text: string) {
    counterRef.current++

    const message = {
      id: counterRef.current + 1,
      text,
      duration: 5000
    }

    setMessages([
      ...messages,
      message
    ])

    setTimeout(() => {
      close(message.id)
    }, message.duration)
  }

  function close(id: number) {
    setMessages(
      messages.filter(message => message.id !== id)
    )
  }

  useEffect(() => {
    instance.toast = open
  }, [])

  return (
    <div className="toast-container">
      <Transition
        component='div'
        className='toast-float'
        transitionName={{
          enter: '-enter',
          leave: '-leave'
        }}
        transitionEnterTimeout={400}
        transitionLeaveTimeout={400}>
        {messages.map(message =>
          <div className='item' key={message.id}>
            {message.text}
            <button className='close' onClick={() => close(message.id)}>
              ×
            </button>
          </div>
        )}
      </Transition>
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