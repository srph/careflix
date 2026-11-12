import { parseStandardTime } from '~/utils/date/parse-standard-time'

/**
 * For series, display season and episode index. For movies, display air date (2018)
 *
 * @NOTE This assumes that video has `group`.
 */
export function getVideoDetails(video: AppPartyVideo) {
  if (video.show.title_type === 'series') {
    return `${video.group!.title}: ${video.title}`
  }

  return parseStandardTime(video.show.air_start).getFullYear()
}
