import * as React from 'react'
import UiPlainButton from '~/components/UiPlainButton'
import { REACTIONS, Reaction } from '../useReactions'

interface Props {
  onReact: (emoji: Reaction) => void
}

// One tap reacts; there's no picker to open.
function ReactionRow(props: Props) {
  return (
    <div className="watch-screen-reactions" role="group" aria-label="Reactions">
      {REACTIONS.map(emoji => (
        <UiPlainButton key={emoji} type="button" className="reaction" aria-label={`React with ${emoji}`} onClick={() => props.onReact(emoji)}>
          <span className="emoji" aria-hidden="true">{emoji}</span>
        </UiPlainButton>
      ))}
    </div>
  )
}

export default ReactionRow
