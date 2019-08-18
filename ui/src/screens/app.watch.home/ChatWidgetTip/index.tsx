import './style.css'
import * as React from 'react'
import { useMemo } from 'react'
import random from '~/utils/random'

const tips = [
  'Make it more enjoyable by inviting a friend!',
  'You can invite a friend by pressing that top right button.',
  'Nobody can access this party until you invite them.',
  'Invitations expire after 30 minutes.',
  'You can close this chat bar for a more immersive experience.',
  'You can press the ? key to view the keyboard shortcuts.',
  'The player allows you to disable subtitles if you prefer.',
  'Only the playing, pausing, and seeking is synced. Max up that volume or disable those subtitles if you like.',
  'You can switch between your phone and desktop anytime, whichever you prefer.'
]

function ChatWidgetTip() {
  const index =  useMemo(() => {
    return random(0, tips.length - 1)
  }, [])

  const tip = tips[index]

  return (
    <div className="app-watch-chat-widget-tip">
      <div className="icon">
        <i className="fa fa-hand-peace-o"></i>
      </div>

      <p className="text">
        <strong>Tip #{index + 1}: &nbsp;</strong>
        <span>{tip}</span>
      </p>
    </div>
  )
}

export default ChatWidgetTip