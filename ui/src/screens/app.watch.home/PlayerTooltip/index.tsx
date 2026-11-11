import './style.css'
import * as React from 'react'
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

export default function PlayerTooltip({ padding = 32, ...props }: Props) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root disabled={props.disabled} onOpenChange={open => { if (open) props.onOpen(); else props.onClose() }}>
        <Tooltip.Trigger delay={0} closeOnClick={false} render={<div />}>
          {props.children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner side="top" align={props.align === 'left' ? 'start' : 'end'} sideOffset={padding}
            className="app-watch-player-tooltip-popover-container">
            <Tooltip.Popup className="app-watch-player-tooltip-popover">{props.text}</Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
