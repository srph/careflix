import { useWindowSize } from '~/hooks/use-window-size'

function useMediaMode(): 'desktop' | 'mobile' {
  const { width } = useWindowSize();
  return width >= 640 ? 'desktop' : 'mobile'
}

export {
  useMediaMode
}