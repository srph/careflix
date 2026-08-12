import { useCallback, useEffect, useState } from 'react'
import VideoStage from './VideoStage'
import ChatSidebar from './ChatSidebar'
import { quickReactions } from '../data'

export interface FloatingReaction {
  id: number
  emoji: string
  /** Horizontal spawn position, % of the video width */
  x: number
}

let nextReactionId = 1

/*
 * A tiled feTurbulence noise overlay — film grain over the whole room.
 */
const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

function WatchScreen() {
  const [reactions, setReactions] = useState<FloatingReaction[]>([])

  const spawnReaction = useCallback((emoji: string) => {
    setReactions(prev => [
      ...prev.slice(-11),
      { id: nextReactionId++, emoji, x: 58 + Math.random() * 34 }
    ])
  }, [])

  const removeReaction = useCallback((id: number) => {
    setReactions(prev => prev.filter(r => r.id !== id))
  }, [])

  // The party reacts on its own every so often — keeps the scene alive.
  useEffect(() => {
    const timer = setInterval(() => {
      spawnReaction(quickReactions[Math.floor(Math.random() * quickReactions.length)])
    }, 4200)
    return () => clearInterval(timer)
  }, [spawnReaction])

  return (
    <div className="relative flex h-full w-full overflow-hidden bg-ink-950">
      {/* Ambient room light — the screen spills onto the walls */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_65%_at_38%_28%,rgba(255,166,64,0.09),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_78%_80%,rgba(232,54,143,0.07),transparent_70%)]"
      />

      <VideoStage reactions={reactions} onReactionDone={removeReaction} />
      <ChatSidebar onReact={spawnReaction} />

      {/* Film grain over everything */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  )
}

export default WatchScreen
