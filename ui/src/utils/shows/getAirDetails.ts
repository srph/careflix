/**
 * For series, display range (2018-2019). For movies, display air date (2018)
 */
export default function getAirDetails(show: AppShow): string {
  const start: number = new Date(show.air_start).getFullYear()

  if (show.title_type === 'series') {
    const end: number = new Date(show.air_end).getFullYear()
    return `${start}-${end}`
  }

  return String(start)
}