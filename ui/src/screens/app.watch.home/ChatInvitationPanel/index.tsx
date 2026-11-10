import './style.css'
import { useEffect, useRef, useState } from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useAuth } from '~/contexts/Auth'
import { usePartyContext } from '~/screens/app.watch/Context'
import useSteadyLoading from '~/hooks/useSteadyLoading'
import UiPresenceAvatar from '~/components/UiPresenceAvatar'
import UiPlainButton from '~/components/UiPlainButton'
import UiSkeleton from '~/components/UiSkeleton'
import PartyCode from '../PartyCode'
import { HostInvitations, minutesLeft } from './useHostInvitations'
import { InviteRow, inviteRow } from './inviteRow'
import RollingText from './RollingText'

type Placement = { group: 'party' | 'recents'; member: boolean }

const ACTION_LABELS = { invite: 'Invite', undo: 'Undo', retry: 'Retry' }
const SHAKE = [0, -4, 4, -2, 0]

export default function ChatInvitationPanel({ invitations, onClose }: {
  invitations: HostInvitations
  onClose: () => void
}) {
  const { party } = usePartyContext()
  const auth = useAuth()
  const present = useIsPresent()
  const reducedMotion = useReducedMotion()
  // The hook still holds the last open's search on the first render, so wait for this open's own search
  // before showing results or an empty note.
  const [searched, setSearched] = useState(invitations.loading)
  if (invitations.loading && !searched) setSearched(true)
  const loading = useSteadyLoading(invitations.loading || !searched)
  const input = useRef<HTMLInputElement>(null)
  // Where each person sits while the panel is open, fixed the first time they show up so rows never move
  // under the pointer; the panel remounts on every open, so people regroup next time.
  const placements = useRef(new Map<string, Placement>())
  useEffect(() => { input.current?.focus({ preventScroll: true }) }, [])

  const query = invitations.query.trim().toLowerCase()
  const matches = (user: AppUser) => !query || user.name.toLowerCase().includes(query)
  const memberIds = new Set(party.members.map(member => String(member.id)))
  const pendingIds = new Set(invitations.pending.map(invitation => String(invitation.recipient.id)))
  const people = new Map<string, AppUser>(Array.from(invitations.history.values(), invitation => [String(invitation.recipient.id), invitation.recipient]))
  invitations.users.forEach(user => people.set(String(user.id), user))
  party.members.forEach(member => people.set(String(member.id), member))
  const resultIds = new Set(invitations.users.map(user => String(user.id)))
  const place = (id: string, group: Placement['group']) => {
    if (!placements.current.has(id)) placements.current.set(id, { group, member: memberIds.has(id) })
    return placements.current.get(id)
  }
  party.members.forEach(member => place(String(member.id), 'party'))
  invitations.pending.forEach(invitation => place(String(invitation.recipient.id), 'party'))
  people.forEach((_, id) => place(id, 'recents'))

  // Party keeps the order people first showed up in; Recents keeps the search's order.
  const partyRows = Array.from(placements.current, ([id, placement]) => ({ user: people.get(id), placement }))
    .filter(({ user, placement }) => user && placement.group === 'party' && matches(user))
  const partyInvites = partyRows.filter(({ placement }) => !placement.member).map(({ user }) => user)
  const recents = Array.from(people.values()).filter(user => placements.current.get(String(user.id)).group === 'recents' &&
    (matches(user) || resultIds.has(String(user.id))))
  const shownRecents = loading.pending ? [] : recents
  const items = [...partyInvites, ...shownRecents]

  const cascade = (index: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : .38, delay: reducedMotion ? 0 : .11 + index * .032 } },
    exit: { opacity: 0, y: reducedMotion ? 0 : 12, transition: { duration: reducedMotion ? 0 : .16 } }
  })
  // Results fade in together where the skeletons were.
  const arrive = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: reducedMotion ? 0 : .22 } },
    exit: { opacity: 0, transition: { duration: reducedMotion ? 0 : .16 } }
  }

  // Notes settle in after the rows around them, never ahead of the panel.
  const note = {
    initial: { opacity: 0, y: reducedMotion ? 0 : 6 },
    animate: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : .32, delay: reducedMotion ? 0 : .24, ease: [.2, .8, .2, 1] as const } },
    exit: { opacity: 0, transition: { duration: reducedMotion ? 0 : .12 } }
  }

  function person(user: AppUser, motionProps: object) {
    const id = String(user.id)
    const invitation = invitations.history.get(id)
    const waiting = pendingIds.has(id)
    const row = inviteRow({
      name: user.name, online: invitations.withPresence(user).is_online, member: memberIds.has(id), waiting,
      busy: Boolean(invitations.busy[id]), error: invitations.errors[id] || '', answer: invitations.answer(id),
      minutes: waiting ? minutesLeft(invitation, invitations.now) : ''
    })
    return <motion.div key={user.id} {...motionProps}>
      <Autocomplete.Item value={user} disabled={row.busy || !row.action} nativeButton
        render={<button type="button" />} className="host-invite-person user-item" aria-label={row.label} aria-busy={row.busy || undefined}
        onClick={() => row.action === 'undo' ? invitations.cancel(invitation) : row.action && invitations.invite(user)}>
        <UiPresenceAvatar user={invitations.withPresence(user)} />
        <span className="host-invite-details"><b>{user.name}</b><RollingText text={row.status} className="host-invite-status" lineClassName={row.tone ? `is-${row.tone}` : undefined} /></span>
        <InviteAction row={row} />
      </Autocomplete.Item>
    </motion.div>
  }

  const isEmpty = !loading.pending && !recents.length && !partyRows.length
  return <motion.section className="host-invite-panel" aria-label="Invite" inert={!present}
    initial="hidden" animate="visible" exit="hidden"
    variants={{ hidden: {}, visible: {} }}
    onKeyDownCapture={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose() }
    }}>
    <motion.div className="host-invite-heading" {...cascade(0)}>
      <h3>Invite</h3>
      <UiPlainButton type="button" onClick={onClose} aria-label="Close invite"><i className="fa fa-close" aria-hidden="true" /></UiPlainButton>
    </motion.div>
    <Autocomplete.Root inline open items={items} filter={null} value={invitations.query}
      onValueChange={(value, details) => { if (details.reason !== 'item-press') invitations.setQuery(value) }}
      itemToStringValue={user => user.name}>
      <motion.label className="host-invite-search" {...cascade(1)}>
        <i className="fa fa-search" aria-hidden="true" />
        <Autocomplete.Input ref={input} placeholder="Search for your friends by username" aria-label="Search for your friends by username" maxLength={100} autoComplete="off" spellCheck={false} />
      </motion.label>
      <div className="host-invite-list" aria-busy={loading.pending}>
        <Autocomplete.List>
          {partyRows.length > 0 && <Autocomplete.Group>
            <motion.div {...cascade(2)}><Autocomplete.GroupLabel className="host-invite-label">Party</Autocomplete.GroupLabel></motion.div>
            {partyRows.map(({ user, placement }, index) => placement.member
              ? <motion.div className="host-invite-person user-item" key={user.id} {...cascade(3 + index)}>
                <UiPresenceAvatar user={invitations.withPresence(user)} />
                <span className="host-invite-details"><b>{user.name}{String(user.id) === String(auth.data.id) && <em>(You)</em>}</b>
                  <small>{String(user.id) === String(party.creator?.id) ? 'Host 👑' : 'In the room'}</small></span>
              </motion.div>
              : person(user, cascade(3 + index)))}
          </Autocomplete.Group>}
          {(loading.placeholder || shownRecents.length > 0) && <Autocomplete.Group className="host-invite-group">
            <motion.div {...cascade(4)}><Autocomplete.GroupLabel className="host-invite-label">{query ? 'People' : 'Recents'}</Autocomplete.GroupLabel></motion.div>
            {/* Only the skeletons sit in presence: popLayout lifts them out of flow as they fade, so the rows
                take their place; rows that left and came back inside it would render twice. */}
            <AnimatePresence mode="popLayout" propagate>
              {loading.placeholder && <motion.div key="skeletons" className="host-invite-skeletons" {...arrive} exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : .18 } }}>
                  {[0, 1, 2, 3].map(n => <div className="host-invite-person" key={n}>
                    <UiSkeleton width={32} height={32} radius="50%" />
                    <span className="host-invite-details"><UiSkeleton width="44%" height={10} radius={5} /><UiSkeleton width="26%" height={8} radius={4} /></span>
                  </div>)}
                </motion.div>}
            </AnimatePresence>
            {shownRecents.map(user => person(user, arrive))}
          </Autocomplete.Group>}
        </Autocomplete.List>
        <AnimatePresence initial={false}>
          {isEmpty && query && !invitations.searchError && <motion.p key="none" className="host-invite-note" {...note}>No one named “{invitations.query}”.</motion.p>}
        </AnimatePresence>
        {!loading.pending && invitations.searchError && <p className="host-invite-note" role="alert">Couldn’t load people. <button type="button" onClick={invitations.retrySearch}>Retry</button></p>}
        {invitations.historyError && <p className="host-invite-note" role="alert">Couldn’t load invite updates. <button type="button" onClick={invitations.refreshHistory}>Retry</button></p>}
      </div>
    </Autocomplete.Root>
    <motion.div className="host-invite-footer" {...cascade(7)}><PartyCode code={party.join_code} /></motion.div>
  </motion.section>
}

/**
 * A fixed-width UiButton look (default, small, round) inside the row's own button, so it can't be a nested <button>.
 * Words blur across, busy shows three dots, and once there's nothing left to do it sinks away.
 */
function InviteAction({ row }: { row: InviteRow }) {
  const reducedMotion = useReducedMotion()
  const blur = reducedMotion ? 'blur(0px)' : 'blur(3px)'
  return <AnimatePresence initial={false}>
    {row.action && <motion.span key="action" className="ui-button is-s is-round host-invite-action" aria-hidden="true"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0, x: row.action === 'retry' && !reducedMotion ? SHAKE : 0, transition: { x: { duration: .4, delay: .12 } } }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 10, transition: { opacity: { duration: .32, ease: 'easeIn' }, y: { duration: .38, ease: [.4, 0, .6, 1] } } }}>
      <AnimatePresence initial={false}>
        <motion.span key={row.busy ? 'busy' : row.action} className="host-invite-action-label"
          initial={{ opacity: 0, filter: blur }}
          animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: .28, delay: .07, ease: 'easeOut' } }}
          exit={{ opacity: 0, filter: blur, transition: { duration: .17, ease: 'easeIn' } }}>
          {row.busy ? <span className="host-invite-dots"><i /><i /><i /></span> : ACTION_LABELS[row.action]}
        </motion.span>
      </AnimatePresence>
    </motion.span>}
  </AnimatePresence>
}
