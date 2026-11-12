import { Link } from 'react-router'
import type { CSSProperties } from 'react'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import { useAuth } from '~/contexts/Auth'
import Artwork from './Artwork'
import { PARTY_BADGES, PARTY_CONTENT, PROGRESS } from './classes'
import { partyDetails, partyStatus } from './format'

const BADGE = 'max-w-full rounded-full bg-neutral-950/85 px-2.25 py-1.25 font-label text-10/3 font-bold tracking-label uppercase'

export default function PartyCard({ party, style }: { party: AppParty; style?: CSSProperties }) {
  const { data: user } = useAuth()
  const show = party.video.show
  const others = (party.members ?? []).filter(member => member.id !== user?.id)
  const names = others.length ? others.map(member => member.name).join(', ') : 'Just you'
  const progress = Math.min(100, Math.max(0, party.video.duration ? Number(party.current_time) / party.video.duration * 100 : 0))
  const active = party.members?.some(member => Number(member.pivot?.is_active) === 1)
  // White on hover is intentional; keyboard focus uses the pink ring, and wins when both apply.
  return <Link data-testid="party-card" style={style} to={`/watch/${party.id}`} aria-label={`Rejoin ${show.title}`}
    className="group relative block aspect-video min-w-0 overflow-hidden rounded-xl ring-1 ring-neutral-800 outline-2 outline-offset-4 outline-transparent transition-[outline-color,transform] duration-[.25s,.3s] hover:z-4 hover:shadow-[0_20px_40px_-24px_#000] hover:ring-0 hover:outline-white focus-visible:shadow-[0_20px_40px_-24px_#000] focus-visible:ring-0 focus-visible:outline-pink-700">
    <Artwork src={party.video.preview_image || show.preview_image} />
    <div className="absolute inset-0 bg-linear-to-t from-neutral-950/96 from-18% to-neutral-950/8 to-95%" />
    <div className={PARTY_BADGES}><span className={BADGE}>{active && <i className="mr-1.25 inline-block size-1.5 rounded-full bg-pink-500" />} {partyStatus(party)}</span><span className={BADGE}>{show.title_type === 'movie' ? 'Movie' : 'Series'}</span></div>
    <div className={PARTY_CONTENT}>
      <h3 className="truncate text-lg font-bold">{show.title}</h3><p className="mt-px mb-2.25 truncate text-xs text-white/70">{partyDetails(party)}</p>
      <div className={`mb-2.25 h-0.75 ${PROGRESS}`} role="progressbar" aria-label="Playback progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><i style={{ width: `${progress}%` }} /></div>
      <div className="flex items-center gap-2.5">
        <UiAvatarGroup users={party.members ?? []} size="sm" className="flex-none" itemClassName="rounded-full border-2 border-neutral-950 not-last:-mr-1.75" avatarClassName="size-7 text-11" />
        <span className="min-w-0 truncate text-xs text-white/70">{names}</span>
        <span className="ml-auto flex-none text-xs text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true">Rejoin <i className="fa fa-arrow-right" /></span>
      </div>
    </div>
  </Link>
}
