import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { useTransientState } from '~/hooks/use-transient-state'
import { toast } from '~/components/toast/toast'
import { cn } from '~/utils/cn'

// `chip` is the compact header version in the chat; the default row with its label sits in the invite panel.
export function AppWatchHomePartyCode({ code, chip = false }: { code?: string; chip?: boolean }) {
  const [copied, setCopied, resetCopied] = useTransientState(false, 1800)
  const reducedMotion = useReducedMotion()
  useEffect(resetCopied, [code])
  if (!code) return null
  const text = code

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text)
      else {
        const field = document.createElement('textarea')
        const focused = document.activeElement as HTMLElement | null
        field.value = text
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
      toast(`Couldn’t copy the code. You can share ${text.slice(0, 3)} ${text.slice(3)}.`)
    }
  }

  return (
    <div className={chip ? 'relative' : 'relative flex min-h-15 flex-none items-center gap-2.5 pr-4 pl-5'}>
      {!chip && (
        <span className="font-label text-10 leading-none font-semibold tracking-label text-neutral-400 uppercase">
          Party code
        </span>
      )}
      <UiPlainButton
        type="button"
        aria-label={`Copy party code ${code.slice(0, 3)} ${code.slice(3)}`}
        onClick={copy}
        className={cn(
          'inline-flex items-center rounded-full leading-none text-white transition-colors duration-200 hover:bg-neutral-700 motion-reduce:[transition:none]',
          chip ? 'h-7.5 gap-1.75 bg-neutral-800 pr-2.5 pl-3 text-13' : 'ml-auto min-h-8 gap-2 pr-2 pl-2.5 text-sm'
        )}>
        <b className="font-bold whitespace-nowrap tabular-nums">
          {code.slice(0, 3)} {code.slice(3)}
        </b>
        {/* Both icons share one cell, so the chip keeps its width while the copy icon shrinks away and the check pops in.
          Each sits on its own layer: centred in the cell it lands on a half pixel, and without that it snaps a pixel over as the spring ends. */}
        <span className="inline-grid size-4 place-items-center" aria-hidden="true">
          <AnimatePresence initial={false}>
            <motion.i
              key={copied ? 'copied' : 'copy'}
              className={`fa will-change-transform [grid-area:1/1] ${copied ? 'fa-check text-emerald-300' : 'fa-copy text-neutral-400'}`}
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.4 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: reducedMotion ? { duration: 0 } : { type: 'spring', duration: 0.35, bounce: 0.45 }
              }}
              exit={
                reducedMotion
                  ? { opacity: 0, transition: { duration: 0 } }
                  : { opacity: 0, scale: 0.4, transition: { duration: 0.12, ease: 'easeIn' } }
              }
            />
          </AnimatePresence>
        </span>
      </UiPlainButton>
      <span className="sr-only" role="status">
        {copied ? 'Party code copied' : ''}
      </span>
    </div>
  )
}
