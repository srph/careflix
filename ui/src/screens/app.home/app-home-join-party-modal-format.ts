import { clockTime } from './app-home-listing/app-home-listing-format'

export function previewStatus(party: AppPartyPreview) {
  if (party.is_member) return 'You’re already in this party'
  if (party.video.show.title_type === 'series')
    return [party.video.group?.title, party.video.title].filter(Boolean).join(' · ')
  const active = party.members.some((member) => member.pivot.is_active)
  if (!active) {
    const elapsed = Date.now() - new Date(party.last_activity_at).getTime()
    if (!Number.isFinite(elapsed)) return 'Previously watched'
    const days = Math.max(0, Math.floor(elapsed / 86_400_000))
    if (days >= 30) {
      const months = Math.floor(days / 30)
      return `Last watched ${months} month${months === 1 ? '' : 's'} ago`
    }
    if (days >= 1) return days === 1 ? 'Last watched yesterday' : `Last watched ${days} days ago`
    return 'Last watched today'
  }
  if (!party.current_time && !party.is_playing) return 'Hasn’t started yet'
  return `${party.is_playing ? 'Watching now ·' : 'Paused at'} ${clockTime(party.current_time)} of ${clockTime(party.video.duration)}`
}

export function presentMembers(members: Array<{ name: string }>) {
  if (!members.length) return 'No one’s here right now'
  if (members.length === 1) return `${members[0].name} is here`
  if (members.length === 2) return `${members[0].name} and ${members[1].name} are here`
  if (members.length === 3) return `${members[0].name}, ${members[1].name} and ${members[2].name} are here`
  return `${members[0].name}, ${members[1].name} and ${members.length - 2} others are here`
}
