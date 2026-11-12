import { useQuery } from '@tanstack/react-query'
import { get } from '~/lib/query/get'
import { queryKeys } from '~/query-keys'

async function people(partyId: AppId, term: string, signal?: AbortSignal) {
  const users = await get<AppUser[]>(
    `/api/parties/${partyId}/invitations/search`,
    term ? { search: term } : undefined,
    signal
  )
  if (!Array.isArray(users)) throw new Error('Unexpected invite search response')
  return users
}

/** People the viewer has watched with before, most recent first; the room's members are left out. */
export function useInviteRecentsQuery(partyId: AppId) {
  return useQuery({
    queryKey: queryKeys.watchParty.inviteRecents(partyId),
    queryFn: ({ signal }) => people(partyId, '', signal)
  })
}

/** Everyone but the viewer whose name or email matches, room members included. Off without a term. */
export function useInviteSearchQuery(partyId: AppId, term: string) {
  return useQuery({
    queryKey: queryKeys.watchParty.inviteSearch(partyId, term),
    queryFn: ({ signal }) => people(partyId, term, signal),
    enabled: Boolean(term)
  })
}
