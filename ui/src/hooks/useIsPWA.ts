import { useMemo } from "react";

function useIsPWA(): boolean {
  return useMemo(() => {
    return window.matchMedia('(display-mode: standalone)').matches
  }, [])
}

export {
  useIsPWA,
  useIsPWA as default
}