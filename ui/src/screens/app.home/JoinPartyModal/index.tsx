import './style.css'
import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import UiButton from '~/components/UiButton'
import UiModal from '~/components/UiModal'
import UiPlainButton from '~/components/UiPlainButton'
import UiAvatar from '~/components/UiAvatar'
import { useAuth } from '~/contexts/Auth'
import { useInvitationOverlay } from '~/screens/app/InvitationModal/Context'
import { useJoinPartyMutation, usePartyCodeQuery } from '../queries'
import Artwork from '../Listing/Artwork'
import { clockTime } from '../Listing/format'
import { previewStatus, presentMembers } from './format'

export default function JoinPartyModal() {
  const [open, setOpen] = useState(false)
  const joining = useRef(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const overlay = useInvitationOverlay()
  const close = () => { if (!joining.current) setOpen(false) }
  return <>
    <UiPlainButton ref={trigger} className="listing-join" aria-haspopup="dialog" aria-expanded={open} onClick={event => {
      event.currentTarget.focus()
      overlay.setExpanded(false)
      setOpen(true)
    }}>Join Party</UiPlainButton>
    <UiModal isOpen={open} onClose={close} finalFocus={trigger} ariaLabel="Join a watch party"
      modalClassName="join-party-modal" overlayClassName="join-party-overlay">
      {() => <JoinPartyForm onClose={close} joining={joining} />}
    </UiModal>
  </>
}

function JoinPartyForm({ onClose, joining }: { onClose: () => void; joining: React.MutableRefObject<boolean> }) {
  const auth = useAuth()
  const [code, setCode] = useState('')
  const [lookupCode, setLookupCode] = useState('')
  const [shown, setShown] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const reducedMotion = useReducedMotion()
  const query = usePartyCodeQuery(lookupCode)
  const join = useJoinPartyMutation()
  const preview = code === lookupCode ? query.data : undefined
  const looking = code.length === 6 && (lookupCode !== code || query.isFetching)
  const lookupError = code === lookupCode && query.isError
  const error = (join.error ?? (lookupError ? query.error : null)) as { response?: { status: number } } | null
  const wrong = error?.response?.status === 404
  const throttled = error?.response?.status === 429
  const found = preview?.creator
    ? String(preview.creator.id) === String(auth.data.id) ? 'Found your watch party' : `Found ${preview.creator.name}’s watch party`
    : 'Watch party found'

  useEffect(() => {
    input.current?.focus()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLookupCode(code.length === 6 ? code : ''), 200)
    return () => clearTimeout(timer)
  }, [code])

  useEffect(() => {
    setShown(false)
    if (!preview) return
    const timer = setTimeout(() => setShown(true), reducedMotion ? 0 : 850)
    return () => clearTimeout(timer)
  }, [preview, reducedMotion])

  function change(value: string) {
    if (joining.current) return
    const next = value.replace(/\D/g, '').slice(0, 6)
    if (next === code) return
    setCode(next)
    setShown(false)
    join.reset()
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!preview || looking || joining.current || wrong) return
    joining.current = true
    try { await join.mutateAsync(code) } catch { /* The inline status keeps the code available for retry. */ }
    finally { joining.current = false }
  }

  const message = looking ? 'Looking for the watch party…'
    : error ? wrong ? `No watch party uses ${formatCode(code)}. Check it and try again.`
      : throttled ? 'Too many attempts. Please wait a minute and try again.'
        : join.isError ? 'Could not join this party. Please try again.' : 'Could not look up this code. Please try again.'
      : preview ? found : 'Anyone in the watch party can find it above their chat.'

  return <form className={`join-party-form${preview ? ' is-found' : ''}${shown && preview && !error ? ' is-shown' : ''}${wrong ? ' is-wrong' : ''}`}
    onSubmit={submit}>
    <div className="join-party-heading"><h2>Join a watch party</h2>
      <UiPlainButton type="button" aria-label="Close" disabled={join.isPending} onClick={onClose}><i className="fa fa-times" aria-hidden="true" /></UiPlainButton>
    </div>
    <p className="join-party-description" id={`${id}-hint`}>Enter the 6-digit code someone shared with you.</p>
    <div className="join-party-code-box">
      <input ref={input} aria-label="Party code" aria-describedby={`${id}-hint ${id}-status`} aria-invalid={wrong || undefined}
        inputMode="numeric" autoComplete="off" type="text" maxLength={32} value={code} disabled={join.isPending}
        onChange={event => change(event.target.value)} onPaste={event => { event.preventDefault(); change(event.clipboardData.getData('text/plain')) }} />
      <div className="join-party-cells" aria-hidden="true">
        {Array.from({ length: 6 }, (_, index) => <Fragment key={index}>
          {index === 3 && <span className="join-party-separator" />}
          <span className={`join-party-cell${code[index] ? ' is-filled' : ''}${index === Math.min(code.length, 5) ? ' is-current' : ''}`}>{code[index] || ''}</span>
        </Fragment>)}
      </div>
    </div>
    <div className={`join-party-status${error ? ' is-error' : ''}`} id={`${id}-status`} role={error ? 'alert' : 'status'}>
      {looking && <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />}
      {preview && !error && !looking && <i className="fa fa-check" aria-hidden="true" />}
      <span>{message} {lookupError && !wrong && <button type="button" onClick={() => { void query.refetch() }}>Retry</button>}</span>
    </div>
    <div className="join-party-unfold" inert={!shown || !preview || Boolean(error)}><div>
      {preview && <PartyPreview party={preview} />}
    </div></div>
    <div className="join-party-actions">
      <UiButton type="button" size="l" disabled={join.isPending} onClick={onClose}>Cancel</UiButton>
      <UiButton type="submit" variant="primary" size="l" disabled={!preview || looking || join.isPending || wrong}>
        {join.isPending ? <><i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> Joining</> : preview?.is_member ? 'Open party' : 'Join party'}
      </UiButton>
    </div>
  </form>
}

function PartyPreview({ party }: { party: AppPartyPreview }) {
  const active = party.members.filter(member => member.pivot.is_active)
  const progress = Math.min(100, Math.max(0, party.video.duration ? party.current_time / party.video.duration * 100 : 0))
  return <div className="join-party-preview" aria-label="Watch party preview">
    <div className="join-party-artwork"><Artwork src={party.video.preview_image} eager />
      {progress > 0 && <div className="join-party-progress" role="progressbar" aria-label="Playback progress" aria-valuenow={Math.round(progress)}><i style={{ width: `${progress}%` }} /></div>}
    </div>
    <div className="join-party-preview-copy"><b>{party.video.show.title}</b>
      <small>{previewStatus(party)}</small>
      {party.video.show.title_type === 'series' && <small>{party.is_playing && active.length ? 'Watching now' : 'Paused'} · {clockTime(party.current_time)} of {clockTime(party.video.duration)}</small>}
      <div className="join-party-members">
        <div className="join-party-avatars" aria-hidden="true">{party.members.slice(0, 3).map(member => <span key={member.id} className={member.pivot.is_active ? '' : 'is-away'}>
          <UiAvatar user={member} />
        </span>)}</div>
        <span>{active.length === 1 && !party.current_time && !party.is_playing ? `${active[0].name} is waiting` : presentMembers(active)}</span>
      </div>
    </div>
  </div>
}

function formatCode(code: string) { return `${code.slice(0, 3)} ${code.slice(3)}` }
