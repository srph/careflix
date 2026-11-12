import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { axios } from '~/lib/axios/axios'
import { get } from '~/lib/query/get'
import { uuid } from '~/lib/uuid/uuid'
import { queryKeys } from '~/query-keys'
import { getStandardFormattedDateTime } from '~/utils/date/get-standard-formatted-date-time'

/**
 * The room's chat and activity log. Pusher appends to it, so it never goes stale; leaving the room
 * drops it. A failed load leaves the chat empty, without retrying.
 */
export function useChatLogsQuery(partyId: AppId) {
  return useQuery({
    queryKey: queryKeys.watchParty.chat(partyId),
    queryFn: ({ signal }) => get<AppPartyLog[]>(`/api/parties/${partyId}/logs`, undefined, signal),
    staleTime: Infinity,
    gcTime: 0,
    retry: false
  })
}

/** Appends a log to the room's chat, even before the first load lands (which then replaces it). */
export function useAppendChatLog(partyId: AppId) {
  const client = useQueryClient()
  return (log: AppPartyLog) =>
    client.setQueryData<AppPartyLog[]>(queryKeys.watchParty.chat(partyId), (logs = []) => [...logs, log])
}

/** Sends a message. It shows straight away and is swapped for the saved one when the server answers. */
export function useSendMessageMutation(party: AppParty, user: AppUser) {
  const client = useQueryClient()
  const append = useAppendChatLog(party.id)
  const key = queryKeys.watchParty.chat(party.id)
  return useMutation({
    mutationFn: async (text: string): Promise<AppPartyLog> => {
      const [error, response] = await axios.post(`/api/parties/${party.id}/logs/message`, { message: text })
      if (error) throw error
      return response.data
    },
    onMutate: (text) => {
      const date = getStandardFormattedDateTime()
      const log: AppPartyLog = {
        id: uuid(),
        party_id: party.id,
        type: 'message',
        message: { id: uuid(), text, user, created_at: date, updated_at: date },
        activity: null,
        created_at: date,
        updated_at: date
      }
      append(log)
      return { id: log.id }
    },
    // A failed send keeps its bubble, as before.
    onSuccess: (saved, _text, context) => {
      client.setQueryData<AppPartyLog[]>(key, (logs) => logs?.map((log) => (log.id === context.id ? saved : log)))
    }
  })
}
