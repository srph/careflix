import { cn } from '~/utils/cn'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { easeOutSoft } from '~/utils/motion'
import { AppWatchHomeChatInvitationPanelRollingText } from '../app-watch-home-chat-invitation-panel/app-watch-home-chat-invitation-panel-rolling-text'
import { HostInvitations, minutesLeft } from '../app-watch-home-chat-invitation-panel/use-host-invitations'

const names = (users: AppUser[]) => users.map(user => user.name).join(', ')

/**
 * The line above the chat while the host has invites out: Inviting…, Waiting on…, and for a few seconds
 * a Declined or Expired answer with Invite to ask again.
 */
export function AppWatchHomeChatWidgetInviteStrip({ invitations, onOpen }: { invitations: HostInvitations; onOpen: () => void }) {
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
    {strip && <motion.div key="invite-strip" className="flex-none overflow-hidden"
      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
      transition={{ duration: reducedMotion ? 0 : .28, ease: easeOutSoft }}>
      <UiPlainButton type="button" data-testid="invite-strip"
        className={cn('mx-3 mb-2.5 flex w-[calc(100%-24px)] items-center gap-2.5 rounded-xl border py-1.75 pr-3 pl-2 text-left text-13 transition-colors duration-350',
          strip.muted ? 'border-neutral-700 bg-neutral-800 text-neutral-200' : 'border-pink-500/20 bg-pink-500/8 text-pink-200')}
        aria-label={strip.label} disabled={answered && invitations.busy[String(answered.recipient.id)]} onClick={strip.onClick}>
        <span className="flex flex-none">{strip.users.slice(0, 3).map(user => <UiAvatar key={user.id} user={user} size="sm" className="not-first:-ml-2 not-first:ring-2 not-first:ring-neutral-900" />)}</span>
        <AppWatchHomeChatInvitationPanelRollingText text={strip.text} className="relative h-4.5 min-w-0 flex-1 leading-4.5" />
        <AppWatchHomeChatInvitationPanelRollingText text={strip.right} className="relative h-4.5 min-w-10 flex-none text-xs/4.5 text-neutral-400 tabular-nums" lineClassName={strip.muted ? 'text-right text-pink-300 underline' : 'text-right'} />
      </UiPlainButton>
    </motion.div>}
  </AnimatePresence>
}
