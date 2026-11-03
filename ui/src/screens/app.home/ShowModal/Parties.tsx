import { Link } from 'react-router'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import { useAuth } from '~/contexts/Auth'
import { partyStatus } from '../Listing/format'

function partyPosition(party: AppParty) {
  return party.video?.show?.title_type === 'series'
    ? [party.video.group?.title, party.video.title].filter(Boolean).join(' · ')
    : `${Math.floor((Number(party.current_time) || 0) / 60)} minutes in`
}

function usePartyMembers(party: AppParty) {
  const { data: user } = useAuth()
  const others = (party.members ?? []).filter(member => member.id !== user?.id)
  const self = (party.members ?? []).filter(member => member.id === user?.id)
  return { members: [...self, ...others], names: others.map(member => member.name).join(', ') }
}

export function LiveRoom({ party }: { party: AppParty }) {
  const { members, names } = usePartyMembers(party)
  return <div className="show-modal-live">
    <span className="show-modal-live-label"><i />Live</span>
    <UiAvatarGroup users={members} size="sm" />
    <p>Your room{names && <> with <b>{names}</b></>} <span className="show-modal-position">· {partyPosition(party)}</span></p>
    <Link className="show-modal-join" to={`/watch/${party.id}`} aria-label={`Join your room for ${party.video?.show?.title}`}>Join</Link>
  </div>
}

function PartyRow({ party }: { party: AppParty }) {
  const { members, names } = usePartyMembers(party)
  return <Link className="show-modal-party" to={`/watch/${party.id}`} aria-label={`Rejoin ${party.video?.show?.title}${names ? ` with ${names}` : ''}`}>
    <UiAvatarGroup users={members} size="sm" />
    <b className="show-modal-party-names">You{names && `, ${names}`}</b>
    <span className="show-modal-party-position">{partyPosition(party)}</span>
    <span className="show-modal-party-when">{partyStatus(party).replace(/^Last watched /, '')}</span>
    <i className="fa fa-angle-right" aria-hidden="true" />
  </Link>
}

export function PartyHistory({ parties }: { parties: AppParty[] }) {
  return <div className="show-modal-parties">{parties.map(party => <PartyRow key={party.id} party={party} />)}</div>
}
