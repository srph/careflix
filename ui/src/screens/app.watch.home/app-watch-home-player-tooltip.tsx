import * as React from 'react'
import { useEffect, useRef } from 'react'
import { Tooltip } from '@base-ui/react/tooltip'

interface Props {
  onOpen: () => void
  onClose: () => void
  text: string
  align: 'left' | 'right'
  padding?: number
  // While something else is open from this control, e.g. a menu.
  disabled?: boolean
  children: React.ReactNode
}

/**
 * A player control's tooltip. Put the controls under one `Tooltip.Provider` so moving
 * between them swaps tooltips instantly instead of fading each one up.
 * onOpen and onClose come in pairs, so the controls can count how many are showing.
 */
export function AppWatchHomePlayerTooltip({ padding = 32, ...props }: Props) {
  const isOpen = useRef(false)
  const latest = useRef(props)
  latest.current = props

  function handleOpenChange(open: boolean) {
    if (open === isOpen.current) return
    isOpen.current = open
    if (open) props.onOpen()
    else props.onClose()
  }

  // A control can leave while its tooltip shows, e.g. subtitles when the episode changes.
  useEffect(() => () => {
    if (isOpen.current) latest.current.onClose()
  }, [])

  return (
    <Tooltip.Root disabled={props.disabled} onOpenChange={handleOpenChange}>
      <Tooltip.Trigger delay={0} closeOnClick={false} render={<div />}>
        {props.children}
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner side="top" align={props.align === 'left' ? 'start' : 'end'} sideOffset={padding}
          className="z-(--zindex-player-tooltip)">
          {/* Desktop only. Fades up on the way in and leaves at once; moving to the next control swaps it straight in. */}
          <Tooltip.Popup data-testid="player-tooltip"
            className="hidden rounded-sm bg-neutral-900 p-4 text-base leading-tight transition-[opacity,translate] duration-150 ease-out data-instant:[transition:none] data-starting-style:translate-y-1.5 data-starting-style:opacity-0 motion-reduce:data-starting-style:translate-y-0 lg:block">{props.text}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
