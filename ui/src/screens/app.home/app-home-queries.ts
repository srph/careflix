import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { axios } from '~/lib/axios/axios'
import { get } from '~/lib/query/get'
import { useAuth } from '~/contexts/auth/auth'

export type ListingTab = 'all' | 'movie' | 'series' | 'parties'

const nextPage = (page: AppCollection) => page.current_page < page.last_page ? page.current_page + 1 : undefined

export function useShowsQuery(titleType?: 'movie' | 'series', enabled = true) {
  const { data: user, isAuthenticated } = useAuth()
  return useInfiniteQuery({
    queryKey: ['listing', user?.id, 'shows', titleType ?? 'all'],
    queryFn: ({ pageParam, signal }) => get<AppCollection<AppShow>>('/api/shows', { page: pageParam, title_type: titleType }, signal),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: isAuthenticated && enabled,
  })
}

export function useMyPartiesQuery(show?: AppShow) {
  const { data: user, isAuthenticated } = useAuth()
  return useInfiniteQuery({
    queryKey: show ? ['listing', user?.id, 'parties', show.id] : ['listing', user?.id, 'parties'],
    queryFn: ({ pageParam, signal }) => get<AppCollection<AppParty>>('/api/me/parties', { page: pageParam, ...(show && { show_id: show.id }) }, signal),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    enabled: isAuthenticated,
  })
}

export function useListingSearchQuery(term: string) {
  const { data: user, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['listing', user?.id, 'search', term],
    queryFn: async ({ signal }) => {
      const [titles, parties] = await Promise.all([
        get<AppCollection<AppShow>>('/api/shows', { q: term, per_page: 5 }, signal),
        get<AppCollection<AppParty>>('/api/me/parties', { q: term, per_page: 4 }, signal),
      ])
      return { titles: titles.data, parties: parties.data }
    },
    enabled: isAuthenticated && Boolean(term),
  })
}

export function useShowGroupsQuery(show: AppShow | null, enabled = true) {
  const { data: user, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['listing', user?.id, 'groups', show?.id],
    queryFn: ({ signal }) => get<AppShowGroup[]>(`/api/shows/${show!.id}/groups`, undefined, signal),
    enabled: isAuthenticated && enabled && show?.title_type === 'series',
  })
}

export function useCreatePartyMutation() {
  const { data: user } = useAuth()
  const client = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationKey: ['listing', user?.id, 'create-party'],
    mutationFn: async (video: AppShowVideo): Promise<AppParty> => {
      const [error, response] = await axios.post('/api/parties', { show_video_id: video.id })
      if (error) throw error
      return response.data
    },
    onSuccess: party => {
      void client.invalidateQueries({ queryKey: ['listing', user?.id, 'parties'] })
      void client.invalidateQueries({ queryKey: ['listing', user?.id, 'search'] })
      navigate(`/watch/${party.id}`)
    },
  })
}

export function usePartyCodeQuery(code: string) {
  const { data: user, isAuthenticated } = useAuth()
  return useQuery({
    queryKey: ['party-code', user?.id, code],
    queryFn: ({ signal }) => get<AppPartyPreview>(`/api/party-codes/${code}`, undefined, signal),
    enabled: isAuthenticated && code.length === 6,
    staleTime: 0,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
  })
}

export function useJoinPartyMutation() {
  const auth = useAuth()
  const client = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (code: string): Promise<AppParty & { accepted_invitation_ids: AppId[]; declined_invitation_ids: AppId[] }> => {
      const [error, response] = await axios.post(`/api/party-codes/${code}/join`, {}, { app: { validation: false } })
      if (error) throw error
      return response.data
    },
    onSuccess: party => {
      for (const id of [...party.accepted_invitation_ids, ...party.declined_invitation_ids]) auth.removeInvitation(id)
      void client.invalidateQueries({ queryKey: ['listing', auth.data?.id, 'parties'] })
      void client.invalidateQueries({ queryKey: ['listing', auth.data?.id, 'search'] })
      navigate(`/watch/${party.id}`)
    },
  })
}
