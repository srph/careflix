import './style.css'
import * as React from 'react'
import { useEffect, useRef } from 'react'
import Transition from 'react-addons-css-transition-group'
import useSetState from 'react-use/lib/useSetState'

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
  const [state, setState] = useSetState<State>({
    messages: []
  })

  const counterRef = useRef<number>(0)
  function open(text: string) {
    counterRef.current++

    const message = {
      id: counterRef.current + 1,
      text,
      duration: 5000
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
      <Transition
        component='div'
        className='toast-float'
        transitionName={{
          enter: '-enter',
          leave: '-leave'
        }}
        transitionEnterTimeout={400}
        transitionLeaveTimeout={400}>
        {state.messages.map(message =>
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