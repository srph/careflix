import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { cn } from '~/utils/cn'
import { easeOutSoft } from '~/utils/motion'

/**
 * One line of text where each new value rolls up into place and the old one rolls out above it.
 * Give the wrapper (`className`) `relative` and a height; the lines stack in that one slot.
 */
export function AppWatchHomeChatInvitationPanelRollingText({
  text,
  className,
  lineClassName
}: {
  text: string
  className?: string
  lineClassName?: string
}) {
  const reducedMotion = useReducedMotion()
  return (
    <span className={className}>
      <AnimatePresence initial={false}>
        <motion.span
          key={`${text}|${lineClassName || ''}`}
          className={cn('absolute inset-0 truncate', lineClassName)}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 7 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.08, ease: easeOutSoft } }}
          exit={{ opacity: 0, y: reducedMotion ? 0 : -7, transition: { duration: 0.19, ease: 'easeIn' } }}>
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
