import * as React from 'react'
import { cn } from '~/utils/cn'
import type { ActivityLevel } from '../activityLevel'

/**
 * A close-up of the picture's bottom-left corner at each level, drawn at size.
 * The people are stand-ins, the same in every room.
 */
// The sizes below are the real overlay's, scaled down to fit, so they sit off the type scale on purpose.
const LINE = 'flex items-center rounded-full bg-black/42 py-0.5 pr-1.75 pl-0.5 text-[9.5px]/[1.2] whitespace-nowrap text-neutral-200'
const FACE = 'mr-1.25 inline-grid size-3.75 place-items-center rounded-full bg-white/14 text-[7.5px] font-bold text-white'
const NAME = 'text-white'

function Preview({ level }: { level: ActivityLevel }) {
  return (
    // The pink ring marks the level that's chosen: the menu's option is the `group`.
    <span className="relative block h-21.5 w-38 flex-none overflow-hidden rounded-md bg-linear-to-b from-neutral-800 via-neutral-900 via-55% to-neutral-950 ring-1 ring-white/8 group-data-checked:ring-2 group-data-checked:ring-pink-500" aria-hidden="true">
      {level === 'all' && (
        <span className="absolute top-1.25 right-2.5 flex flex-col items-center">
          <span className="text-base leading-none">😂</span>
          <span className="mt-0.5 rounded-full bg-white px-1.5 py-px text-[7.5px] leading-tight font-bold text-neutral-950">Joyce</span>
        </span>
      )}

      {level !== 'off' && (
        <span className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
          {level === 'all' && (
            <span className={LINE}><span className={cn(FACE, 'bg-emerald-300 text-neutral-950')}>L</span><b className={NAME}>Leo</b>&nbsp;ok who picked this</span>
          )}
          <span className={LINE}><span className={FACE}>👋</span><b className={NAME}>Joyce</b>&nbsp;is here.</span>
          {level === 'activity' && (
            <span className={LINE}><span className={cn(FACE, 'text-[6px]')}><i className="fa fa-pause" /></span><b className={NAME}>Mira</b>&nbsp;paused at 41:12</span>
          )}
        </span>
      )}
    </span>
  )
}

export default Preview
