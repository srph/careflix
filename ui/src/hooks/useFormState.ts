import { useState, useMemo } from 'react'

/**
 * @source https://gist.github.com/srph/2053cf063d2e0cda850055f27f0db424
 */
function useFormState(initial) {
  const [state, setState] = useState(initial)
  
  return useMemo(() => {
    let out = {}

    Object.keys(state).forEach(key => {
      out[key] = state[key]
      
      out[`set${ucFirst(key)}`] = (evt) => setState({
        ...state,
        [key]: evt.target.value
      })
    })
  
    return out
  }, [initial])
}

export default useFormState

function ucFirst(str) {
  return str.charAt(0).toUpperCase() + str.substr(1)
}