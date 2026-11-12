import { Dialog } from '@base-ui/react/dialog'
import { BorderBeam } from 'border-beam'
import { CANDY_LINE_STROKE_ONLY } from './beamFix'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { useAuth } from '~/contexts/Auth'
import { useNow } from '~/hooks/useNow'
import { usePusher } from '~/hooks/usePusher'
import axios from '~/lib/axios'
import { cn } from '~/utils/cn'
import { easeOutSoft } from '~/utils/motion'
import getVideoDetails from '~/utils/shows/getVideoDetails'
import { clockTime, showMeta } from '~/screens/app.home/Listing/format'
import { useShowGroupsQuery } from '~/screens/app.home/queries'
import assetInvitation from '~/assets/audio/invitation.ogg'
import { useInvitationOverlay } from './Context'
import { initialState, invitationStatus, reducer } from './state'
import { sendDecline } from './sendDecline'

const COLLAPSED_HEIGHT = 40
const DECLINE_COOLDOWN = 500

// Where the toast sits. Base UI marks it with data-starting-style and data-ending-style as it enters and leaves:
// it rises in from below the screen and, unless it was put away, lifts out.
const POPUP = 'fixed z-[calc(var(--zindex-modal)+1)] w-max max-w-[calc(100vw-24px)] -translate-x-1/2 outline-none [transition:left_.7s_var(--ease-out-soft),bottom_.7s_var(--ease-out-soft),opacity_.3s,translate_.55s_cubic-bezier(.2,.9,.3,1.12)] data-ending-style:opacity-0 data-starting-style:translate-y-[170%] data-starting-style:opacity-0 motion-reduce:translate-y-0! motion-reduce:[transition:none]!'
// An answered toast (joined, declined, dismissed) leaves more slowly.
const SLOW_EXIT = 'data-ending-style:[transition:opacity_.45s,translate_.45s]'
// `overflow-clip`: focused controls must not scroll the shrinking card and hide its header.
// Button rings are inset so the pill's rounded clip doesn't cut them.
const CARD = 'relative w-max max-w-[calc(100vw-24px)] overflow-clip rounded-[20px] bg-neutral-900/97 text-white shadow-menu inset-ring inset-ring-neutral-800 backdrop-blur-md transition-[filter] duration-400 motion-reduce:transition-none [&_button]:focus-visible:-outline-offset-3 [&_button]:disabled:cursor-wait [&_button]:disabled:opacity-50'
const LINE = 'flex min-h-10 items-center gap-1.75 px-2 sm:gap-2.25 [&_b]:font-semibold [&_b]:text-white'
const FACE = 'size-6 text-11'
const ACTION = 'min-h-8.5 flex-1 rounded-lg bg-neutral-800 px-3.75 py-1.75 text-13 leading-none font-semibold text-white transition-colors duration-150 enabled:hover:bg-neutral-700 enabled:focus-visible:bg-neutral-700 motion-reduce:transition-none'
const NOTE = 'mx-3.25 mt-3 text-13'
const DIMMED = 'brightness-70 grayscale'
// The room's place in the video: a grey trough with a pink fill.
const BAR = 'absolute inset-x-0 top-2 h-1'
const TROUGH = 'overflow-hidden rounded-xs bg-neutral-700'
const FILL = 'block h-full rounded-xs bg-pink-500'

export default function InvitationModal() {
  const auth = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const overlay = useInvitationOverlay()
  const reducedMotion = useReducedMotion()
  const now = useNow({ interval: 1000 })
  const invitations = auth.data.invitations ?? []
  const latestInvitations = useRef(invitations)
  latestInvitations.current = invitations
  const [activeId, setActiveId] = useState<AppId | null>(invitations[0]?.id ?? null)
  const [state, dispatch] = useReducer(reducer, initialState)
  // Keep the visible invite when it expires; skip stale invites waiting behind it.
  const current = invitations.find(invite => invite.id === activeId)
    ?? invitations.find(invite => invitationStatus(invite, now) === 'pending')
  const invitation = state.joined ?? state.declined ?? state.dismissed ?? current
  const expanded = overlay.isExpanded && state.phase === 'respond' && state.action !== 'accept'
  const busy = state.action != null || state.phase !== 'respond'
  const status = invitation ? invitationStatus(invitation, now) : 'answered'
  const pending = status === 'pending'
  const queueLength = invitations.filter(invite => invite.id === current?.id || invitationStatus(invite, now) === 'pending').length
  const notificationRef = useRef<HTMLAudioElement>(null)
  const respondRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const requestRef = useRef(false)
  const lastDecline = useRef(0)
  const mounted = useRef(true)
  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])
  const lastNotification = useRef<AppId | null>(null)
  const [dock, setDock] = useState<{ left: number; bottom: number } | null>(null)
  const [body, setBody] = useState<HTMLDivElement | null>(null)
  const [bodyHeight, setBodyHeight] = useState(0)
  const [line, setLine] = useState<HTMLDivElement | null>(null)
  const [pillWidth, setPillWidth] = useState<number | null>(null)
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth)

  useLayoutEffect(() => {
    if (!line) {
      setPillWidth(null)
      return
    }
    const measure = () => {
      setPillWidth(Math.ceil(line.getBoundingClientRect().width))
      setViewportWidth(window.innerWidth)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(line)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [line])

  useLayoutEffect(() => {
    if (!body) return
    const measure = () => setBodyHeight(Math.ceil(body.getBoundingClientRect().height))
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(body)
    return () => observer.disconnect()
  }, [body, expanded])

  usePusher(`private-user.${auth.data.id}`, 'invitation.received', (event: { invitation: AppPartyInvitation }) => {
    auth.receiveInvitation(event.invitation)
  })
  usePusher(`private-user.${auth.data.id}`, 'invitation.cancelled', (event: { invitation: AppPartyInvitation }) => {
    auth.cancelInvitation(event.invitation)
  })
  usePusher(`private-user.${auth.data.id}`, 'invitations.resolved', (event: { invitation_ids: AppId[] }) => {
    for (const id of event.invitation_ids) auth.removeInvitation(id)
  })

  useEffect(() => {
    setActiveId(current?.id ?? null)
    if (!current && state.phase === 'respond' && !state.dismissed) {
      overlay.setExpanded(false)
      dispatch({ type: 'reset' })
    }
  }, [current?.id, state.phase, state.dismissed])

  useEffect(() => {
    if (!current || state.phase !== 'respond' || lastNotification.current === current.id) return
    lastNotification.current = current.id
    const audio = notificationRef.current
    audio.volume = 0.1
    // Browsers can refuse autoplay until the user has interacted with the page.
    audio.play()?.catch(() => {})
  }, [current?.id, state.phase])

  useLayoutEffect(() => {
    const player = overlay.player
    if (!state.joined || !player || String(player.partyId) !== String(state.joined.party_id)) {
      setDock(null)
      return
    }
    const measure = () => {
      const rect = player.element.getBoundingClientRect()
      setDock({ left: rect.left + rect.width / 2, bottom: window.innerHeight - rect.top - 60 })
    }
    measure()
    dispatch({ type: 'docked' })
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(player.element)
    window.addEventListener('resize', measure)
    window.addEventListener('scroll', measure, true)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('scroll', measure, true)
    }
  }, [state.joined, overlay.player])

  useEffect(() => {
    if (state.phase !== 'docked' && state.phase !== 'declined') return
    const timer = window.setTimeout(() => dispatch({ type: 'leave' }), state.phase === 'docked' ? 3400 : 1600)
    return () => window.clearTimeout(timer)
  }, [state.phase])

  useEffect(() => {
    if (overlay.isExpanded && current) {
      const frame = requestAnimationFrame(() => closeRef.current?.focus())
      return () => cancelAnimationFrame(frame)
    }
  }, [current?.id])

  useEffect(() => {
    if (busy) return
    if (status === 'expired') overlay.setExpanded(true)
    if (status === 'withdrawn') overlay.setExpanded(false)
  }, [current?.id, status, busy])

  function collapse() {
    if (busy) return
    overlay.setExpanded(false)
    requestAnimationFrame(() => respondRef.current?.focus())
  }

  function open() {
    overlay.setExpanded(true)
    requestAnimationFrame(() => closeRef.current?.focus())
  }

  function dismiss() {
    if (busy || !current) return
    const hasNext = latestInvitations.current.some(invite => invite.id !== current.id && invitationStatus(invite, new Date()) === 'pending')
    auth.removeInvitation(current.id)
    // Without a next invite, hold this one so the toast fades out with its content.
    dispatch(hasNext ? { type: 'advance' } : { type: 'dismissed', invitation: current })
  }

  // Declining is optimistic: the invite leaves now and the request retries in the background.
  // A failed decline is never shown; the invite expires and the host sees "didn't answer".
  function decline() {
    if (!current || busy || invitationStatus(current, new Date()) !== 'pending') return
    // The next invite slides in under the pointer; don't let a double click decline it too.
    if (Date.now() - lastDecline.current < DECLINE_COOLDOWN) return
    lastDecline.current = Date.now()
    const target = current
    const hasNext = latestInvitations.current.some(invite => invite.id !== target.id && invitationStatus(invite, new Date()) === 'pending')
    auth.declineInvitation(target)
    void sendDecline(target)
    if (hasNext) dispatch({ type: 'advance' })
    else {
      overlay.setExpanded(false)
      dispatch({ type: 'declined', invitation: { ...target, action: 'declined' } })
    }
  }

  async function accept() {
    if (!current || requestRef.current || invitationStatus(current, new Date()) !== 'pending') return
    const target = current
    requestRef.current = true
    dispatch({ type: 'request' })
    const [error, response] = await axios.post(`/api/invitations/${target.id}/accept`, {}, { app: { validation: false } })
    requestRef.current = false
    if (!mounted.current) return
    if (error) {
      dispatch({ type: 'error', message: 'Could not accept this invitation. Please try again.' })
      overlay.setExpanded(true)
      return
    }
    auth.removeInvitation(target.id)
    for (const id of response.data.declined_invitation_ids ?? []) auth.removeInvitation(id)
    for (const id of response.data.accepted_invitation_ids ?? []) auth.removeInvitation(id)
    overlay.setExpanded(false)
    dispatch({ type: 'joined', invitation: { ...target, party: response.data } })
    navigate(`/watch/${response.data.id}`)
  }

  const party = invitation?.party
  const video = party?.video
  const joining = state.action === 'accept' || state.phase === 'joining'
  const docked = Boolean(state.joined) && (state.phase === 'docked' || state.phase === 'leaving')
  const declined = Boolean(state.declined)
  const showBeam = (!expanded && pending && !busy) || docked
  // Dismissed and declined toasts are put away, so they sink. Joined stays up to sit over the player.
  const sinks = declined || Boolean(state.dismissed)
  const invalid = !pending && !busy
  const position = docked && dock ? dock : { left: '50%', bottom: location.pathname.startsWith('/watch/') ? 64 : 20 }

  return <>
    <Dialog.Root open={Boolean(invitation) && state.phase !== 'leaving' && !state.dismissed} modal={false} disablePointerDismissal
      onOpenChangeComplete={open => { if (!open) dispatch({ type: 'reset' }) }} onOpenChange={(open, details) => {
      if (open) return
      details.cancel()
      if (expanded) collapse()
    }}>
      <Dialog.Portal>
        <Dialog.Popup data-testid="invitation-popup" className={cn(POPUP, sinks ? 'data-ending-style:translate-y-2.5' : 'data-ending-style:-translate-y-2.5', (docked || sinks) && SLOW_EXIT)} initialFocus={false}
          aria-label="Watch invitation" style={position}>
          {invitation && header(false, true)}
          {pillWidth !== null && <motion.div initial={false} animate={{
            height: expanded ? COLLAPSED_HEIGHT + bodyHeight : COLLAPSED_HEIGHT,
            width: Math.min(expanded ? 400 : pillWidth, viewportWidth - 24),
            borderRadius: expanded ? 16 : 20,
          }} transition={{
            height: { duration: reducedMotion ? 0 : 0.5, ease: easeOutSoft },
            width: { duration: reducedMotion ? 0 : 0.5, ease: easeOutSoft },
            borderRadius: { duration: reducedMotion ? 0 : 0.45 },
          }} data-testid="invitation-card" data-expanded={Boolean(expanded)} data-docked={Boolean(docked)} className={cn(CARD, expanded && 'max-h-[calc(100dvh-96px)]', declined && 'brightness-85 grayscale-85')}>
            {/* The library styles its own root (position, radius) outside any layer, so those two need `!` to win. */}
            <BorderBeam data-testid="invitation-beam" className={cn('pointer-events-none absolute! inset-0 z-3 rounded-[inherit]! opacity-0 transition-opacity duration-500 motion-reduce:transition-none', showBeam && 'opacity-100')} aria-hidden="true"
              size={docked ? 'pulse-inner' : 'line'} colorVariant={docked ? 'mono' : 'candy'} theme="dark"
              duration={docked ? 4 : 3.1} strength={1} brightness={docked ? 1 : 1.3}
              saturation={1.2} glowSize={1} hueRange={docked ? 0 : 30} staticColors={docked}
              borderRadius={20} css={docked ? undefined : CANDY_LINE_STROKE_ONLY} active={showBeam && !reducedMotion} children={null} />
            {invitation && <>
              {header(expanded)}
              {/* Keep the preview mounted so the container clips it during collapse. */}
              <div ref={setBody} data-testid="invitation-body" inert={!expanded} aria-hidden={!expanded}
                className={cn('absolute top-10 left-0 max-h-[calc(100dvh-136px)] w-[min(400px,calc(100vw-24px))] [scrollbar-width:thin] overflow-x-hidden overflow-y-auto pb-2 opacity-0 transition-opacity duration-300 motion-reduce:transition-none', expanded && 'opacity-100 delay-200')}>
                <motion.div key={invitation.id} data-testid="invitation-content"
                  initial={expanded && !reducedMotion ? { opacity: 0, x: 32 } : false} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.5, ease: easeOutSoft }}>
                  {video && <>
                    <img className={cn('mx-1.75 mt-0.5 block aspect-video w-[calc(100%-14px)] rounded-lg object-cover', invalid && DIMMED)} src={video.show.preview_image || video.preview_image} alt="" />
                    <div className="px-3.25 pt-3.25">
                      <h3 className={cn('text-lg/tight font-semibold', status === 'expired' && 'text-neutral-300')}>{video.show.title}</h3>
                      <p className={cn('mt-1.25 font-label text-10 tracking-widest uppercase', status === 'expired' ? 'text-amber-300' : 'text-neutral-400')} data-testid="invitation-meta">{status === 'expired' ? `${invitation.sender.name}’s invitation expired`
                        : <>{video.show.title_type === 'series' ? `Series · ${getVideoDetails(video)}` : showMeta(video.show)}{video.show.title_type === 'movie' && <> · {durationLabel(video.duration)}</>}</>}</p>
                    </div>
                    <RoomTimeline party={party} invalid={!pending} expanded={expanded} />
                  </>}
                  {!video && <p className={NOTE}>The room preview is unavailable. You can still respond to the invitation.</p>}
                  {state.error && <p role="alert" className={`${NOTE} text-amber-300`}>{state.error}</p>}
                  <div className="flex gap-2 px-2 pt-4.5">
                    {pending ? <>
                      <UiPlainButton className={ACTION} onClick={decline} disabled={busy}>Decline</UiPlainButton>
                      <UiPlainButton className={cn(ACTION, 'bg-pink-500 enabled:hover:bg-pink-400 enabled:focus-visible:bg-pink-400')} onClick={accept} disabled={busy}>Accept</UiPlainButton>
                    </> : <UiPlainButton className={ACTION} onClick={dismiss} disabled={busy}>Dismiss</UiPlainButton>}
                  </div>
                </motion.div>
              </div>
            </>}
          </motion.div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
    <audio className="hidden" ref={notificationRef}><source src={assetInvitation} type="audio/ogg" /></audio>
  </>

  function header(isExpanded: boolean, measurement = false) {
    // The hidden copy measures the collapsed line on its own, apart from the card's animated width.
    return <div ref={measurement ? setLine : undefined} className={cn(LINE, measurement && 'pointer-events-none invisible absolute w-max')} data-testid={measurement ? undefined : 'invitation-line'}
      aria-hidden={measurement || undefined} inert={measurement || undefined}>
      {docked ? <span className="flex flex-none">{[...roomMembers(party).filter(member => member.id !== auth.data.id), auth.data].slice(0, 3).map(member => <UiAvatar key={member.id} user={member} size="sm" className={`${FACE} ring-2 ring-neutral-900 not-first:-ml-2`} />)}</span>
        : <UiAvatar user={invitation.sender} size="sm" className={`${FACE} flex-none`} />}
      <p className="min-w-0 flex-1 truncate text-xs text-neutral-400 sm:text-13" aria-live={measurement ? undefined : 'polite'} aria-atomic="true">
        {docked ? roomMembers(party).length ? <>You’re in with <b>{roomNames(party)}</b></> : <>You’re in the room</>
          : declined ? <>Declined <b>{invitation.sender.name}’s</b> invitation{video && <> to watch <b>{video.show.title}</b></>}</>
          : joining ? <>Joining <b>{invitation.sender.name}</b>{video && <> to watch <b>{video.show.title}</b></>}</>
          : status === 'expired' ? <><b>{invitation.sender.name}’s</b> invitation expired</>
          : status === 'withdrawn' ? <><b>{invitation.sender.name}</b> cancelled the invitation</>
          : <><b>{invitation.sender.name}</b> invited you to watch{!isExpanded && video && <> <b>{video.show.title}</b></>}</>}
      </p>
      {isExpanded && queueLength + state.answered > 1 && <span className="flex-none text-xs leading-none text-neutral-400 tabular-nums" data-testid="invitation-count">{state.answered + 1} of {state.answered + queueLength}</span>}
      {joining && <span className="mr-1.25 size-3.5 flex-none animate-spin rounded-full border-2 border-white/20 border-t-emerald-300 motion-reduce:animate-none" aria-label={measurement ? undefined : 'Joining room'} />}
      {!isExpanded && !busy && <UiPlainButton ref={measurement ? undefined : respondRef} className={cn('min-h-6 flex-none rounded-full px-3 text-xs leading-none font-semibold text-white', pending ? 'bg-pink-500' : 'bg-neutral-800')} onClick={pending ? open : dismiss}>{pending ? 'Respond' : 'Dismiss'}</UiPlainButton>}
      {isExpanded && <UiPlainButton ref={closeRef} className="h-8 w-7 flex-none text-xl leading-none text-neutral-400" aria-label="Collapse invitation" onClick={collapse} disabled={busy}>×</UiPlainButton>}
    </div>
  }
}

function roomMembers(party: AppParty) {
  return party?.members?.filter(member => Number(member.pivot?.is_active) === 1) ?? []
}

function roomNames(party: AppParty) {
  const names = roomMembers(party).map(member => member.name)
  if (!names.length) return 'the room'
  if (names.length > 2) return `${names[0]} and ${names.length - 1} others`
  return names.join(' and ')
}

function durationLabel(seconds: number) {
  const minutes = Math.max(0, Math.floor(Number(seconds || 0) / 60))
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`
}

function RoomTimeline({ party, invalid, expanded }: { party: AppParty; invalid: boolean; expanded: boolean }) {
  const video = party.video
  const groups = useShowGroupsQuery(video.show, expanded)
  const season = groups.data?.find(group => String(group.id) === String(video.show_group_id))
  const episodes = season?.videos ?? []
  const episodeIndex = episodes.findIndex(episode => String(episode.id) === String(video.id))
  const progress = Math.min(1, Math.max(0, Number(party.current_time) / Number(video.duration || 1)))
  const segmented = episodeIndex >= 0 && episodes.length > 0
  const position = segmented ? (episodeIndex + progress) / episodes.length : progress
  const members = roomMembers(party)
  return <div className={cn('px-3.25 pt-4.5', invalid && DIMMED)}>
    <div className="mb-2.25 flex justify-between gap-1.5 text-11 text-neutral-400 sm:gap-2.5 sm:text-xs [&_b]:font-semibold [&_b]:text-white [&_b]:tabular-nums">
      <span className="min-w-0">{members.length ? <><b>{roomNames(party)}</b> {members.length === 1 ? 'is' : 'are'}</> : 'The room is'} at <b>{segmented && `E${episodeIndex + 1}, `}{clockTime(party.current_time)}</b></span>
      <span className="flex-none">{segmented ? `${season.title} · ${episodes.length} episodes` : `${durationLabel(Math.max(0, video.duration - party.current_time))} left`}</span>
    </div>
    <div className="relative mx-1.75 h-5" role="img" aria-label={`Room snapshot: ${clockTime(party.current_time)} of ${clockTime(video.duration)}`}>
      {segmented ? <div className={`${BAR} flex gap-0.75`} data-testid="invitation-segments">{episodes.map((episode, index) => <span className={`${TROUGH} flex-1`} key={episode.id}><i className={FILL} style={{ width: `${index === episodeIndex ? progress * 100 : 0}%` }} /></span>)}</div>
        : <div className={`${BAR} ${TROUGH}`}><i className={FILL} style={{ width: `${progress * 100}%` }} /></div>}
      {members.length > 0 && <div className="absolute top-0 flex -translate-x-1/2" style={{ left: `${position * 100}%` }}>{members.slice(0, 3).map(member => <UiAvatar key={member.id} user={member} size="sm" className="size-5 text-10 ring-2 ring-neutral-900 not-first:-ml-1.5" />)}</div>}
    </div>
    <p className="mt-1.5 text-10 text-neutral-400">Room snapshot</p>
  </div>
}
