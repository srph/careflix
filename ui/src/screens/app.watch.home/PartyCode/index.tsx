import './style.css'
import { useEffect, useRef, useState } from 'react'
import UiPlainButton from '~/components/UiPlainButton'
import { toast } from '~/components/Toast'

// `chip` is the compact header version in the chat; the default row with its label sits in the invite panel.
export default function PartyCode({ code, chip = false }: { code?: string, chip?: boolean }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => {
    setCopied(false)
    return () => clearTimeout(timer.current)
  }, [code])
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
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      toast(`Couldn’t copy the code. You can share ${code.slice(0, 3)} ${code.slice(3)}.`)
    }
  }

  return <div className={chip ? 'watch-party-code is-chip' : 'watch-party-code'}>
    {!chip && <span>Party code</span>}
    <UiPlainButton type="button" aria-label={`Copy party code ${code.slice(0, 3)} ${code.slice(3)}`} onClick={copy}>
      <b>{code.slice(0, 3)} {code.slice(3)}</b>
      <i className={`fa ${copied ? 'fa-check is-copied' : 'fa-copy'}`} aria-hidden="true" />
    </UiPlainButton>
    <span className="watch-party-code-feedback" role="status">{copied ? 'Party code copied' : ''}</span>
  </div>
}
