import { useState, useEffect } from 'react'

/**
 * @TODO Find out the most reliable way. Page Visibility API seems to unreliable :/
 */
function useWindowVisibility(defaultValue: boolean = false): boolean {
  const [state, setState] = useState(defaultValue)

  useEffect(() => {
    // Set the name of the hidden property and the change event for visibility
    // @source https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
    // var hidden, visibilityChange; 
    // if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
    //   hidden = "hidden";
    //   visibilityChange = "visibilitychange";
    // } else if (typeof document['msHidden'] !== "undefined") {
    //   hidden = "msHidden";
    //   visibilityChange = "msvisibilitychange";
    // } else if (typeof document['webkitHidden'] !== "undefined") {
    //   hidden = "webkitHidden";
    //   visibilityChange = "webkitvisibilitychange";
    // }

    // function handleVisibilityChange(evt) {
    //   setState(document[hidden])
    // }

    function handleWindowFocus() {
      setState(true)
    }

    function handleWindowBlur() {
      setState(false)
    }

    // document.addEventListener(visibilityChange, handleVisibilityChange, false);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      // document.removeEventListener(visibilityChange, handleVisibilityChange, false)
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
    }
  }, [])

  return state
}

export {
  useWindowVisibility,
  useWindowVisibility as default
}