import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { UiButton } from '~/components/ui-button/ui-button'
import { UiModal } from '~/components/ui-modal/ui-modal'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { useAuth } from '~/lib/auth/auth-queries'
import { cn } from '~/utils/cn'
import { useInvitationOverlay } from '~/screens/app/app-invitation-modal/app-invitation-modal-context'
import { useJoinPartyMutation, usePartyCodeQuery } from './app-home-queries'
import { AppHomeListingArtwork } from './app-home-listing/app-home-listing-artwork'
import { clockTime } from './app-home-listing/app-home-listing-format'
import { previewStatus, presentMembers } from './app-home-join-party-modal-format'

export function AppHomeJoinPartyModal() {
  const [open, setOpen] = useState(false)
  const joining = useRef(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const overlay = useInvitationOverlay()
  const close = () => {
    if (!joining.current) setOpen(false)
  }
  return (
    <>
      <span className="ml-auto flex flex-none">
        <UiButton
          ref={trigger}
          variant="primary"
          round
          aria-haspopup="dialog"
          aria-expanded={open}
          className="h-9 px-3 text-10 leading-none transition-[background-color,filter,box-shadow,outline-color,opacity,scale] active:scale-96 aria-expanded:ring-4 aria-expanded:ring-pink-500/25 motion-reduce:[transition:none] sm:h-10.5 sm:px-4.75 sm:text-11"
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            event.currentTarget.focus()
            overlay.setExpanded(false)
            setOpen(true)
          }}>
          Join Party
        </UiButton>
      </span>
      <UiModal
        isOpen={open}
        onClose={close}
        finalFocus={trigger}
        ariaLabel="Join a watch party"
        modalClassName="mx-auto mt-[min(96px,12dvh)] mb-6 w-[min(440px,calc(100%-32px))] rounded-2xl border border-neutral-800 bg-neutral-900 p-5 text-sm text-white shadow-[0_30px_80px_-20px_#000] transition-[opacity,translate,scale] duration-[.22s,.3s,.3s] ease-out-soft data-ending-style:translate-y-2.5 data-ending-style:scale-[.985] data-starting-style:translate-y-2.5 data-starting-style:scale-[.985] sm:px-6 sm:pt-5.5 sm:pb-6 motion-reduce:[transition:none] motion-reduce:**:animate-none! motion-reduce:**:[transition:none]! motion-reduce:**:after:animate-none!">
        {() => <JoinPartyForm onClose={close} joining={joining} />}
      </UiModal>
    </>
  )
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
    ? String(preview.creator.id) === String(auth.user?.id)
      ? 'Found your watch party'
      : `Found ${preview.creator.name}’s watch party`
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
    try {
      await join.mutateAsync(code)
    } catch {
      /* The inline status keeps the code available for retry. */
    } finally {
      joining.current = false
    }
  }

  const message = looking
    ? 'Looking for the watch party…'
    : error
      ? wrong
        ? `No watch party uses ${formatCode(code)}. Check it and try again.`
        : throttled
          ? 'Too many attempts. Please wait a minute and try again.'
          : join.isError
            ? 'Could not join this party. Please try again.'
            : 'Could not look up this code. Please try again.'
      : preview
        ? found
        : 'Anyone in the watch party can find it above their chat.'

  const isFound = Boolean(preview)
  // The preview has unfolded: the status line above it folds away to make room.
  const isShown = shown && isFound && !error
  // The cell being typed into picks up the result's colour while the field has focus.
  const focusTint = wrong
    ? 'group-focus-within/code:border-rose-400 group-focus-within/code:ring-rose-400/12'
    : isFound
      ? 'group-focus-within/code:border-emerald-300 group-focus-within/code:ring-emerald-300/12'
      : 'group-focus-within/code:border-neutral-500 group-focus-within/code:ring-transparent'

  return (
    <form onSubmit={submit}>
      <div className="flex items-center gap-2.5">
        <h2 className="flex-1 text-xl font-bold tracking-[-.01em]">Join a watch party</h2>
        <UiPlainButton
          type="button"
          aria-label="Close"
          className="grid size-7 place-items-center text-neutral-300 hover:text-white"
          disabled={join.isPending}
          onClick={onClose}>
          <i className="fa fa-times" aria-hidden="true" />
        </UiPlainButton>
      </div>
      <p className="mt-1.5 text-neutral-300" id={`${id}-hint`}>
        Enter the 6-digit code someone shared with you.
      </p>
      {/* One real input lies invisibly over six drawn cells. */}
      <div className="group/code relative mt-5.5">
        <input
          ref={input}
          className="absolute inset-0 z-1 size-full cursor-text text-base opacity-0 outline-none"
          aria-label="Party code"
          aria-describedby={`${id}-hint ${id}-status`}
          aria-invalid={wrong || undefined}
          inputMode="numeric"
          autoComplete="off"
          type="text"
          maxLength={32}
          value={code}
          disabled={join.isPending}
          onChange={(event) => change(event.target.value)}
          onPaste={(event) => {
            event.preventDefault()
            change(event.clipboardData.getData('text/plain'))
          }}
        />
        <div className="flex items-center gap-1.5 sm:gap-2" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <Fragment key={index}>
              {index === 3 && <span className="h-0.5 w-1.75 flex-none rounded-xs bg-neutral-600 sm:mx-0.5 sm:w-2.5" />}
              <span
                className={cn(
                  'grid h-13.5 min-w-0 flex-1 place-items-center rounded-lg border border-neutral-700 bg-neutral-800 text-2xl font-semibold tabular-nums transition-colors duration-150 sm:h-15 sm:rounded-xl',
                  wrong
                    ? 'border-rose-400 bg-rose-400/8'
                    : isFound
                      ? 'border-emerald-300/40'
                      : code[index] && 'border-neutral-500',
                  index === Math.min(code.length, 5) && [
                    'group-focus-within/code:ring-3 group-has-[input:focus-visible]/code:outline-2 group-has-[input:focus-visible]/code:outline-offset-3 group-has-[input:focus-visible]/code:outline-pink-700',
                    focusTint,
                    // An empty current cell shows a blinking text cursor.
                    !code[index] &&
                      'after:hidden after:h-6 after:w-0.5 after:animate-blink after:bg-white group-focus-within/code:after:block'
                  ]
                )}>
                {code[index] || ''}
              </span>
            </Fragment>
          ))}
        </div>
      </div>
      <div
        className={cn(
          'mt-3.5 flex min-h-5 items-start gap-2 overflow-hidden text-13 transition-[height,min-height,margin,opacity] duration-[.35s,.35s,.35s,.2s]',
          error ? 'text-rose-400' : isFound ? 'h-5 text-emerald-300' : 'text-neutral-400',
          isShown && 'mt-0 h-0 min-h-0 opacity-0'
        )}
        id={`${id}-status`}
        role={error ? 'alert' : 'status'}>
        {looking && <i className="fa fa-circle-o-notch fa-spin mt-0.75 flex-none" aria-hidden="true" />}
        {preview && !error && !looking && <i className="fa fa-check mt-0.75 flex-none" aria-hidden="true" />}
        <span>
          {message}{' '}
          {lookupError && !wrong && (
            <button
              type="button"
              className="cursor-pointer leading-[inherit] text-white underline"
              onClick={() => {
                void query.refetch()
              }}>
              Retry
            </button>
          )}
        </span>
      </div>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-420 ease-out-soft',
          isShown ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
        inert={!shown || !preview || Boolean(error)}>
        <div className="min-h-0 overflow-hidden">{preview && <PartyPreview party={preview} shown={isShown} />}</div>
      </div>
      <div className="mt-5.5 flex justify-end gap-2.5">
        <UiButton type="button" size="l" disabled={join.isPending} onClick={onClose}>
          Cancel
        </UiButton>
        <UiButton type="submit" variant="primary" size="l" disabled={!preview || looking || join.isPending || wrong}>
          {join.isPending ? (
            <>
              <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" /> Joining
            </>
          ) : preview?.is_member ? (
            'Open party'
          ) : (
            'Join party'
          )}
        </UiButton>
      </div>
    </form>
  )
}

function PartyPreview({ party, shown }: { party: AppPartyPreview; shown: boolean }) {
  const active = party.members.filter((member) => member.pivot.is_active)
  const progress = Math.min(
    100,
    Math.max(0, party.video.duration ? (party.current_time / party.video.duration) * 100 : 0)
  )
  return (
    <div
      aria-label="Watch party preview"
      className={cn(
        'mt-4 flex origin-top flex-col items-stretch gap-3.5 rounded-xl border border-neutral-800 bg-neutral-800 p-3 transition-[opacity,scale] duration-[.28s,.4s] ease-out-soft min-[361px]:flex-row min-[361px]:items-center',
        shown ? 'scale-100 opacity-100 delay-340' : 'scale-97 opacity-0'
      )}>
      <div className="relative aspect-video w-full flex-none overflow-hidden rounded-lg min-[361px]:w-25 sm:w-33">
        <AppHomeListingArtwork src={party.video.preview_image ?? undefined} eager />
        {progress > 0 && (
          <div
            className="absolute inset-x-0 bottom-0 h-0.75 bg-neutral-700"
            role="progressbar"
            aria-label="Playback progress"
            aria-valuenow={Math.round(progress)}>
            <i className="block h-full bg-pink-500" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
      <div className="min-w-0 wrap-anywhere">
        <b className="block text-base">{party.video.show.title}</b>
        <small className={SMALL}>{previewStatus(party)}</small>
        {party.video.show.title_type === 'series' && (
          <small className={SMALL}>
            {party.is_playing && active.length ? 'Watching now' : 'Paused'} · {clockTime(party.current_time)} of{' '}
            {clockTime(party.video.duration)}
          </small>
        )}
        <div className="mt-2.25 flex flex-wrap items-center gap-2 text-xs text-neutral-200">
          <div className="flex flex-none" aria-hidden="true">
            {party.members.slice(0, 3).map((member) => (
              <span
                key={member.id}
                className={cn(
                  'rounded-full border-2 border-neutral-800 not-first:-ml-2',
                  !member.pivot.is_active && 'opacity-40'
                )}>
                <UiAvatar user={member} className="size-5.5 text-[9px]" />
              </span>
            ))}
          </div>
          <span>
            {active.length === 1 && !party.current_time && !party.is_playing
              ? `${active[0].name} is waiting`
              : presentMembers(active)}
          </span>
        </div>
      </div>
    </div>
  )
}

const SMALL = 'mt-px block text-xs text-neutral-300'

function formatCode(code: string) {
  return `${code.slice(0, 3)} ${code.slice(3)}`
}
