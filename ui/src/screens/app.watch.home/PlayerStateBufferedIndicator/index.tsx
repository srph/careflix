import * as React from 'react'
import useUpdateEffect from '~/hooks/useUpdateEffect'
import { useBufferState } from '~/hooks/useBufferState'

interface Props {
  isPlaying: boolean
}

function PlayerStateBufferedIndicator(props: Props) {
  const [isOpen, setIsOpen] = useBufferState({ timeout: 400 })

  useUpdateEffect(() => {
    setIsOpen()
  }, [props.isPlaying])

  if (!isOpen) {
    return null
  }

  return (
    <div className="pointer-events-none absolute top-[calc(50%-60px)] left-[calc(50%-60px)] z-(--zindex-player-state-buffered-indicator) hidden size-30 animate-fade-out items-center justify-center rounded-full bg-black/75 text-5xl leading-none text-white opacity-0 select-none lg:flex">
      {props.isPlaying ? <i className="fa fa-play" /> : <i className="fa fa-pause" />}
    </div>
  )
}

export default PlayerStateBufferedIndicator