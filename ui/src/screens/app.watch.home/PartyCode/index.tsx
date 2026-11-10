import './style.css'
import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import UiPlainButton from '~/components/UiPlainButton'
import useTransientState from '~/hooks/useTransientState'
import { toast } from '~/components/Toast'

// `chip` is the compact header version in the chat; the default row with its label sits in the invite panel.
export default function PartyCode({ code, chip = false }: { code?: string, chip?: boolean }) {
  const [copied, setCopied, resetCopied] = useTransientState(false, 1800)
  const reducedMotion = useReducedMotion()
  useEffect(resetCopied, [code])
  if (!code) return null

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(code)
      else {
        const field = document.createElement('textarea')
        const focused = document.activeElement as HTMLElement | null
        field.value = code
        field.style.cssText = 'position:fixed;opacity:0;pointer-events:none'
        document.body.appendChild(field)
        try {
          field.select()
          if (!document.execCommand('copy')) throw new Error('Clipboard unavailable')
        } finally {
          field.remove()
          focused?.focus()
        }
      }
      setCopied(true)
    } catch {
      toast(`Couldn’t copy the code. You can share ${code.slice(0, 3)} ${code.slice(3)}.`)
    }
  }

  return <div className={chip ? 'watch-party-code is-chip' : 'watch-party-code'}>
    {!chip && <span>Party code</span>}
    <UiPlainButton type="button" aria-label={`Copy party code ${code.slice(0, 3)} ${code.slice(3)}`} onClick={copy}>
      <b>{code.slice(0, 3)} {code.slice(3)}</b>
      {/* Both icons share one cell, so the chip keeps its width while the copy icon shrinks away and the check pops in. */}
      <span className="watch-party-code-icon" aria-hidden="true">
        <AnimatePresence initial={false}>
          <motion.i key={copied ? 'copied' : 'copy'} className={`fa ${copied ? 'fa-check is-copied' : 'fa-copy'}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: .4 }}
            animate={{ opacity: 1, scale: 1, transition: reducedMotion ? { duration: 0 } : { type: 'spring', duration: .35, bounce: .45 } }}
            exit={reducedMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: .4, transition: { duration: .12, ease: 'easeIn' } }} />
        </AnimatePresence>
      </span>
    </UiPlainButton>
    <span className="watch-party-code-feedback" role="status">{copied ? 'Party code copied' : ''}</span>
  </div>
}
