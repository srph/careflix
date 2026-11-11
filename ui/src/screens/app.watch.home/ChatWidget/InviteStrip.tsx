import cx from 'classnames'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import UiAvatar from '~/components/UiAvatar'
import UiPlainButton from '~/components/UiPlainButton'
import { easeOutSoft } from '~/utils/motion'
import RollingText from '../ChatInvitationPanel/RollingText'
import { HostInvitations, minutesLeft } from '../ChatInvitationPanel/useHostInvitations'

const names = (users: AppUser[]) => users.map(user => user.name).join(', ')

/**
 * The line above the chat while the host has invites out: Inviting…, Waiting on…, and for a few seconds
 * a Declined or Expired answer with Invite to ask again.
 */
export default function InviteStrip({ invitations, onOpen }: { invitations: HostInvitations; onOpen: () => void }) {
  const reducedMotion = useReducedMotion()
  const answered = invitations.answered[invitations.answered.length - 1]
  const waiting = invitations.pending.map(invitation => invitation.recipient)
  const strip = answered ? {
    users: [answered.recipient], muted: true,
    text: invitations.answer(String(answered.recipient.id)) === 'declined' ? `${answered.recipient.name} declined` : `${answered.recipient.name}’s invite expired`,
    right: 'Invite', label: `Invite ${answered.recipient.name} again`, onClick: () => invitations.invite(answered.recipient)
  } : invitations.sending.length ? {
    users: invitations.sending, muted: false, text: `Inviting ${names(invitations.sending)}…`, right: '', label: undefined, onClick: onOpen
  } : waiting.length ? {
    users: waiting, muted: false, text: `Waiting on ${names(waiting)}`, label: undefined, onClick: onOpen,
    right: minutesLeft(invitations.pending.reduce((soonest, invitation) => Date.parse(invitation.expires_at) < Date.parse(soonest.expires_at) ? invitation : soonest), invitations.now)
  } : null

  return <AnimatePresence initial={false}>
    {strip && <motion.div key="invite-strip" className="host-invite-waiting-slot"
      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : .28, ease: easeOutSoft }}>
      <UiPlainButton type="button" data-testid="invite-strip" className={cx('host-invite-waiting', { 'is-muted': strip.muted })}
        aria-label={strip.label} disabled={answered && invitations.busy[String(answered.recipient.id)]} onClick={strip.onClick}>
        <span className="host-invite-waiting-avatars">{strip.users.slice(0, 3).map(user => <UiAvatar key={user.id} user={user} size="sm" />)}</span>
        <RollingText text={strip.text} className="host-invite-waiting-text" />
        <RollingText text={strip.right} className="host-invite-waiting-right" lineClassName={strip.muted ? 'is-action' : undefined} />
      </UiPlainButton>
    </motion.div>}
  </AnimatePresence>
}
