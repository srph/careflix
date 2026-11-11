import './style.css'
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
export default function PlayerTooltip({ padding = 32, ...props }: Props) {
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
          className="app-watch-player-tooltip-popover-container">
          <Tooltip.Popup className="app-watch-player-tooltip-popover" data-testid="player-tooltip">{props.text}</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
}
