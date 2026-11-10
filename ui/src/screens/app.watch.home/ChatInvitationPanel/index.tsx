import './style.css'
import { useEffect, useRef, useState } from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { AnimatePresence, HTMLMotionProps, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '~/contexts/Auth'
import { usePartyContext } from '~/screens/app.watch/Context'
import UiPresenceAvatar from '~/components/UiPresenceAvatar'
import UiPlainButton from '~/components/UiPlainButton'
import UiSkeleton from '~/components/UiSkeleton'
import PartyCode from '../PartyCode'
import { HostInvitations, minutesLeft } from './useHostInvitations'
import { InviteRow, inviteRow } from './inviteRow'
import { inviteSearchKey, useInviteRecentsQuery, useInviteSearchQuery } from './queries'
import { searchView } from './searchView'
import RollingText from './RollingText'

type Placement = { group: 'party' | 'recents'; member: boolean }

const ACTION_LABELS = { invite: 'Invite', undo: 'Undo', retry: 'Retry' }
const SHAKE = [0, -4, 4, -2, 0]
/** Typing has to pause this long before a search goes out. */
const DEBOUNCE_MS = 250

export default function ChatInvitationPanel({ invitations, onClose }: {
  invitations: HostInvitations
  onClose: () => void
}) {
  const { party } = usePartyContext()
  const auth = useAuth()
  const present = useIsPresent()
  const reducedMotion = useReducedMotion()
  const client = useQueryClient()
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLDivElement>(null)
  useEffect(() => { input.current?.focus({ preventScroll: true }) }, [])

  // With text in the field the panel shows only that search's answer; empty, it shows Party and Recents.
  const [text, setText] = useState('')
  const [debounced, setDebounced] = useState('')
  const trimmed = text.trim()
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(trimmed), trimmed ? DEBOUNCE_MS : 0)
    return () => clearTimeout(timer)
  }, [trimmed])
  // A term that's already cached answers at once instead of waiting out the debounce.
  const term = !trimmed ? '' : client.getQueryData(inviteSearchKey(party.id, trimmed)) ? trimmed : debounced
  const recents = useInviteRecentsQuery(party.id)
  const search = useInviteSearchQuery(party.id, term)
  const view = trimmed ? searchView(trimmed, term, search) : null
  const viewKey = !view ? 'groups' : view.kind === 'skeleton' ? 'search' : `search-${view.kind}-${term}`
  useEffect(() => { list.current?.scrollTo({ top: 0 }) }, [viewKey])

  const memberIds = new Set(party.members.map(member => String(member.id)))
  const pendingIds = new Set(invitations.pending.map(invitation => String(invitation.recipient.id)))
  const hostId = String(party.creator?.id)

  // Where each person sits in Party and Recents while the panel is open, fixed the first time they show up
  // there so rows never move under the pointer; the panel remounts on every open, so people regroup next
  // time. Search has its own list and never places anyone.
  const placements = useRef(new Map<string, Placement>())
  const people = new Map<string, AppUser>(Array.from(invitations.history.values(), invitation => [String(invitation.recipient.id), invitation.recipient]))
  recents.data?.forEach(user => people.set(String(user.id), user))
  party.members.forEach(member => people.set(String(member.id), member))
  if (!trimmed) {
    const place = (id: string, group: Placement['group']) => {
      if (!placements.current.has(id)) placements.current.set(id, { group, member: memberIds.has(id) })
    }
    party.members.forEach(member => place(String(member.id), 'party'))
    invitations.pending.forEach(invitation => place(String(invitation.recipient.id), 'party'))
    people.forEach((_, id) => place(id, 'recents'))
  }
  // Party keeps the order people first showed up in; Recents keeps the server's order.
  const partyRows = Array.from(placements.current, ([id, placement]) => ({ user: people.get(id), placement }))
    .filter(({ user, placement }) => user && placement.group === 'party')
  const recentsFailed = !recents.data && recents.isError && !recents.isFetching
  const recentsPending = !recents.data && !recentsFailed
  const recentRows = recentsPending ? [] : Array.from(people.values()).filter(user => placements.current.get(String(user.id))?.group === 'recents')
  const items = view
    ? view.kind === 'results' ? view.users : []
    : [...partyRows.filter(({ placement }) => !placement.member).map(({ user }) => user), ...recentRows]

  // Party rows cascade in when the panel opens; coming back from a search, the groups fade in as one.
  const groupsCascade = useRef(true)
  if (trimmed) groupsCascade.current = false
  const cascade = (index: number) => ({
    initial: groupsCascade.current ? { opacity: 0, y: reducedMotion ? 0 : 12 } : false as const,
    animate: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : .38, delay: reducedMotion ? 0 : .11 + index * .032 } },
    exit: { opacity: 0, y: reducedMotion ? 0 : 12, transition: { duration: reducedMotion ? 0 : .16 } }
  })
  // Rows fade in together where the skeletons were.
  const arrive = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: reducedMotion ? 0 : .22 } },
    exit: { opacity: 0, transition: { duration: reducedMotion ? 0 : .16 } }
  }
  // Groups, the skeleton and each answer swap as whole lists.
  const swap = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: reducedMotion ? 0 : .24, delay: reducedMotion ? 0 : .06 } },
    exit: { opacity: 0, transition: { duration: reducedMotion ? 0 : .16 } }
  }

  function person(user: AppUser, motionProps: object) {
    const id = String(user.id)
    const invitation = invitations.history.get(id)
    const waiting = pendingIds.has(id)
    const row = inviteRow({
      name: user.name, online: invitations.withPresence(user).is_online, member: memberIds.has(id), host: id === hostId, waiting,
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
    <Autocomplete.Root inline open items={items} filter={null} value={text}
      onValueChange={(value, details) => { if (details.reason !== 'item-press') setText(value.slice(0, 100)) }}
      itemToStringValue={user => user.name}>
      <motion.label className="host-invite-search" {...cascade(1)}>
        <i className="fa fa-search" aria-hidden="true" />
        <Autocomplete.Input ref={input} placeholder="Search for your friends by username" aria-label="Search for your friends by username" maxLength={100} autoComplete="off" spellCheck={false} />
      </motion.label>
      <div className="host-invite-list" ref={list} aria-busy={view?.kind === 'skeleton' || (!view && recentsPending)}>
        <Autocomplete.List>
          {/* popLayout lifts the outgoing list out of flow, so the next one fades in where it was. */}
          <AnimatePresence mode="popLayout" initial={false}>
            {!view && <InviteView key={viewKey} {...swap}>
              {partyRows.length > 0 && <Autocomplete.Group>
                <motion.div {...cascade(2)}><Autocomplete.GroupLabel className="host-invite-label">Party</Autocomplete.GroupLabel></motion.div>
                {partyRows.map(({ user, placement }, index) => placement.member
                  ? <motion.div className="host-invite-person user-item" key={user.id} {...cascade(3 + index)}>
                    <UiPresenceAvatar user={invitations.withPresence(user)} />
                    <span className="host-invite-details"><b>{user.name}{String(user.id) === String(auth.data.id) && <em>(You)</em>}</b>
                      <small>{String(user.id) === hostId ? 'Host 👑' : 'In the room'}</small></span>
                  </motion.div>
                  : person(user, cascade(3 + index)))}
              </Autocomplete.Group>}
              {(recentsPending || recentRows.length > 0) && <Autocomplete.Group className="host-invite-group">
                <motion.div {...cascade(4)}><Autocomplete.GroupLabel className="host-invite-label">Recents</Autocomplete.GroupLabel></motion.div>
                {/* Only the skeletons sit in presence: popLayout lifts them out of flow as they fade, so the rows
                    take their place; rows that left and came back inside it would render twice. */}
                <AnimatePresence mode="popLayout" propagate>
                  {recentsPending && <motion.div key="skeletons" {...arrive} exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : .18 } }}>
                    <InviteSkeletons />
                  </motion.div>}
                </AnimatePresence>
                {recentRows.map(user => person(user, arrive))}
              </Autocomplete.Group>}
              {recentsFailed && <p className="host-invite-note" role="alert">Couldn’t load people. <button type="button" onClick={() => recents.refetch()}>Retry</button></p>}
            </InviteView>}
            {view && <InviteView key={viewKey} className="host-invite-results" {...swap}>
              {view.kind === 'skeleton' && <InviteSkeletons />}
              {view.kind === 'results' && view.users.map(user => person(user, {}))}
              {view.kind === 'empty' && <p className="host-invite-line">No one named “{term}”.</p>}
              {view.kind === 'error' && <p className="host-invite-line" role="alert">Couldn’t search for “{term}”.&nbsp;<button type="button" onClick={() => search.refetch()}>Retry</button></p>}
            </InviteView>}
          </AnimatePresence>
        </Autocomplete.List>
        {invitations.historyError && <p className="host-invite-note" role="alert">Couldn’t load invite updates. <button type="button" onClick={invitations.refreshHistory}>Retry</button></p>}
      </div>
    </Autocomplete.Root>
    <motion.div className="host-invite-footer" {...cascade(7)}><PartyCode code={party.join_code} /></motion.div>
  </motion.section>
}

/** One whole list (the groups, the skeleton or an answer); the one on its way out can't be reached. */
function InviteView(props: HTMLMotionProps<'div'>) {
  const present = useIsPresent()
  return <motion.div inert={!present} {...props} />
}

function InviteSkeletons() {
  return <div className="host-invite-skeletons" aria-hidden="true">
    {[0, 1, 2, 3].map(n => <div className="host-invite-person" key={n}>
      <UiSkeleton width={32} height={32} radius="50%" />
      <span className="host-invite-details"><UiSkeleton width="44%" height={10} radius={5} /><UiSkeleton width="26%" height={8} radius={4} /></span>
    </div>)}
  </div>
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
