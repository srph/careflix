/**
 * For series, display range (2018-2019). For movies, display air date (2018)
 * 
 * @TODO This assumes that video has `group`.
 */
export default function getAirDetails(video: AppShowVideo) {
  if (video.show.title_type === 'series') {
    return `${video.group.title}: ${video.title}`
  }

  return new Date(video.show.air_start).getFullYear()
}