import { useEffect, useRef } from 'react'

function useUpdateDebounce (fn: () => void, ms: number, args: any[]) {
  if (ms === void 0) { ms = 0; }
  if (args === void 0) { args = []; }
  
  const isInitRef = useRef<boolean>(false)

  useEffect(function () {
    if (!isInitRef.current) {
      isInitRef.current = true
      return
    }
    
    var handle = setTimeout(fn.bind(null, args), ms);
    return function () {
      // if args change then clear timeout
      clearTimeout(handle);
    };
  }, args);
};

export {
  useUpdateDebounce,
  useUpdateDebounce as default
}