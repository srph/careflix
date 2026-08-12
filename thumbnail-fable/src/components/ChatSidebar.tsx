import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowUp, Sparkles, UserRoundPlus } from 'lucide-react'
import { UiAvatar, UiAvatarGroup } from './Avatar'
import { members, logs as initialLogs, self, jorenz, quickReactions } from '../data'
import type { Log, MessageLog } from '../data'

function cx(...parts: (string | false | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

function firstName(name: string) {
  return name.split(' ')[0]
}

const TIP_INDEX = 3
const TIP_TEXT = 'You can close this chat bar for a more immersive experience.'

function ActivityLine(props: { log: Log & { type: 'activity' } }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <span aria-hidden className="h-px flex-1 bg-white/[0.06]" />
      <p className="font-mono text-[9.5px] tracking-[0.18em] text-ink-400 uppercase">
        <span style={{ color: props.log.user.color }}>{firstName(props.log.user.name)}</span>{' '}
        {props.log.text}
      </p>
      <span aria-hidden className="h-px flex-1 bg-white/[0.06]" />
    </div>
  )
}

function MessageGroup(props: { log: MessageLog }) {
  const isSelf = props.log.user.id === self.id

  return (
    <div className={cx('flex items-end gap-2', isSelf && 'flex-row-reverse')}>
      <UiAvatar user={props.log.user} />

      <div className={cx('flex min-w-0 flex-col', isSelf && 'items-end')}>
        {!isSelf && (
          <p
            className="mb-1 ml-2 text-[11px] font-medium opacity-90"
            style={{ color: props.log.user.color }}>
            {props.log.user.name}
          </p>
        )}

        <div className={cx('flex flex-col gap-[3px]', isSelf && 'items-end')}>
          {props.log.texts.map((text, j) => {
            const isFirst = j === 0
            const isLast = j === props.log.texts.length - 1

            return (
              <div
                key={j}
                className={cx(
                  'max-w-[210px] rounded-[18px] px-3.5 py-2 text-[13.5px] leading-snug',
                  isSelf
                    ? 'bg-[linear-gradient(135deg,#ff5c86,#e8368f)] text-white shadow-[0_4px_18px_-4px_rgba(232,54,143,0.5)]'
                    : 'bg-ink-800 text-cream/90',
                  // iMessage-style corner flattening on the avatar side
                  !isSelf && !isFirst && 'rounded-tl-md',
                  !isSelf && !isLast && 'rounded-bl-md',
                  isSelf && !isFirst && 'rounded-tr-md',
                  isSelf && !isLast && 'rounded-br-md'
                )}>
                {text}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <motion.div
      className="flex items-end gap-2"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.4 }}>
      <UiAvatar user={jorenz} />
      <div className="flex gap-1 rounded-[18px] bg-ink-800 px-3.5 py-3">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-ink-400"
            animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </motion.div>
  )
}

function ChatSidebar(props: { onReact: (emoji: string) => void }) {
  const [logs, setLogs] = useState<Log[]>(initialLogs)
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  // Logs present at mount get the staggered entrance; later ones animate immediately.
  const mountCount = useRef(initialLogs.length)

  const watching = members.filter(m => m.isOnline).length

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  function send() {
    const text = message.trim()
    if (!text) return
    setMessage('')
    setLogs(prev => {
      const last = prev[prev.length - 1]
      if (last?.type === 'message' && last.user.id === self.id) {
        return [...prev.slice(0, -1), { ...last, texts: [...last.texts, text] }]
      }
      return [...prev, { type: 'message', user: self, texts: [text] }]
    })
  }

  return (
    <aside className="relative z-10 flex h-full w-[336px] shrink-0 flex-col border-l border-white/[0.06] bg-[#0e0a07]/85">
      {/* Canopy */}
      <motion.header
        className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <div>
          <p className="font-mono text-[9.5px] tracking-[0.24em] text-gold-300/70 uppercase">
            Watch Party
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <UiAvatarGroup users={members} />
            <span className="text-[12px] text-ink-400">{watching} watching</span>
          </div>
        </div>

        <button
          type="button"
          className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full border border-white/10 px-3.5 text-[12.5px] font-medium text-cream/85 transition-colors hover:border-ember-400/60 hover:text-ember-300">
          <UserRoundPlus size={13} />
          Invite
        </button>
      </motion.header>

      {/* Messages */}
      <div ref={scrollRef} className="chat-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
        <div className="flex min-h-full flex-col justify-end gap-4">
          {logs.map((log, i) => {
            const staggered = i < mountCount.current

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: staggered ? 0.25 + i * 0.09 : 0,
                  duration: 0.45,
                  ease: 'easeOut'
                }}>
                {i === TIP_INDEX && (
                  <div className="mb-4 flex gap-2.5 rounded-xl border border-gold-300/20 bg-gold-300/[0.05] px-3.5 py-3">
                    <Sparkles size={14} className="mt-0.5 shrink-0 text-gold-300" />
                    <p className="text-[12px] leading-relaxed text-gold-200/80">{TIP_TEXT}</p>
                  </div>
                )}

                {log.type === 'activity' ? (
                  <ActivityLine log={log} />
                ) : (
                  <MessageGroup log={log} />
                )}
              </motion.div>
            )
          })}

          <TypingIndicator />
        </div>
      </div>

      {/* Chatbar */}
      <div className="border-t border-white/[0.06] px-5 pt-3 pb-5">
        <div className="mb-3 flex items-center gap-1.5">
          {quickReactions.map(emoji => (
            <motion.button
              key={emoji}
              type="button"
              aria-label={`React with ${emoji}`}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/[0.05] text-[15px] transition-colors hover:bg-white/[0.12]"
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => props.onReact(emoji)}>
              {emoji}
            </motion.button>
          ))}
        </div>

        <form
          className="relative"
          onSubmit={e => {
            e.preventDefault()
            send()
          }}>
          <input
            ref={inputRef}
            className="h-11 w-full rounded-full border border-white/[0.06] bg-ink-800/80 pr-12 pl-4 text-[13.5px] text-cream outline-none placeholder:text-ink-500 focus:border-ember-400/50"
            placeholder="Press / to chat…"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />

          <motion.button
            type="submit"
            aria-label="Send message"
            disabled={!message.trim()}
            className="absolute top-1/2 right-1.5 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#ff5c86,#e8368f)] text-white shadow-[0_2px_12px_rgba(232,54,143,0.5)] disabled:cursor-not-allowed disabled:bg-ink-700 disabled:bg-none disabled:text-ink-400 disabled:shadow-none"
            whileTap={{ scale: 0.85 }}>
            <ArrowUp size={15} />
          </motion.button>
        </form>
      </div>
    </aside>
  )
}

export default ChatSidebar
