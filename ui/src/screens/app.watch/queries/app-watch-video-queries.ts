import { useQuery } from '@tanstack/react-query'
import { axios } from '~/lib/axios/axios'
import { queryKeys } from '~/query-keys'

/**
 * A video's subtitle file as text, or null when the response isn't one. Loaded once per video while it
 * plays, and never for a video without subtitles; a failure just means no subtitles.
 */
export function useSubtitleQuery(video: AppShowVideo) {
  return useQuery({
    queryKey: queryKeys.watchParty.subtitle(video.id),
    queryFn: async () => {
      const [error, response] = await axios.get(`/api/videos/${video.id}/subtitle`, { app: { validation: false } })
      if (error) throw error
      const subtitle: unknown = response?.data?.subtitle
      return typeof subtitle === 'string' ? subtitle : null
    },
    enabled: Boolean(video.subtitle_url),
    staleTime: Infinity,
    gcTime: 0,
    retry: false
  })
}
