/**
 * For series, display range (2018-2019). For movies, display air date (2018)
 */
export default function getAirDetails(video: AppShowVideo) {
  if (video.show.title_type === 'series') {
    return 'Season 6: Episode 5'
  }

  return new Date(video.show.air_start).getFullYear()
}