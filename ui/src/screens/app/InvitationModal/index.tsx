import './style.css'
import { Dialog } from '@base-ui/react/dialog'
import { BorderBeam } from 'border-beam'
import { CANDY_LINE_STROKE_ONLY } from './beamFix'
import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import cx from 'classnames'
import UiAvatar from '~/components/UiAvatar'
import UiPlainButton from '~/components/UiPlainButton'
import { useAuth } from '~/contexts/Auth'
import { useNow } from '~/hooks/useNow'
import { usePusher } from '~/hooks/usePusher'
import axios from '~/lib/axios'
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
  const position = docked && dock ? dock : { left: '50%', bottom: location.pathname.startsWith('/watch/') ? 64 : 20 }

  return <>
    <Dialog.Root open={Boolean(invitation) && state.phase !== 'leaving' && !state.dismissed} modal={false} disablePointerDismissal
      onOpenChangeComplete={open => { if (!open) dispatch({ type: 'reset' }) }} onOpenChange={(open, details) => {
      if (open) return
      details.cancel()
      if (expanded) collapse()
    }}>
      <Dialog.Portal>
        <Dialog.Popup data-testid="invitation-popup" className={cx('incoming-invitation-position', { 'is-confirmation': docked || declined, 'is-exit-down': declined || Boolean(state.dismissed) })} initialFocus={false}
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
          }} data-testid="invitation-card" data-expanded={Boolean(expanded)} data-docked={Boolean(docked)} className={cx('incoming-invitation', { 'is-expanded': expanded, 'is-invalid': !pending && !busy, 'is-expired': status === 'expired', 'is-declined': declined, 'is-docked': docked })}>
            <BorderBeam data-testid="invitation-beam" className={cx('invitation-beam', { 'is-on': showBeam })} aria-hidden="true"
              size={docked ? 'pulse-inner' : 'line'} colorVariant={docked ? 'mono' : 'candy'} theme="dark"
              duration={docked ? 4 : 3.1} strength={1} brightness={docked ? 1 : 1.3}
              saturation={1.2} glowSize={1} hueRange={docked ? 0 : 30} staticColors={docked}
              borderRadius={20} css={docked ? undefined : CANDY_LINE_STROKE_ONLY} active={showBeam && !reducedMotion} children={null} />
            {invitation && <>
              {header(expanded)}
              {/* Keep the preview mounted so the container clips it during collapse. */}
              <div ref={setBody} className="invitation-body" data-testid="invitation-body" inert={!expanded} aria-hidden={!expanded}>
                <motion.div key={invitation.id} className="invitation-content" data-testid="invitation-content"
                  initial={expanded && !reducedMotion ? { opacity: 0, x: 32 } : false} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.5, ease: easeOutSoft }}>
                  {video && <>
                    <img className="invitation-artwork" src={video.show.preview_image || video.preview_image} alt="" />
                    <div className="invitation-info">
                      <h3>{video.show.title}</h3>
                      <p className="ui-subheading" data-testid="invitation-meta">{status === 'expired' ? `${invitation.sender.name}’s invitation expired`
                        : <>{video.show.title_type === 'series' ? `Series · ${getVideoDetails(video)}` : showMeta(video.show)}{video.show.title_type === 'movie' && <> · {durationLabel(video.duration)}</>}</>}</p>
                    </div>
                    <RoomTimeline party={party} invalid={!pending} expanded={expanded} />
                  </>}
                  {!video && <p className="invitation-unavailable">The room preview is unavailable. You can still respond to the invitation.</p>}
                  {state.error && <p role="alert" className="invitation-error">{state.error}</p>}
                  <div className="invitation-actions">
                    {pending ? <>
                      <UiPlainButton onClick={decline} disabled={busy}>Decline</UiPlainButton>
                      <UiPlainButton className="is-primary" onClick={accept} disabled={busy}>Accept</UiPlainButton>
                    </> : <UiPlainButton onClick={dismiss} disabled={busy}>Dismiss</UiPlainButton>}
                  </div>
                </motion.div>
              </div>
            </>}
          </motion.div>}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
    <audio className="invitation-notification-audio" ref={notificationRef}><source src={assetInvitation} type="audio/ogg" /></audio>
  </>

  function header(isExpanded: boolean, measurement = false) {
    return <div ref={measurement ? setLine : undefined} className={cx('invitation-line', { 'invitation-width-probe': measurement })} data-testid={measurement ? undefined : 'invitation-line'}
      aria-hidden={measurement || undefined} inert={measurement || undefined}>
      {docked ? <span className="invitation-joined-avatars">{[...roomMembers(party).filter(member => member.id !== auth.data.id), auth.data].slice(0, 3).map(member => <UiAvatar key={member.id} user={member} size="sm" />)}</span>
        : <UiAvatar user={invitation.sender} size="sm" />}
      <p aria-live={measurement ? undefined : 'polite'} aria-atomic="true">
        {docked ? roomMembers(party).length ? <>You’re in with <b>{roomNames(party)}</b></> : <>You’re in the room</>
          : declined ? <>Declined <b>{invitation.sender.name}’s</b> invitation{video && <> to watch <b>{video.show.title}</b></>}</>
          : joining ? <>Joining <b>{invitation.sender.name}</b>{video && <> to watch <b>{video.show.title}</b></>}</>
          : status === 'expired' ? <><b>{invitation.sender.name}’s</b> invitation expired</>
          : status === 'withdrawn' ? <><b>{invitation.sender.name}</b> cancelled the invitation</>
          : <><b>{invitation.sender.name}</b> invited you to watch{!isExpanded && video && <> <b>{video.show.title}</b></>}</>}
      </p>
      {isExpanded && queueLength + state.answered > 1 && <span className="invitation-count" data-testid="invitation-count">{state.answered + 1} of {state.answered + queueLength}</span>}
      {joining && <span className="invitation-spinner" aria-label={measurement ? undefined : 'Joining room'} />}
      {!isExpanded && !busy && <UiPlainButton ref={measurement ? undefined : respondRef} className={cx('invitation-respond', { 'is-dismiss': !pending })} onClick={pending ? open : dismiss}>{pending ? 'Respond' : 'Dismiss'}</UiPlainButton>}
      {isExpanded && <UiPlainButton ref={closeRef} className="invitation-collapse" aria-label="Collapse invitation" onClick={collapse} disabled={busy}>×</UiPlainButton>}
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
  return <div className={cx('invitation-timeline', { 'is-invalid': invalid })}>
    <div className="invitation-timeline-label">
      <span>{members.length ? <><b>{roomNames(party)}</b> {members.length === 1 ? 'is' : 'are'}</> : 'The room is'} at <b>{segmented && `E${episodeIndex + 1}, `}{clockTime(party.current_time)}</b></span>
      <span>{segmented ? `${season.title} · ${episodes.length} episodes` : `${durationLabel(Math.max(0, video.duration - party.current_time))} left`}</span>
    </div>
    <div className="invitation-timeline-track" role="img" aria-label={`Room snapshot: ${clockTime(party.current_time)} of ${clockTime(video.duration)}`}>
      {segmented ? <div className="invitation-segments" data-testid="invitation-segments">{episodes.map((episode, index) => <span key={episode.id}><i style={{ width: `${index === episodeIndex ? progress * 100 : 0}%` }} /></span>)}</div>
        : <div className="invitation-progress"><i style={{ width: `${progress * 100}%` }} /></div>}
      {members.length > 0 && <div className="invitation-playhead" style={{ left: `${position * 100}%` }}>{members.slice(0, 3).map(member => <UiAvatar key={member.id} user={member} size="sm" />)}</div>}
    </div>
    <p className="invitation-snapshot">Room snapshot</p>
  </div>
}
