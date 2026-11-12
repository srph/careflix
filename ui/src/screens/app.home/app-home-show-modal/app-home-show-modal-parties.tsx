import { Link } from 'react-router'
import { UiAvatarGroup } from '~/components/ui-avatar-group/ui-avatar-group'
import { useAuth } from '~/contexts/auth/auth'
import { cn } from '~/utils/cn'
import { partyStatus } from '../app-home-listing/app-home-listing-format'
import { PARTY_ROW_LINE } from './app-home-show-modal-classes'

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

/** Small overlapping faces with no presence dot. `border` is the colour of whatever they sit on. */
function Faces({ members, className, border = 'border-neutral-900' }: { members: AppPartyMember[]; className?: string; border?: string }) {
  return <UiAvatarGroup users={members} size="sm" className={cn('flex-none', className)} itemClassName={cn('rounded-full border-2 not-last:-mr-2.25', border)} avatarClassName="size-6 text-10" statusClassName="hidden" />
}

export function LiveRoom({ party }: { party: AppParty }) {
  const { members, names } = usePartyMembers(party)
  return <div data-testid="live-room" className="flex min-h-14 shrink-0 flex-wrap items-center gap-2.5 border-y border-neutral-700 bg-neutral-800 px-6 py-3.5 text-sm text-neutral-300 sm:flex-nowrap sm:gap-3 sm:py-2.5 sm:pr-5 sm:pl-9">
    <span className="inline-flex flex-none items-center gap-1.75 font-label text-10 leading-none font-bold tracking-label text-rose-400 uppercase"><i className="size-1.75 rounded-full bg-rose-500 ring-4 ring-rose-500/18" />Live</span>
    <Faces members={members} border="border-neutral-800" />
    {/* On phones the sentence drops to its own line under the faces and the button. */}
    <p className="order-1 min-w-0 grow basis-full wrap-anywhere sm:order-none sm:basis-0">Your room{names && <> with <b className="font-semibold text-white">{names}</b></>} <span className="text-xs text-neutral-400">· {partyPosition(party)}</span></p>
    <Link to={`/watch/${party.id}`} aria-label={`Join your room for ${party.video?.show?.title}`}
      className="ml-auto inline-flex h-8.5 flex-none items-center justify-center rounded-full bg-white px-4 font-label text-11 leading-none font-bold tracking-label text-neutral-950 uppercase hover:bg-neutral-200">Join</Link>
  </div>
}

function PartyRow({ party }: { party: AppParty }) {
  const { members, names } = usePartyMembers(party)
  // Phones stack the three lines of text between the faces and the arrow; from `sm` everything sits on one line.
  return <Link data-testid="party-row" to={`/watch/${party.id}`} aria-label={`Rejoin ${party.video?.show?.title}${names ? ` with ${names}` : ''}`}
    className={`grid grid-cols-[64px_minmax(0,1fr)_12px] items-center gap-x-3 gap-y-1 rounded-lg py-3.5 hover:bg-neutral-800 hover:shadow-none! sm:grid-cols-[88px_minmax(0,1fr)_minmax(0,auto)_110px_16px] sm:gap-4 sm:px-2.5 [:hover+&]:shadow-none! ${PARTY_ROW_LINE}`}>
    <Faces members={members} className="row-span-3 sm:row-span-1" />
    <b className="col-start-2 truncate text-sm font-semibold sm:col-start-auto">You{names && `, ${names}`}</b>
    <span className="col-start-2 text-xs text-neutral-400 sm:col-start-auto">{partyPosition(party)}</span>
    <span className="col-start-2 text-xs text-neutral-400 sm:col-start-auto sm:text-right">{partyStatus(party).replace(/^Last watched /, '')}</span>
    <i className="fa fa-angle-right col-start-3 row-span-3 row-start-1 text-neutral-400 sm:col-start-auto sm:row-span-1 sm:row-start-auto" aria-hidden="true" />
  </Link>
}

export function PartyHistory({ parties }: { parties: AppParty[] }) {
  return <div>{parties.map(party => <PartyRow key={party.id} party={party} />)}</div>
}
