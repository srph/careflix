import * as React from 'react'
import { createContext, use, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '~/utils/cn'
import { useMediaMode } from '~/hooks/use-media-mode'
import type { Playa as PlayaApi } from './use-playa'

const PlayaContext = createContext<PlayaApi | null>(null)

/** The playa from the nearest PlayaProvider. */
export function usePlayaContext(): PlayaApi {
  const playa = use(PlayaContext)
  if (!playa) throw new Error('usePlayaContext needs a <PlayaProvider>')
  return playa
}

/** Hands a playa to everything below, inside the picture or not. Renders nothing of its own. */
export function PlayaProvider(props: { playa: PlayaApi; children: React.ReactNode }) {
  return <PlayaContext value={props.playa}>{props.children}</PlayaContext>
}

interface PlayaProps {
  ref?: React.Ref<HTMLDivElement>
  className?: string
  children: React.ReactNode
}

/** The box the picture and every layer over it sit in. */
export function Playa(props: PlayaProps) {
  return (
    <div data-testid="video-pane" ref={props.ref} className={cn('relative', props.className)}>
      {props.children}
    </div>
  )
}

/**
 * The 16:9 picture with the `<video>` in it, the poster until the first frame.
 * On desktop a click plays or pauses and moving the pointer shows the controls; on phones a tap shows them.
 */
export function PlayaElement(props: { src: string; poster?: string }) {
  const playa = usePlayaContext()
  const media = useMediaMode()

  function handleClick() {
    if (media === 'desktop') playa.toggle()
    else playa.overlay.open()
  }

  function handleMouseMove() {
    if (media === 'desktop') playa.overlay.peek()
  }

  return (
    // cursor-pointer: see https://github.com/facebook/react/issues/2055
    <div
      data-testid="video-stage"
      className="relative w-full cursor-pointer bg-black bg-cover pb-[56.25%]"
      style={playa.state.isReady || !props.poster ? {} : { backgroundImage: `url(${props.poster})` }}
      onMouseMove={handleMouseMove}
      onClick={handleClick}>
      <video
        className="pointer-events-none absolute inset-0 size-full sm:static"
        src={props.src}
        ref={playa.$video}
        {...playa.events}
      />
    </div>
  )
}

/**
 * The controls' layer: up while the pointer moves over the picture (desktop) or after a tap (phones).
 * Clicking its backdrop plays or pauses on desktop, and puts the controls away on phones.
 */
export function PlayaOverlay(props: { children: React.ReactNode }) {
  const playa = usePlayaContext()
  const media = useMediaMode()

  function handleBackdropClick() {
    if (media === 'desktop') playa.toggle()
    else playa.overlay.close()
  }

  return (
    <AnimatePresence initial={false}>
      {playa.state.isOverlayOpen && (
        <motion.div
          data-testid="player-chrome"
          className="pointer-events-auto absolute inset-0 z-(--zindex-player-overlay)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}>
          <div
            className="absolute inset-0 bg-black/70 sm:bg-transparent sm:bg-linear-to-t sm:from-black/75 sm:to-transparent"
            onClick={handleBackdropClick}
          />

          {props.children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Keeps the controls up, and the timeline out of the way, while `isOpen`, e.g. a menu opened from them. */
export function usePinPlayaOverlay(isOpen: boolean) {
  const { overlay } = usePlayaContext()
  const pin = React.useRef(overlay.pin)
  pin.current = overlay.pin
  const wasOpen = React.useRef(false)
  // Only changes count: pinning off on mount would start the hide timer on phones, where taps decide.
  useEffect(() => {
    if (isOpen === wasOpen.current) return
    wasOpen.current = isOpen
    pin.current(isOpen)
  }, [isOpen])
  // A menu that unmounts while open must not leave the controls stuck up.
  useEffect(
    () => () => {
      if (wasOpen.current) pin.current(false)
    },
    []
  )
}
