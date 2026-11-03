export function airYears(show: AppShow) {
  const start = show.air_start?.slice(0, 4)
  const end = show.air_end?.slice(0, 4)
  return start ? (show.title_type === 'series' && start !== end ? `${start}–${end || ''}` : start) : ''
}

export function totalDuration(videos: AppShowVideo[]) {
  return videos.reduce((total, video) => total + Math.max(0, Number(video.duration) || 0), 0)
}

export function duration(seconds?: number) {
  if (!Number.isFinite(Number(seconds)) || Number(seconds) <= 0) return 'Unavailable'
  const minutes = Math.max(1, Math.floor(Number(seconds) / 60))
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m` : `${minutes}m`
}
