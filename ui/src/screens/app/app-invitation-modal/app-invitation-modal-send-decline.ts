import type { AxiosError } from 'axios'
import { parse } from 'date-fns-v1'
import { axios } from '~/lib/axios/axios'

export const DECLINE_RETRY_DELAYS = [1000, 3000, 10000]

export type DeclineOutcome = 'declined' | 'resolved' | 'gave-up'

/**
 * Tell the API about a decline the UI has already shown. Nothing here reaches the screen:
 * a decline that never lands just expires, and the host sees "didn't answer".
 */
export async function sendDecline(invitation: AppPartyInvitation): Promise<DeclineOutcome> {
  const expiresAt = parse(invitation.expires_at).getTime()
  for (let attempt = 0; ; attempt++) {
    const [error] = await axios.post(`/api/invitations/${invitation.id}/decline`, {}, { app: { validation: false } })
    if (!error) return 'declined'
    // 403/404: already answered, cancelled or expired (or an earlier try landed). 401: signed out.
    const status = (error as AxiosError).response?.status
    if (status && status < 500 && status !== 429) return 'resolved'
    const wait = DECLINE_RETRY_DELAYS[attempt]
    if (wait == null || expiresAt <= Date.now() + wait) return 'gave-up'
    await new Promise(resolve => setTimeout(resolve, wait))
  }
}
