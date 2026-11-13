import { axios } from '~/lib/axios/axios'

/**
 * A video's subtitle file as text, or null when the response isn't one. The API fetches the file for us,
 * since the browser can't load it from where it's hosted. Playa calls this and keeps the result.
 */
export async function loadSubtitle(videoId: AppId): Promise<string | null> {
  const [error, response] = await axios.get(`/api/videos/${videoId}/subtitle`, { app: { validation: false } })
  if (error) throw error
  const subtitle: unknown = response?.data?.subtitle
  return typeof subtitle === 'string' ? subtitle : null
}
