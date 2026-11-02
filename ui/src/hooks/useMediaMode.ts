import useWindowSize from '~/hooks/useWindowSize'

function useMediaMode(): 'desktop' | 'mobile' {
  const { width } = useWindowSize();
  return width >= 640 ? 'desktop' : 'mobile'
}

export {
  useMediaMode,
  useMediaMode as default
}