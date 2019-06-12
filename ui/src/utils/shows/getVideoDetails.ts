/**
 * For series, display season and episode index. For movies, display air date (2018)
 * 
 * @NOTE This assumes that video has `group`.
 */
export default function getVideoDetails(video: AppShowVideo) {
  if (video.show.title_type === 'series') {
    return `${video.group.title}: ${video.title}`
  }

  return new Date(video.show.air_start).getFullYear()
}