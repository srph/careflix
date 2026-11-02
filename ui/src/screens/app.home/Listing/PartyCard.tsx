import { Link } from 'react-router'
import type { CSSProperties } from 'react'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import { useAuth } from '~/contexts/Auth'
import Artwork from './Artwork'
import { partyDetails, partyStatus } from './format'

export default function PartyCard({ party, style }: { party: AppParty; style?: CSSProperties }) {
  const { data: user } = useAuth()
  const show = party.video.show
  const others = (party.members ?? []).filter(member => member.id !== user?.id)
  const names = others.length ? others.map(member => member.name).join(', ') : 'Just you'
  const progress = Math.min(100, Math.max(0, party.video.duration ? Number(party.current_time) / party.video.duration * 100 : 0))
  const active = party.members?.some(member => Number(member.pivot?.is_active) === 1)
  return <Link className="listing-party-card" style={style} to={`/watch/${party.id}`} aria-label={`Rejoin ${show.title}`}>
    <Artwork src={party.video.preview_image || show.preview_image} />
    <div className="listing-party-shade" />
    <div className="listing-party-badges"><span className={active ? 'is-live' : ''}>{active && <i />} {partyStatus(party)}</span><span>{show.title_type === 'movie' ? 'Movie' : 'Series'}</span></div>
    <div className="listing-party-content">
      <h3>{show.title}</h3><p>{partyDetails(party)}</p>
      <div className="listing-party-progress" role="progressbar" aria-label="Playback progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><i style={{ width: `${progress}%` }} /></div>
      <div className="listing-party-members"><UiAvatarGroup users={party.members ?? []} size="sm" /><span>{names}</span><span className="listing-party-join" aria-hidden="true">Rejoin <i className="fa fa-arrow-right" /></span></div>
    </div>
  </Link>
}
