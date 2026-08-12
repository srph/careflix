import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  ArrowLeft,
  Captions,
  Keyboard,
  ListVideo,
  Maximize,
  MessageSquareText,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2
} from 'lucide-react'
import { show } from '../data'
import type { FloatingReaction } from './WatchScreen'

/*
 * The screen itself — no real <video>, the frame is painted in CSS.
 * The grade is classic orange-and-teal: cold shadows, one hot window
 * of late-afternoon kitchen light, an anamorphic flare across it.
 */
function PosterArt(props: { playing: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0">
      {/* Cold base */}
      <div className="absolute inset-0 bg-[linear-gradient(155deg,#243240_0%,#141d27_45%,#0a0d12_100%)]" />

      {/* Hot window light, upper right — brightens while playing */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(60%_50%_at_70%_30%,rgba(255,170,64,0.58),transparent_65%)]"
        animate={{ opacity: props.playing ? 1 : 0.75 }}
        transition={{ duration: 1.2 }}
      />

      {/* Warm bounce off the counter, lower left */}
      <div className="absolute inset-0 bg-[radial-gradient(45%_35%_at_22%_78%,rgba(240,105,60,0.22),transparent_70%)]" />

      {/* Anamorphic lens flare */}
      <div className="absolute top-[29%] left-[8%] h-px w-[70%] bg-[linear-gradient(90deg,transparent,rgba(140,210,255,0.5)_30%,rgba(180,230,255,0.85)_52%,rgba(140,210,255,0.5)_70%,transparent)] blur-[1px]" />
      <div className="absolute top-[29%] left-[16%] h-[3px] w-[54%] -translate-y-1/2 bg-[linear-gradient(90deg,transparent,rgba(120,200,255,0.18)_40%,rgba(120,200,255,0.3)_52%,rgba(120,200,255,0.18)_64%,transparent)] blur-[6px]" />

      {/* Counter silhouette */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(3,4,7,0.9),rgba(3,4,7,0.45)_22%,transparent_45%)]" />

      {/* Counter edge catching the window light */}
      <div className="absolute top-[62%] left-0 h-px w-[68%] bg-[linear-gradient(90deg,transparent,rgba(255,190,120,0.32)_38%,rgba(255,190,120,0.1)_80%,transparent)] blur-[1px]" />

      {/* Vignette */}
      <div className="absolute inset-0 shadow-[inset_0_0_140px_50px_rgba(0,0,0,0.55)]" />
    </div>
  )
}

function ReactionsLayer(props: {
  reactions: FloatingReaction[]
  onDone: (id: number) => void
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {props.reactions.map(r => (
        <motion.span
          key={r.id}
          className="absolute bottom-28 text-[26px] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
          style={{ left: `${r.x}%` }}
          initial={{ y: 0, opacity: 0, scale: 0.5 }}
          animate={{
            y: [-8, -290],
            x: [0, 14, -10, 6],
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.15, 1, 0.9]
          }}
          transition={{ duration: 3.4, ease: 'easeOut', times: [0, 0.15, 0.75, 1] }}
          onAnimationComplete={() => props.onDone(r.id)}>
          {r.emoji}
        </motion.span>
      ))}
    </div>
  )
}

function ControlButton(props: {
  label: string
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <motion.button
      type="button"
      aria-label={props.label}
      className="cursor-pointer text-cream/80 transition-colors hover:text-cream"
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.9 }}
      onClick={e => {
        e.stopPropagation()
        props.onClick?.()
      }}>
      {props.children}
    </motion.button>
  )
}

function VideoStage(props: {
  reactions: FloatingReaction[]
  onReactionDone: (id: number) => void
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="relative flex min-w-0 flex-1 flex-col p-6">
      {/* The frame — rounded, ringed, glowing onto the room */}
      <motion.div
        className="group relative flex-1 cursor-pointer overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_0_120px_-20px_rgba(255,160,70,0.3),0_0_200px_-40px_rgba(232,54,143,0.22)]"
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        onClick={() => setPlaying(p => !p)}>
        <PosterArt playing={playing} />

        {/* Top bar */}
        <motion.div
          className="absolute top-0 right-0 left-0 flex items-center justify-between bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),transparent)] px-6 py-5"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}>
          <a
            className="group/back flex items-center gap-2.5 text-sm font-medium text-cream/85 transition-colors hover:text-cream"
            href="#"
            onClick={e => e.stopPropagation()}>
            <ArrowLeft
              size={17}
              className="transition-transform group-hover/back:-translate-x-0.5"
            />
            Back to Browse
          </a>

          <div className="flex items-center gap-2 rounded-full bg-black/35 px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] text-cream/85 uppercase ring-1 ring-white/10 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ember-400" />
            </span>
            Live · Synced
          </div>
        </motion.div>

        {/* Center play — visible while paused */}
        <AnimatePresence>
          {!playing && (
            <motion.div
              key="play"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.3 }}
              transition={{ duration: 0.35 }}>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-black/35 ring-1 ring-white/25 backdrop-blur-md">
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full ring-2 ring-white/25"
                  animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                />
                <Play size={26} className="translate-x-0.5 fill-cream text-cream" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <ReactionsLayer reactions={props.reactions} onDone={props.onReactionDone} />

        {/* Bottom: title lockup + seeker + controls */}
        <motion.div
          className="absolute right-0 bottom-0 left-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.72),rgba(0,0,0,0.3)_60%,transparent)] px-7 pt-16 pb-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}>
          {/* Title lockup */}
          <div className="mb-5">
            <p className="mb-1.5 font-mono text-[10px] tracking-[0.28em] text-gold-300/80 uppercase">
              Now Playing
            </p>
            <h1 className="font-display text-[38px] leading-none font-medium text-cream italic">
              {show.title}
            </h1>
            <p className="mt-2 font-mono text-[12px] tracking-[0.08em] text-ink-300">
              {show.info}
            </p>
          </div>

          {/* Seeker */}
          <div
            className="group/seek relative cursor-pointer py-2"
            onClick={e => e.stopPropagation()}>
            <div className="relative h-[3px] rounded-full bg-white/15 transition-all group-hover/seek:h-[5px]">
              {/* Buffered */}
              <div className="absolute inset-y-0 left-0 w-[55%] rounded-full bg-white/15" />
              {/* Chapter ticks */}
              {[18, 47, 76].map(t => (
                <span
                  key={t}
                  className="absolute top-1/2 h-full w-px -translate-y-1/2 bg-black/50"
                  style={{ left: `${t}%` }}
                />
              ))}
              {/* Progress — ember into screenlight */}
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-[linear-gradient(90deg,#e8368f,#ff5c86_70%,#f5a54a)]"
                initial={{ width: 0 }}
                animate={{ width: `${show.progress}%` }}
                transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cream shadow-[0_0_0_5px_rgba(255,92,134,0.3),0_0_14px_rgba(255,92,134,0.8)]"
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: `${show.progress}%`, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>

          {/* Controls row */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <ControlButton label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying(p => !p)}>
                {playing ? (
                  <Pause size={21} className="fill-current" />
                ) : (
                  <Play size={21} className="fill-current" />
                )}
              </ControlButton>
              <ControlButton label="Back 10 seconds">
                <RotateCcw size={19} />
              </ControlButton>
              <ControlButton label="Forward 10 seconds">
                <RotateCw size={19} />
              </ControlButton>

              <div className="flex items-center gap-2.5">
                <ControlButton label="Volume">
                  <Volume2 size={19} />
                </ControlButton>
                <div className="relative h-[3px] w-14 rounded-full bg-white/20">
                  <div className="absolute inset-y-0 left-0 w-[70%] rounded-full bg-cream/90" />
                </div>
              </div>

              <p className="ml-1 font-mono text-[12px] tracking-[0.06em] text-cream/85 tabular-nums">
                {show.elapsed}
                <span className="mx-1.5 text-ink-400">/</span>
                <span className="text-ink-300">{show.duration}</span>
              </p>
            </div>

            <div className="flex items-center gap-5">
              <ControlButton label="Keyboard shortcuts">
                <Keyboard size={19} />
              </ControlButton>
              <ControlButton label="Subtitles">
                <Captions size={19} />
              </ControlButton>
              <ControlButton label="Episodes">
                <ListVideo size={19} />
              </ControlButton>
              <ControlButton label="Fullscreen">
                <Maximize size={18} />
              </ControlButton>
              <ControlButton label="Toggle chat">
                <MessageSquareText size={19} className="text-ember-300" />
              </ControlButton>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default VideoStage
