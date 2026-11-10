import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * One line of text where each new value rolls up into place and the old one rolls out above it.
 * The wrapper needs `position: relative` and a height; the lines stack absolutely inside it.
 */
export default function RollingText({ text, className, lineClassName }: {
  text: string
  className?: string
  lineClassName?: string
}) {
  const reducedMotion = useReducedMotion()
  return <span className={className}>
    <AnimatePresence initial={false}>
      <motion.span key={`${text}|${lineClassName || ''}`} className={lineClassName}
        initial={{ opacity: 0, y: reducedMotion ? 0 : 7 }}
        animate={{ opacity: 1, y: 0, transition: { duration: .3, delay: .08, ease: [.2, .8, .2, 1] } }}
        exit={{ opacity: 0, y: reducedMotion ? 0 : -7, transition: { duration: .19, ease: 'easeIn' } }}>{text}</motion.span>
    </AnimatePresence>
  </span>
}
