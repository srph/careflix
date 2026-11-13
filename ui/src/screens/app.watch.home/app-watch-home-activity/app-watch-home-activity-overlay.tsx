import * as React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '~/utils/cn'
import { usePusher } from '~/hooks/use-pusher'
import { useTransientState } from '~/hooks/use-transient-state'
import { useUpdateEffect } from '~/hooks/use-update-effect'
import { easeOutSoft } from '~/utils/motion'
import { useAuthUser } from '~/lib/auth/auth-queries'
import { PlayaActivity } from '~/components/playa/playa-activity'
import { useParty } from '~/screens/app.watch/use-party'
import { useTypingStatus } from '../app-watch-home-chat-widget/use-typing-status'
import { useWatchLayout } from '../app-watch-home-layout'
import { ACTIVITY_COPY, type ActivityLevel } from './app-watch-home-activity-level'

const TOAST_MS = 2200

/**
 * The room over the bottom-left of the picture while chat is closed, from 640px up. Playa draws the lines
 * (usePartyPlaya feeds them, filtered by the level from the bell); this adds who's typing, opens chat on a click,
 * and owns the note at the top of the picture when the level changes.
 */
export function AppWatchHomeActivityOverlay() {
  const party = useParty()
  const me = useAuthUser()
  const layout = useWatchLayout()
  const typing = useTypingStatus(party.id, me)
  const [toast, showToast] = useTransientState<ActivityLevel | null>(null, TOAST_MS)

  // A message ends its sender's typing.
  usePusher(`private-party.${party.id}`, 'log', (event: { log?: AppPartyLog }) => {
    const log = event?.log
    if (log?.type === 'message' && log.message?.user) typing.clear(log.message.user.id)
  })

  useUpdateEffect(() => showToast(layout.activityLevel), [layout.activityLevel])

  const isChatOpen = layout.sidebar !== 'closed'

  return (
    <>
      <PlayaActivity
        typing={!isChatOpen && layout.activityLevel === 'all' ? typing.names : []}
        onLineClick={layout.toggleChat}
      />

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            className="pointer-events-none absolute inset-x-0 top-6 z-(--zindex-player-tooltip) mx-auto hidden w-max items-center gap-2 rounded-full bg-neutral-900 px-3.5 py-2 text-13/4 font-semibold text-white shadow-pop sm:flex"
            data-testid="activity-toast"
            role="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: easeOutSoft }}>
            <i className={cn('fa', ACTIVITY_COPY[toast].icon)} aria-hidden="true" />
            {ACTIVITY_COPY[toast].toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
