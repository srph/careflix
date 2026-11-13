import * as React from 'react'
import { createContext, useMemo, useState } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'
import { cn } from '~/utils/cn'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { usePlayaContext } from './playa'
import { PlayaTooltip, PlayaTooltipCount } from './playa-tooltip'

/** How many of the controls' tooltips are showing; the timeline steps aside for them. */
export const PlayaOpenTooltips = createContext(0)

// A control in the bar. `DESKTOP` ones (play, skip, volume) only show on desktop; phones and tablets use PlayaCenterControls.
export const PLAYA_ITEM = 'relative shrink-0 text-xl leading-none text-white lg:text-3xl'
export const PLAYA_DESKTOP_ITEM = `${PLAYA_ITEM} hidden lg:flex`
const CENTER_ACTION = 'pointer-events-auto p-4 text-base leading-none'

/** The bottom of the controls: PlayaSlider over a PlayaBar. Every tooltip in it shares one provider. */
export function PlayaControls(props: { children: React.ReactNode }) {
  // Counted, not a flag: moving across the controls opens the next tooltip before the last one closes.
  const [openTooltips, setOpenTooltips] = useState(0)
  const count = useMemo(
    () => ({
      onOpen: () => setOpenTooltips((count) => count + 1),
      onClose: () => setOpenTooltips((count) => Math.max(0, count - 1))
    }),
    []
  )

  return (
    // One provider for every control's tooltip: once one shows, moving to the next swaps it in
    // instantly (data-instant) instead of fading up again.
    <Tooltip.Provider>
      <PlayaTooltipCount value={count}>
        <PlayaOpenTooltips value={openTooltips}>
          <div className="absolute inset-x-0 bottom-0 z-(--zindex-player-overlay-elements)">{props.children}</div>
        </PlayaOpenTooltips>
      </PlayaTooltipCount>
    </Tooltip.Provider>
  )
}

/** The row of controls under the timeline, from 640px up. Lay it out left to right; PlayaSpacer pushes what follows to the right. */
export function PlayaBar(props: { children: React.ReactNode }) {
  return (
    <div data-testid="player-actions" className="hidden items-center gap-8 p-4 sm:flex lg:px-8">
      {props.children}
    </div>
  )
}

export function PlayaSpacer() {
  return <div className="flex-1" />
}

interface ButtonProps {
  label: string
  onClick: () => void
  align?: 'left' | 'right'
  // Only on desktop, like play and skip.
  isDesktopOnly?: boolean
  // While something else is open from this control, e.g. a menu.
  isTooltipDisabled?: boolean
  className?: string
  children: React.ReactNode
}

/** A control in the bar: an icon button with its tooltip. */
export function PlayaButton(props: ButtonProps) {
  return (
    <PlayaTooltip
      text={props.label}
      align={props.align ?? 'left'}
      disabled={props.isTooltipDisabled}
      className={cn(props.isDesktopOnly ? PLAYA_DESKTOP_ITEM : PLAYA_ITEM, props.className)}>
      <UiPlainButton aria-label={props.label} onClick={props.onClick}>
        {props.children}
      </UiPlainButton>
    </PlayaTooltip>
  )
}

export function PlayaPlayPause() {
  const playa = usePlayaContext()
  return (
    <PlayaButton label={playa.state.isPlaying ? 'Pause' : 'Play'} isDesktopOnly onClick={playa.toggle}>
      {playa.state.isPlaying ? <i className="fa fa-pause" /> : <i className="fa fa-play" />}
    </PlayaButton>
  )
}

export function PlayaBackward() {
  const playa = usePlayaContext()
  return (
    <PlayaButton label="Rewind by 10 seconds" isDesktopOnly onClick={() => playa.skip(-10)}>
      <i className="fa fa-backward" />
    </PlayaButton>
  )
}

export function PlayaForward() {
  const playa = usePlayaContext()
  return (
    <PlayaButton label="Forward by 10 seconds" isDesktopOnly onClick={() => playa.skip(10)}>
      <i className="fa fa-forward" />
    </PlayaButton>
  )
}

export function PlayaFullscreen(props: { align?: 'left' | 'right' }) {
  const playa = usePlayaContext()
  const label = playa.state.isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'
  return (
    <PlayaButton label={label} align={props.align} onClick={playa.toggleFullscreen}>
      {playa.state.isFullscreen ? <i className="fa fa-compress" /> : <i className="fa fa-expand" />}
    </PlayaButton>
  )
}

export function PlayaSubtitlesToggle(props: { align?: 'left' | 'right' }) {
  const playa = usePlayaContext()
  const isOn = playa.state.isSubtitlesOn
  return (
    <PlayaButton
      label={isOn ? 'Disable subtitles' : 'Enable subtitles'}
      align={props.align}
      className={cn(!isOn && 'opacity-50 transition-opacity duration-200')}
      onClick={playa.toggleSubtitles}>
      <i className="fa fa-align-center" />
    </PlayaButton>
  )
}

/** Rewind, play/pause and forward in the middle of the picture, for phones and tablets. */
export function PlayaCenterControls() {
  const playa = usePlayaContext()
  return (
    <div
      data-testid="player-mobile-actions"
      className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center lg:hidden">
      <UiPlainButton className={CENTER_ACTION} aria-label="Rewind by 10 seconds" onClick={() => playa.skip(-10)}>
        <i className="fa fa-backward" />
      </UiPlainButton>

      <UiPlainButton
        className="pointer-events-auto mx-4 flex size-10 items-center justify-center rounded-full bg-pink-500 text-base leading-none text-white"
        aria-label={playa.state.isPlaying ? 'Pause' : 'Play'}
        onClick={playa.toggle}>
        {playa.state.isPlaying ? (
          <i className="fa fa-pause" />
        ) : (
          <span className="pl-0.5">
            <i className="fa fa-play" />
          </span>
        )}
      </UiPlainButton>

      <UiPlainButton className={CENTER_ACTION} aria-label="Forward by 10 seconds" onClick={() => playa.skip(10)}>
        <i className="fa fa-forward" />
      </UiPlainButton>
    </div>
  )
}
