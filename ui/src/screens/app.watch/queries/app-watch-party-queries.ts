import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/lib/axios/axios'
import { get } from '~/lib/query/get'
import { queryKeys } from '~/query-keys'

/**
 * The room's party. Pusher keeps it current, so it never goes stale; leaving the room drops it,
 * so coming back loads it fresh. A failure shows the room's Retry instead of retrying by itself.
 */
export function usePartyQuery(partyId: AppId) {
  return useQuery({
    queryKey: queryKeys.watchParty.party(partyId),
    queryFn: ({ signal }) => get<AppParty>(`/api/parties/${partyId}`, undefined, signal),
    staleTime: Infinity,
    gcTime: 0,
    retry: false
  })
}

/** Writes to the room's cached party; does nothing before it has loaded. */
export function useSetParty(partyId: AppId) {
  const client = useQueryClient()
  return (update: (party: AppParty) => AppParty) =>
    client.setQueryData<AppParty>(queryKeys.watchParty.party(partyId), (party) => party && update(party))
}

/** Tells the room you played, paused or seeked. A failure is ignored, as it always was. */
export function useSyncStateMutation(partyId: AppId) {
  return useMutation({
    mutationFn: async (state: AppPartyState) => {
      await axios.put(`/api/parties/${partyId}/state`, state)
    }
  })
}
