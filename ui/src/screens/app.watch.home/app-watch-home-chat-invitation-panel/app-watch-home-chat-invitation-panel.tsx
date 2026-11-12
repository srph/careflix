import { useEffect, useRef, useState } from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '~/contexts/auth/auth'
import { usePartyContext } from '~/screens/app.watch/Context'
import { UiPresenceAvatar } from '~/components/ui-presence-avatar/ui-presence-avatar'
import { buttonClass } from '~/components/ui-button/ui-button'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { UiSkeleton } from '~/components/ui-skeleton/ui-skeleton'
import { cn } from '~/utils/cn'
import { AppWatchHomePartyCode } from '../app-watch-home-party-code'
import { HostInvitations, minutesLeft } from './use-host-invitations'
import { InviteRow, inviteRow } from './app-watch-home-chat-invitation-panel-invite-row'
import { inviteSearchKey, useInviteRecentsQuery, useInviteSearchQuery } from './app-watch-home-chat-invitation-panel-queries'
import { searchView } from './app-watch-home-chat-invitation-panel-search-view'
import { AppWatchHomeChatInvitationPanelRollingText } from './app-watch-home-chat-invitation-panel-rolling-text'
import { CONTENT_FADE, PANEL_FADE } from './app-watch-home-chat-invitation-panel-motion'

type Placement = { group: 'party' | 'recents'; member: boolean }

const ACTION_LABELS = { invite: 'Invite', undo: 'Undo', retry: 'Retry' }
const SHAKE = [0, -4, 4, -2, 0]
const TONES = { pink: 'text-pink-300', error: 'text-rose-300', success: 'text-emerald-300' }

// A person in the list. As a button it highlights on hover and while the keyboard is on it.
const PERSON = 'flex min-h-15 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left'
const PERSON_BUTTON = `group cursor-pointer not-disabled:hover:bg-neutral-800 disabled:cursor-default aria-busy:cursor-wait! data-highlighted:bg-neutral-800 ${PERSON}`
const DETAILS = 'flex min-w-0 flex-1 flex-col'
const NAME = 'truncate text-sm/4 font-semibold'
const SUBTEXT = 'text-xs text-neutral-400 tabular-nums'
const LABEL = 'block px-3.5 pt-4 pb-2 font-label text-11 leading-none font-semibold tracking-label text-neutral-400 uppercase'
// No one, or a failed search: one line in a row's slot, where the skeleton was.
const LINE = 'flex min-h-15 items-center px-3.5 py-2.5 text-13 text-neutral-400'
const NOTE = 'px-3.5 py-3 text-13 text-neutral-400'
const TEXT_BUTTON = 'cursor-pointer text-white underline'

/** A face with a small green dot while they're online, and no dot when they're not. */
function Face({ user }: { user: AppUser }) {
  return <UiPresenceAvatar user={user} className="flex-none opacity-100" statusClassName={cn('-right-px -bottom-px size-2.75', !user.is_online && 'hidden')} />
}

/** Typing has to pause this long before a search goes out. */
const DEBOUNCE_MS = 250

export function AppWatchHomeChatInvitationPanel({ invitations, onClose }: {
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
        render={<button type="button" />} className={PERSON_BUTTON} data-testid="invite-person" aria-label={row.label} aria-busy={row.busy || undefined}
        onClick={() => row.action === 'undo' ? invitations.cancel(invitation) : row.action && invitations.invite(user)}>
        <Face user={invitations.withPresence(user)} />
        <span className={`${DETAILS} gap-0.5`}><b className={NAME}>{user.name}</b><AppWatchHomeChatInvitationPanelRollingText text={row.status} className={`relative block h-4 ${SUBTEXT}`} lineClassName={row.tone ? TONES[row.tone] : undefined} /></span>
        <InviteAction row={row} />
      </Autocomplete.Item>
    </motion.div>
  }

  // A solid sheet over the chat: it fades in and out as one, and the chat underneath never has to move.
  // Focus rings sit inside its buttons so the scrolling list doesn't clip them.
  return <motion.section className="absolute inset-0 z-5 flex min-h-0 flex-col bg-neutral-900 text-white [&_button]:focus-visible:-outline-offset-2" aria-label="Invite" inert={!present}
    initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: reducedMotion ? 0 : PANEL_FADE } }}
    exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : PANEL_FADE, delay: reducedMotion ? 0 : CONTENT_FADE } }}
    onKeyDownCapture={event => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onClose() }
    }}>
    {/* The mirror of opening: what's on the sheet goes first, then the empty sheet fades to the chat. */}
    <motion.div className="flex min-h-0 flex-1 flex-col" exit={{ opacity: 0, transition: { duration: reducedMotion ? 0 : CONTENT_FADE } }}>
      <motion.div className="flex flex-none items-center gap-2 pt-4 pr-4 pb-1.5 pl-5" data-testid="invite-heading" {...cascade(0)}>
        <h3 className="text-lg font-bold">Invite</h3>
        <UiPlainButton type="button" onClick={onClose} aria-label="Close invite" className="ml-auto grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white"><i className="fa fa-close" aria-hidden="true" /></UiPlainButton>
      </motion.div>
      <Autocomplete.Root inline open items={items} filter={null} value={text}
        onValueChange={(value, details) => { if (details.reason !== 'item-press') setText(value.slice(0, 100)) }}
        itemToStringValue={user => user.name}>
        <motion.label {...cascade(1)}
          className="mx-4 mt-2.5 mb-1 flex h-10.5 flex-none items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 text-neutral-400 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-pink-700">
          <i className="fa fa-search" aria-hidden="true" />
          <Autocomplete.Input ref={input} className="w-full min-w-0 text-sm text-white outline-none placeholder:text-neutral-500" placeholder="Search for your friends by username" aria-label="Search for your friends by username" maxLength={100} autoComplete="off" spellCheck={false} />
        </motion.label>
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-1.5 pb-2" ref={list} aria-busy={view?.kind === 'skeleton' || (!view && recentsPending)}>
          <Autocomplete.List>
            {/* A new key swaps the whole list at once. The groups skip the fade when the panel opens: their rows
                cascade in instead. */}
            {!view ? <motion.div key={viewKey} {...(groupsCascade.current ? {} : fadeIn)}>
                {partyRows.length > 0 && <Autocomplete.Group>
                  <motion.div {...cascade(2)}><Autocomplete.GroupLabel className={LABEL}>Party</Autocomplete.GroupLabel></motion.div>
                  {partyRows.map(({ user, placement }, index) => placement.member
                    ? <motion.div className={PERSON} data-testid="invite-person" key={user.id} {...cascade(3 + index)}>
                      <Face user={invitations.withPresence(user)} />
                      <span className={`${DETAILS} gap-0.5`}><b className={NAME}>{user.name}{String(user.id) === String(auth.data.id) && <em className="ml-1.5 text-11 font-normal text-neutral-400 not-italic">(You)</em>}</b>
                        <small className={SUBTEXT}>{String(user.id) === hostId ? 'Host 👑' : 'In the room'}</small></span>
                    </motion.div>
                    : person(user, cascade(3 + index)))}
                </Autocomplete.Group>}
                {(recentsPending || recentRows.length > 0) && <Autocomplete.Group className="relative" data-testid="invite-recents">
                  <motion.div {...cascade(4)}><Autocomplete.GroupLabel className={LABEL}>Recents</Autocomplete.GroupLabel></motion.div>
                  {recentsPending && <motion.div key="skeletons" {...cascade(5)}><InviteSkeletons /></motion.div>}
                  {recentRows.map((user, index) => person(user, cascade(5 + index)))}
                </Autocomplete.Group>}
                {recentsFailed && <p className={NOTE} data-testid="invite-note" role="alert">Couldn’t load people. <button type="button" className={TEXT_BUTTON} onClick={() => recents.refetch()}>Retry</button></p>}
              </motion.div>
              // Search has no headings, so its rows start just under the field.
              : <motion.div key={viewKey} className="pt-1.5" data-testid="invite-results" {...fadeIn}>
                {view.kind === 'skeleton' && <InviteSkeletons />}
                {view.kind === 'results' && view.users.map(user => person(user, {}))}
                {view.kind === 'empty' && <p className={LINE}>No one named “{term}”.</p>}
                {view.kind === 'error' && <p className={LINE} role="alert">Couldn’t search for “{term}”.&nbsp;<button type="button" className={TEXT_BUTTON} onClick={() => search.refetch()}>Retry</button></p>}
              </motion.div>}
          </Autocomplete.List>
          {invitations.historyError && <p className={NOTE} data-testid="invite-note" role="alert">Couldn’t load invite updates. <button type="button" className={TEXT_BUTTON} onClick={invitations.refreshHistory}>Retry</button></p>}
        </div>
      </Autocomplete.Root>
      <motion.div className="min-h-15 flex-none border-t border-neutral-950" data-testid="invite-footer" {...cascade(7)}><AppWatchHomePartyCode code={party.join_code} /></motion.div>
    </motion.div>
  </motion.section>
}

function InviteSkeletons() {
  return <div data-testid="invite-skeletons" aria-hidden="true">
    {[0, 1, 2, 3].map(n => <div className={PERSON} data-testid="invite-person" key={n}>
      <UiSkeleton width={32} height={32} radius="50%" />
      <span className={`${DETAILS} gap-1.75`}><UiSkeleton width="44%" height={10} radius={5} /><UiSkeleton width="26%" height={8} radius={4} /></span>
    </div>)}
  </div>
}

/**
 * A UiButton look (default, small, round) inside the row's own button, so it can't be a nested <button>.
 * One width fits Invite, Undo and Retry, and it lights up with the row.
 * Words blur across, busy shows three dots, and once there's nothing left to do it sinks away.
 */
function InviteAction({ row }: { row: InviteRow }) {
  const reducedMotion = useReducedMotion()
  const blur = reducedMotion ? 'blur(0px)' : 'blur(3px)'
  return <AnimatePresence initial={false}>
    {row.action && <motion.span key="action" className={buttonClass({ size: 's', round: true }, 'relative w-19 flex-none overflow-hidden p-0 group-enabled:group-hover:bg-neutral-700 group-data-highlighted:bg-neutral-700')} data-testid="invite-action" aria-hidden="true"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={{ opacity: 1, y: 0, x: row.action === 'retry' && !reducedMotion ? SHAKE : 0, transition: { x: { duration: .4, delay: .12 } } }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 10, transition: { opacity: { duration: .32, ease: 'easeIn' }, y: { duration: .38, ease: [.4, 0, .6, 1] } } }}>
      <AnimatePresence initial={false}>
        <motion.span key={row.busy ? 'busy' : row.action} className="absolute inset-0 grid place-items-center"
          initial={{ opacity: 0, filter: blur }}
          animate={{ opacity: 1, filter: 'blur(0px)', transition: { duration: .28, delay: .07, ease: 'easeOut' } }}
          exit={{ opacity: 0, filter: blur, transition: { duration: .17, ease: 'easeIn' } }}>
          {row.busy ? <span className="inline-flex gap-0.75">{[0, 0.15, 0.3].map(delay => <i key={delay} className="size-1 animate-busy-dot rounded-full bg-current motion-reduce:animate-none motion-reduce:opacity-70" style={{ animationDelay: `${delay}s` }} />)}</span> : ACTION_LABELS[row.action]}
        </motion.span>
      </AnimatePresence>
    </motion.span>}
  </AnimatePresence>
}
