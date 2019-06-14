import { useState, useMemo } from 'react'

type Payload<T> = T & {
  [key: string]: (evt: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => void
}

/**
 * @source https://gist.github.com/srph/2053cf063d2e0cda850055f27f0db424
 * @todo Probably not possible, but if it is, type setPassword, etc.
 */
function useFormState<T>(initial: T): Payload<T> {
  const [state, setState] = useState(initial)
  
  return useMemo(() => {
    let out = {} as Payload<T>

    Object.keys(state).forEach(key => {
      out[key] = state[key]
      
      out[`set${ucFirst(key)}`] = (evt) => setState({
        ...state,
        [key]: evt.currentTarget.value
      })
    })
  
    return out
  }, [initial])
}

export default useFormState

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}