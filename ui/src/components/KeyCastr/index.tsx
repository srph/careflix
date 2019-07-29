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

function KeyCastr() {
  const [state, setState] = useSetState<State>({
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
    <Transition
      component='div'
      className='key-castr'
      transitionName={{
        enter: '-enter',
        leave: '-leave'
      }}
      transitionEnterTimeout={400}
      transitionLeaveTimeout={400}>
      {state.messages.map(message =>
        <div className='item' key={message.id}>
          {message.text}
        </div>
      )}
    </Transition>
  )
}

export default KeyCastr