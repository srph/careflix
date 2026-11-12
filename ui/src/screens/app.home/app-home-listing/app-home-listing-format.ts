export function showYear(show: AppShow) {
  return show.air_start?.slice(0, 4) || ''
}

export function showMeta(show: AppShow, extended = false) {
  const parts = [show.title_type === 'movie' ? 'Movie' : 'Series', showYear(show)]
  if (extended) {
    if (show.title_type === 'movie' && show.movie?.duration) {
      const minutes = Math.floor(show.movie.duration / 60)
      parts.push(
        minutes >= 60 ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m` : `${minutes}m`
      )
    } else if (show.title_type === 'series' && show.groups_count != null) {
      parts.push(`${show.groups_count} season${show.groups_count === 1 ? '' : 's'}`)
    }
  }
  return parts.filter(Boolean).join(' · ')
}

export function clockTime(seconds: number) {
  const time = Math.max(0, Math.floor(Number(seconds) || 0))
  const minutes = Math.floor(time / 60)
  return minutes >= 60
    ? `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}:${String(time % 60).padStart(2, '0')}`
    : `${minutes}:${String(time % 60).padStart(2, '0')}`
}

export function partyDetails(party: AppParty) {
  const video = party.video
  if (video?.show?.title_type === 'series') return [video.group?.title, video.title].filter(Boolean).join(' · ')
  return `Movie · ${clockTime(party.current_time)} of ${clockTime(video?.duration)}`
}

export function partyStatus(party: AppParty) {
  const active = party.members?.some((member) => Number(member.pivot?.is_active) === 1)
  if (active) return Number(party.is_playing) === 1 ? 'Watching now' : 'In the room'
  const timestamp = party.last_activity_at ?? ''
  const date = new Date(timestamp.includes(' ') ? timestamp.replace(' ', 'T') + 'Z' : timestamp).getTime()
  const minutes = Math.max(0, Math.floor((Date.now() - date) / 60_000))
  if (!Number.isFinite(minutes)) return 'Previously watched'
  if (minutes < 1) return 'Last watched just now'
  if (minutes < 60) return `Last watched ${minutes}m ago`
  if (minutes < 1440) return `Last watched ${Math.floor(minutes / 60)}h ago`
  if (minutes < 2880) return 'Last watched yesterday'
  return `Last watched ${Math.floor(minutes / 1440)} days ago`
}
