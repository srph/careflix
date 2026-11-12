import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/lib/axios/axios'
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

// A late search/snapshot/event must never undo a newer invitation or its answer.
export function mergeHistory(current: AppPartyInvitation[], incoming: AppPartyInvitation[]) {
  const byPerson = new Map(current.map((invitation) => [String(invitation.recipient.id), invitation]))
  for (const invitation of incoming) {
    const id = String(invitation.recipient.id)
    const previous = byPerson.get(id)
    if (
      !previous ||
      Number(invitation.id) > Number(previous.id) ||
      (String(invitation.id) === String(previous.id) &&
        (previous.action === 'pending' || invitation.action !== 'pending'))
    )
      byPerson.set(id, invitation)
  }
  return Array.from(byPerson.values())
}

/**
 * The host's invitations for the room, newest per person. Starts from the party's own and loads the
 * full list on mount; every load, event and send merges in, so nothing late undoes something newer.
 */
export function useInvitationsQuery(party: AppParty) {
  const client = useQueryClient()
  const key = queryKeys.watchParty.invitations(party.id)
  return useQuery({
    queryKey: key,
    queryFn: async ({ signal }) => {
      const invitations = await get<AppPartyInvitation[]>(`/api/parties/${party.id}/invitations`, undefined, signal)
      if (!Array.isArray(invitations)) throw new Error('Unexpected invitations response')
      return mergeHistory(client.getQueryData<AppPartyInvitation[]>(key) ?? [], invitations)
    },
    initialData: party.invitations || [],
    refetchOnMount: 'always',
    staleTime: Infinity,
    gcTime: 0,
    retry: false
  })
}

/** Merges invitations into the room's list. */
export function useMergeInvitations(partyId: AppId) {
  const client = useQueryClient()
  return (incoming: AppPartyInvitation[]) =>
    client.setQueryData<AppPartyInvitation[]>(queryKeys.watchParty.invitations(partyId), (current = []) =>
      mergeHistory(current, incoming)
    )
}

export function useSendInviteMutation(partyId: AppId) {
  return useMutation({
    mutationFn: async (user: AppUser): Promise<AppPartyInvitation> => {
      const [error, response] = await axios.post(`/api/parties/${partyId}/invitations/send`, { recipient_id: user.id })
      if (error) throw error
      return response.data
    }
  })
}

export function useCancelInviteMutation() {
  return useMutation({
    mutationFn: async (invitation: AppPartyInvitation): Promise<AppPartyInvitation> => {
      const [error, response] = await axios.post(`/api/invitations/${invitation.id}/cancel`)
      if (error) throw error
      return response.data
    }
  })
}
