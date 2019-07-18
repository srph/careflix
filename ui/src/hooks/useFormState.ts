import { useState, useMemo } from 'react'

type SetCallbackEvent = React.FormEvent<HTMLInputElement | HTMLSelectElement>

type Payload<T> = {
  state: T,
  set: (name: string) => (evt: SetCallbackEvent) => void
}

type InitialState<T> = T | (() => T)

/**
 * @source https://gist.github.com/srph/2053cf063d2e0cda850055f27f0db424
 * @todo Probably not possible, but if it is, type setPassword, etc.
 */
function useFormState<T>(initial: InitialState<T>): Payload<T> {
  const [state, setState] = useState<T>(initial)
  
  return useMemo(() => {
    let out = {
      state,
      set(name: string) {
        return (evt: SetCallbackEvent) => {
          setState({
            ...state,
            [name]: evt.currentTarget.value
          })
        }
      }
    } as Payload<T>
  
    return out
  }, [state])
}

export {
  useFormState,
  useFormState as default
}