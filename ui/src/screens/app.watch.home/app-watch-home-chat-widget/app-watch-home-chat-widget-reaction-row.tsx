import * as React from 'react'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { usePlayaContext } from '~/components/playa/playa'

// The six the row offers. Friends' reactions outside this set are ignored.
export const REACTIONS = ['😂', '😱', '😭', '❤️', '🔥', '👀'] as const

export type Reaction = (typeof REACTIONS)[number]

export const isReaction = (emoji: unknown): emoji is Reaction => REACTIONS.includes(emoji as Reaction)

// One tap reacts; there's no picker to open. No hover box either: the emoji itself grows, and dips while pressed.
export function AppWatchHomeChatWidgetReactionRow() {
  const playa = usePlayaContext()

  return (
    <div className="mx-3.5 -mt-1 mb-2 flex shrink-0 justify-between" role="group" aria-label="Reactions">
      {REACTIONS.map((emoji) => (
        <UiPlainButton
          key={emoji}
          type="button"
          className="group grid h-9 w-10 place-items-center rounded-lg text-xl leading-none"
          aria-label={`React with ${emoji}`}
          onClick={() => playa.react(emoji)}>
          <span
            className="block transition-[scale] duration-[.34s] ease-out-back group-hover:scale-122 group-focus-visible:scale-122 group-active:scale-86 group-active:duration-[.18s] group-active:ease-[cubic-bezier(.3,0,.5,1)] motion-reduce:[transition:none]"
            aria-hidden="true">
            {emoji}
          </span>
        </UiPlainButton>
      ))}
    </div>
  )
}
