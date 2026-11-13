import { useQuery, useQueryClient } from '@tanstack/react-query'
import immer from 'immer'
import { useAuthUser } from '~/lib/auth/auth-queries'
import { get } from '~/lib/query/get'
import { queryKeys } from '~/query-keys'
import { readDeclinedInvitations, rememberDeclinedInvitation } from './declined-invitations'

// Invitations that left the screen. A resolved event can arrive before the invitation itself
// (on another tab), and /api/me still returns a decline that hasn't reached the API.
// Ids are unique across accounts, so this never needs clearing.
const removed = new Set<string>()

function visible(user: AppUser, invitations: AppPartyInvitation[] = []) {
  for (const entry of readDeclinedInvitations(user.id)) removed.add(entry.id)
  return invitations.filter((invitation) => !removed.has(String(invitation.id)))
}

/** Invitations sent to the signed-in user. They start from /api/me, then Pusher events keep them current. */
export function useIncomingInvitationsQuery() {
  const user = useAuthUser()
  return useQuery({
    queryKey: queryKeys.global.invitations(),
    queryFn: async ({ signal }) => visible(user, (await get<AppUser>('/api/me', undefined, signal)).invitations),
    initialData: () => visible(user, user.invitations),
    staleTime: Infinity
  })
}

/** Changes to the incoming invitations, for Pusher events and answers. */
export function useIncomingInvitationsCache() {
  const client = useQueryClient()
  const user = useAuthUser()
  const update = (recipe: (draft: AppPartyInvitation[]) => void) =>
    client.setQueryData<AppPartyInvitation[]>(
      queryKeys.global.invitations(),
      (current) => current && immer(current, recipe)
    )

  const remove = (ids: AppId[]) => {
    for (const id of ids) removed.add(String(id))
    client.setQueryData<AppPartyInvitation[]>(queryKeys.global.invitations(), (current) =>
      current?.filter((invitation) => !removed.has(String(invitation.id)))
    )
  }

  return {
    receive(invitation: AppPartyInvitation) {
      if (removed.has(String(invitation.id))) return
      update((draft) => {
        if (!draft.some((item) => item.id === invitation.id)) draft.push(invitation)
      })
    },
    cancel(invitation: AppPartyInvitation) {
      update((draft) => {
        const match = draft.find((item) => item.id === invitation.id)
        if (match) match.action = 'cancelled'
      })
    },
    remove,
    /** Hide it now, and on this device until it expires, even if the decline never reaches the API. */
    decline(invitation: AppPartyInvitation) {
      rememberDeclinedInvitation(user.id, invitation)
      remove([invitation.id])
    }
  }
}
