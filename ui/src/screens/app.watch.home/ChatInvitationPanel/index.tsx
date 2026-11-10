import './style.css'
import { useEffect, useRef, useState } from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
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
import { CONTENT_FADE, PANEL_FADE } from './motion'

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

  // The list shows the search query's state, and the query runs on the debounced term: while you type,
  // whatever's on screen stays until the search goes out. With no term it shows Party and Recents.
  const [text, setText] = useState('')
  const [debounced, setDebounced] = useState('')
  const trimmed = text.trim()
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(trimmed), trimmed ? DEBOUNCE_MS : 0)
    return () => clearTimeout(timer)
  }, [trimmed])
  // An emptied field goes back to the groups at once, and a term that's already cached answers at once,
  // instead of waiting out the debounce.
  const term = !trimmed ? '' : client.getQueryData(inviteSearchKey(party.id, trimmed)) ? trimmed : debounced
  const recents = useInviteRecentsQuery(party.id)
  const search = useInviteSearchQuery(party.id, term)
  const view = term ? searchView(search) : null
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
  if (!view) {
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

  // Only entrances live down here. Leaving is one fade of the whole sheet (see the section below), so nothing
  // inside needs an exit, and the list needs no AnimatePresence of its own: a nested one either holds its
  // children on screen through the panel's exit or, with propagate, mounts a second copy as it goes.
  // Rows that show up later fade in where the skeletons were.
  const arrive = {
    initial: { opacity: 0 },
    animate: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : .22 } }
  }
  // When the panel opens, everything in it steps in on one staircase timed from the open (starting once the
  // sheet is up), so Recents land on their step however soon their data comes. After that, or once a search
  // has run, late rows just arrive.
  const openedAt = useRef(performance.now())
  const groupsCascade = useRef(true)
  if (view) groupsCascade.current = false
  const cascade = (index: number) => {
    const delay = PANEL_FADE + index * .032 - (performance.now() - openedAt.current) / 1000
    return groupsCascade.current && delay > 0 ? {
      initial: { opacity: 0, y: reducedMotion ? 0 : 12 },
      animate: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : .38, delay: reducedMotion ? 0 : delay } }
    } : arrive
  }
  // The groups, the skeleton and each answer are whole lists: the new one fades in where the last one was.
  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: reducedMotion ? 0 : .24 } }
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
    initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: reducedMotion ? 0 : PANEL_FADE } }}
    exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : PANEL_FADE, delay: reducedMotion ? 0 : CONTENT_FADE } }}
    onKeyDownCapture={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose() }
    }}>
    {/* The mirror of opening: what's on the sheet goes first, then the empty sheet fades to the chat. */}
    <motion.div className="host-invite-content" exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : CONTENT_FADE } }}>
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
            {/* A new key swaps the whole list at once. The groups skip the fade when the panel opens: their rows
                cascade in instead. */}
            {!view ? <motion.div key={viewKey} {...(groupsCascade.current ? {} : fadeIn)}>
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
                  {recentsPending && <motion.div key="skeletons" {...cascade(5)}><InviteSkeletons /></motion.div>}
                  {recentRows.map((user, index) => person(user, cascade(5 + index)))}
                </Autocomplete.Group>}
                {recentsFailed && <p className="host-invite-note" role="alert">Couldn’t load people. <button type="button" onClick={() => recents.refetch()}>Retry</button></p>}
              </motion.div>
              : <motion.div key={viewKey} className="host-invite-results" {...fadeIn}>
                {view.kind === 'skeleton' && <InviteSkeletons />}
                {view.kind === 'results' && view.users.map(user => person(user, {}))}
                {view.kind === 'empty' && <p className="host-invite-line">No one named “{term}”.</p>}
                {view.kind === 'error' && <p className="host-invite-line" role="alert">Couldn’t search for “{term}”.&nbsp;<button type="button" onClick={() => search.refetch()}>Retry</button></p>}
              </motion.div>}
          </Autocomplete.List>
          {invitations.historyError && <p className="host-invite-note" role="alert">Couldn’t load invite updates. <button type="button" onClick={invitations.refreshHistory}>Retry</button></p>}
        </div>
      </Autocomplete.Root>
      <motion.div className="host-invite-footer" {...cascade(7)}><PartyCode code={party.join_code} /></motion.div>
    </motion.div>
  </motion.section>
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
