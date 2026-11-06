import './style.css'
import { useEffect, useRef } from 'react'
import { Autocomplete } from '@base-ui/react/autocomplete'
import { motion, useIsPresent, useReducedMotion } from 'motion/react'
import { useAuth } from '~/contexts/Auth'
import { usePartyContext } from '~/screens/app.watch/Context'
import UiPresenceAvatar from '~/components/UiPresenceAvatar'
import UiPlainButton from '~/components/UiPlainButton'
import PartyCode from '../PartyCode'
import { HostInvitations, remainingTime } from './useHostInvitations'

export default function ChatInvitationPanel({ invitations, onClose }: {
  invitations: HostInvitations
  onClose: () => void
}) {
  const { party } = usePartyContext()
  const auth = useAuth()
  const present = useIsPresent()
  const reducedMotion = useReducedMotion()
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { input.current?.focus({ preventScroll: true }) }, [])
  const matches = (user: AppUser) => !invitations.query.trim() || user.name.toLowerCase().includes(invitations.query.trim().toLowerCase())
  const memberIds = new Set(party.members.map(member => String(member.id)))
  const pendingIds = new Set(invitations.pending.map(invitation => String(invitation.recipient.id)))
  const partyUsers = party.members.filter(matches)
  const pending = invitations.pending.filter(invitation => matches(invitation.recipient))
  const people = new Map(Array.from(invitations.history.values(), invitation => [String(invitation.recipient.id), invitation.recipient]))
  invitations.users.forEach(user => people.set(String(user.id), user))
  const resultIds = new Set(invitations.users.map(user => String(user.id)))
  const recents = Array.from(people.values()).filter(user => !memberIds.has(String(user.id)) &&
    !pendingIds.has(String(user.id)) && (matches(user) || resultIds.has(String(user.id))))
  const items = [...pending.map(invitation => invitation.recipient), ...recents]
  const cascade = (index: number) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 12 },
    animate: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : .38, delay: reducedMotion ? 0 : .11 + index * .032 } },
    exit: { opacity: 0, y: reducedMotion ? 0 : 12, transition: { duration: reducedMotion ? 0 : .16 } }
  })

  function row(user: AppUser, index: number) {
    const invitation = invitations.history.get(String(user.id))
    const waiting = pendingIds.has(String(user.id))
    const busy = invitations.busy[String(user.id)]
    const outcome = invitation?.action === 'declined' ? 'Declined' : invitation?.action === 'pending' && !waiting ? 'No answer' : ''
    const retry = Boolean(outcome)
    const label = waiting ? `Cancel invite to ${user.name}` : `${retry ? 'Ask again: ' : 'Invite '}${user.name}`
    const status = invitations.errors[String(user.id)] || (busy ? waiting ? 'Cancelling invite…' : 'Sending invite…' :
      waiting ? `${remainingTime(invitation, invitations.now)} left` : outcome || (invitations.withPresence(user).is_online ? 'Online' : 'Offline'))
    const progress = waiting ? Math.max(0, Math.min(1, (Date.parse(invitation.expires_at) - invitations.now) /
      ((invitation.duration || 1800) * 1000))) : 0
    return <motion.div key={user.id} {...cascade(index)}>
      <Autocomplete.Item value={user} disabled={busy} nativeButton
        render={<button type="button" />} className={`host-invite-person user-item${waiting ? ' is-pending' : ''}`}
        aria-label={label} onClick={() => waiting ? invitations.cancel(invitation) : invitations.invite(user)}>
        <span className="host-invite-avatar">
          <UiPresenceAvatar user={invitations.withPresence(user)} />
          {waiting && <span className="host-invite-ring" style={{ background: `conic-gradient(var(--color-primary) ${progress * 360}deg, #ffffff24 0)` }} />}
        </span>
        <span className="host-invite-details"><b>{user.name}</b><small className={invitations.errors[String(user.id)] ? 'is-error' : ''}>{status}</small></span>
        <span className={`host-invite-action${waiting ? ' is-cancel' : ''}${retry ? ' is-retry' : ''}`} aria-hidden="true">
          {busy ? <i className="fa fa-circle-o-notch fa-spin" /> : retry ? 'Ask again' : <i className={`fa ${waiting ? 'fa-close' : 'fa-plus'}`} />}
        </span>
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
    <Autocomplete.Root inline open items={items} filter={null} value={invitations.query}
      onValueChange={(value, details) => { if (details.reason !== 'item-press') invitations.setQuery(value) }}
      itemToStringValue={user => user.name}>
      <motion.label className="host-invite-search" {...cascade(1)}>
        <i className="fa fa-search" aria-hidden="true" />
        <Autocomplete.Input ref={input} placeholder="Search everyone" aria-label="Search everyone" maxLength={100} autoComplete="off" spellCheck={false} />
      </motion.label>
      <div className="host-invite-list" aria-busy={invitations.loading}>
        <Autocomplete.List>
          {(partyUsers.length > 0 || pending.length > 0) && <Autocomplete.Group>
            <motion.div {...cascade(2)}><Autocomplete.GroupLabel className="host-invite-label">Party</Autocomplete.GroupLabel></motion.div>
            {partyUsers.map((member, index) => <motion.div className="host-invite-person user-item" key={member.id} {...cascade(3 + index)}>
              <UiPresenceAvatar user={invitations.withPresence(member)} />
              <span className="host-invite-details"><b>{member.name}{String(member.id) === String(auth.data.id) && <em>You</em>}</b>
                <small>{String(member.id) === String(party.creator?.id) ? 'Host' : 'In the room'}</small></span>
            </motion.div>)}
            {pending.map((invitation, index) => row(invitation.recipient, 3 + partyUsers.length + index))}
          </Autocomplete.Group>}
          {recents.length > 0 && <Autocomplete.Group>
            <motion.div {...cascade(4)}><Autocomplete.GroupLabel className="host-invite-label">{invitations.query.trim() ? 'People' : 'Recents'}</Autocomplete.GroupLabel></motion.div>
            {recents.map((user, index) => row(user, 5 + Math.min(index, 10)))}
          </Autocomplete.Group>}
        </Autocomplete.List>
        {invitations.loading && <p className="host-invite-note" role="status">Loading people…</p>}
        {!invitations.loading && !invitations.searchError && !recents.length && !partyUsers.length && !pending.length &&
          <p className="host-invite-note">No one named “{invitations.query}”.</p>}
        {!invitations.loading && !invitations.query.trim() && !recents.length && !invitations.searchError &&
          <p className="host-invite-note">Search everyone to invite someone to the room.</p>}
        {invitations.searchError && <p className="host-invite-note" role="alert">Couldn’t load people. <button type="button" onClick={invitations.retrySearch}>Retry</button></p>}
        {invitations.historyError && <p className="host-invite-note" role="alert">Couldn’t load invite updates. <button type="button" onClick={invitations.refreshHistory}>Retry</button></p>}
      </div>
    </Autocomplete.Root>
    <motion.div className="host-invite-footer" {...cascade(7)}><PartyCode code={party.join_code} /></motion.div>
  </motion.section>
}
