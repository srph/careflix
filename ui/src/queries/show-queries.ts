import { useQuery } from '@tanstack/react-query'
import { get } from '~/lib/query/get'
import { useAuth } from '~/lib/auth/auth-queries'
import { queryKeys } from '~/query-keys'

/** A series' seasons and episodes; off for movies. Used by the home listing and the incoming invitation. */
export function useShowGroupsQuery(show: AppShow | null, enabled = true) {
  const isAuthenticated = useAuth().status === 'authenticated'
  return useQuery({
    queryKey: queryKeys.global.showGroups(show?.id),
    queryFn: ({ signal }) => get<AppShowGroup[]>(`/api/shows/${show!.id}/groups`, undefined, signal),
    enabled: isAuthenticated && enabled && show?.title_type === 'series'
  })
}
