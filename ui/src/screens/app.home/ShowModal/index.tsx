import { useState, type ReactNode } from 'react'
import { Tabs } from '@base-ui/react/tabs'
import { UiModal } from '~/components/ui-modal/ui-modal'
import { UiButton } from '~/components/ui-button/ui-button'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { useMediaMode } from '~/hooks/useMediaMode'
import { useMyPartiesQuery, useShowGroupsQuery } from '../queries'
import Artwork from '../Listing/Artwork'
import { PANE, STATUS, STATUS_BAND, TAB_BAR, TAB_COLUMN, TEXT_BUTTON } from './classes'
import Details from './Details'
import Episodes from './Episodes'
import { LiveRoom, PartyHistory } from './Parties'
import { airYears, duration } from './format'
import { DetailsLoading, EpisodesLoading } from './Loading'

interface Props {
  show: AppShow | null
  onClose: () => void
  onPlay: (video: AppShowVideo) => void
  isCreating?: boolean
  createError?: boolean
}

type DetailTab = 'episodes' | 'parties' | 'details'

// A full-screen page on phones; from `sm` a sheet with a margin, half the window wide from `lg`. It rises into place as it fades in.
const SHEET = 'min-h-dvh w-full overflow-hidden bg-neutral-900 p-0 text-sm text-white antialiased shadow-modal transition-[translate,scale,opacity] duration-[.3s,.3s,.2s] data-ending-style:translate-y-5.5 data-ending-style:scale-97 data-starting-style:translate-y-5.5 data-starting-style:scale-97 sm:mx-auto sm:my-11 sm:min-h-0 sm:w-[calc(100%-48px)] sm:max-w-220 sm:rounded-2xl lg:w-1/2 motion-reduce:translate-none! motion-reduce:scale-none! motion-reduce:[transition:none] motion-reduce:**:animate-none! motion-reduce:**:[transition:none]!'
const SCRIM = 'bg-neutral-950/80 [scrollbar-color:var(--color-neutral-700)_transparent] [scrollbar-width:thin]'
const SHADE = 'pointer-events-none absolute inset-0'
const TAB = 'relative cursor-pointer py-4.25 text-sm font-medium text-neutral-400 hover:text-white aria-selected:text-white aria-selected:after:absolute aria-selected:after:inset-x-0 aria-selected:after:bottom-0 aria-selected:after:h-0.5 aria-selected:after:rounded-full aria-selected:after:bg-pink-500'

export default function ShowModal(props: Props) {
  const media = useMediaMode()
  return <UiModal isOpen={Boolean(props.show)} onClose={props.onClose}
    shouldCloseOnOverlayClick={media === 'desktop'} ariaLabel={props.show?.title}
    overlayClassName={SCRIM} modalClassName={SHEET}>
    {() => <ShowDetails key={props.show.id} {...props} show={props.show} />}
  </UiModal>
}

function ShowDetails({ show, onClose, onPlay, isCreating, createError }: Props & { show: AppShow }) {
  const groupsQuery = useShowGroupsQuery(show)
  const partiesQuery = useMyPartiesQuery(show)
  const [groupId, setGroupId] = useState<AppId | null>(null)
  const groups = groupsQuery.data ?? []
  const group = groups.find(group => group.id === groupId) ?? groups[0]
  const parties = partiesQuery.data?.pages.flatMap(page => page.data) ?? []
  const liveRoom = parties.find(party => party.members?.some(member => Number(member.pivot?.is_active) === 1))
  const isSeries = show.title_type === 'series'
  const tabs: { value: DetailTab; label: string }[] = [
    ...(isSeries ? [{ value: 'episodes' as const, label: 'Episodes' }] : []),
    ...(parties.length ? [{ value: 'parties' as const, label: 'Parties' }] : []),
    { value: 'details', label: 'Details' },
  ]
  const video = isSeries ? group?.videos[0] : show.movie
  const seasonCount = groupsQuery.data ? groups.length : show.groups_count
  const metadata = [isSeries ? 'Series' : 'Movie', airYears(show), isSeries
    ? seasonCount != null && `${seasonCount} season${seasonCount === 1 ? '' : 's'}`
    : show.movie?.duration && duration(show.movie.duration)].filter(Boolean).join(' · ')
  const groupsStatus = groupsQuery.isPending ? <p role="status">Loading episodes…</p>
    : groupsQuery.isError ? <p role="alert">Unable to load episodes. <button type="button" className={TEXT_BUTTON} onClick={() => { void groupsQuery.refetch() }}>Retry</button></p>
    : !groups.some(group => group.videos.length) ? <p>No episodes available yet.</p> : null

  return <>
    <header className="relative flex min-h-95 items-end sm:min-h-100">
      <Artwork src={show.preview_image} eager />
      {/* The artwork fades into the sheet: upwards on phones, and from the left as well from `sm`. */}
      <div className={`${SHADE} hidden bg-linear-to-t from-neutral-900/90 to-transparent to-40% sm:block`} />
      <div className={`${SHADE} bg-linear-to-t from-neutral-900 from-2% via-neutral-900/70 via-62% to-neutral-900/20 sm:bg-linear-to-r sm:from-8% sm:via-neutral-900/55 sm:via-46% sm:to-transparent sm:to-75%`} />
      <UiPlainButton className="absolute top-4.5 right-4.5 z-2 grid size-9 place-items-center rounded-full bg-neutral-950/66 text-white backdrop-blur-sm hover:bg-neutral-950/90" onClick={onClose} aria-label="Close details"><i className="fa fa-close" aria-hidden="true" /></UiPlainButton>
      <div data-testid="show-heading" className="relative z-1 w-full px-6 pt-20 pb-7 sm:max-w-120 sm:px-9 sm:pt-16 sm:pb-7.5">
        <h2 className="text-4xl/[1.02] font-bold tracking-tight wrap-anywhere sm:text-[40px]">{show.title}</h2>
        <p className="mt-2.5 font-label text-11 font-semibold tracking-label text-white/50 uppercase">{metadata}</p>
        <p className="mt-3.5 text-sm/relaxed text-white/80">{show.synopsis}</p>
        <div className="mt-4.5 flex items-center gap-2.5">
          <UiButton variant="primary" size="l" glow disabled={isCreating || !video} onClick={() => { if (video) onPlay(video) }}>
            <i className={`fa ${isCreating ? 'fa-spinner fa-spin' : 'fa-play'}`} aria-hidden="true" />{isCreating ? 'Starting…' : 'Start Party'}
          </UiButton>
        </div>
        {!isSeries && !show.movie && <p className="mt-3.5">This title is not available to play yet.</p>}
      </div>
    </header>
    <div className="flex h-[max(430px,calc(100dvh-380px))] flex-col sm:h-107.5" aria-busy={partiesQuery.isPending}>
      {createError && <p className={STATUS_BAND} role="alert">Unable to start the party. Please try again.</p>}
      {partiesQuery.isPending ? <DetailsLoading isSeries={isSeries} /> : <>
        {liveRoom && <LiveRoom party={liveRoom} />}
        {partiesQuery.isError && !parties.length && <div className={STATUS_BAND} role="alert">Unable to load your parties. <button type="button" className={TEXT_BUTTON} onClick={() => { void partiesQuery.refetch() }}>Retry</button></div>}
        {tabs.length === 1 ? <div className={PANE}><Details show={show} groups={groups} groupsStatus={null} /></div>
          : <DetailTabs tabs={tabs}>
            {isSeries && <Tabs.Panel className={PANE} value="episodes">
              {groupsQuery.isPending ? <EpisodesLoading /> : <>
                {groupsStatus && <div className={STATUS}>{groupsStatus}</div>}
                {groups.length > 0 && !groupsQuery.isError && <Episodes show={show} groups={groups} group={group} onGroupChange={setGroupId} onPlay={onPlay} isCreating={isCreating} />}
              </>}
            </Tabs.Panel>}
            {parties.length > 0 && <Tabs.Panel className={PANE} value="parties">
              <PartyHistory parties={parties} />
              {partiesQuery.isFetchNextPageError && <p className={STATUS} role="alert">Unable to load more parties. <button type="button" className={TEXT_BUTTON} onClick={() => { void partiesQuery.fetchNextPage() }}>Retry</button></p>}
              {partiesQuery.hasNextPage && !partiesQuery.isFetchNextPageError && <div className="mt-5"><UiButton size="l" disabled={partiesQuery.isFetchingNextPage} onClick={() => { void partiesQuery.fetchNextPage() }}>{partiesQuery.isFetchingNextPage ? 'Loading…' : 'Load more parties'}</UiButton></div>}
            </Tabs.Panel>}
            <Tabs.Panel className={PANE} value="details">
              <Details show={show} groups={groups} groupsLoading={isSeries && groupsQuery.isPending} groupsStatus={isSeries ? groupsStatus : null} />
            </Tabs.Panel>
          </DetailTabs>}
      </>}
    </div>
  </>
}

function DetailTabs({ tabs, children }: { tabs: { value: DetailTab; label: string }[]; children: ReactNode }) {
  const [selectedTab, setSelectedTab] = useState<DetailTab>(tabs[0].value)
  const tab = tabs.some(tab => tab.value === selectedTab) ? selectedTab : tabs[0].value
  return <Tabs.Root className={TAB_COLUMN} value={tab} onValueChange={value => setSelectedTab(value as DetailTab)}>
    <Tabs.List className={`${TAB_BAR} gap-6.5 sm:gap-7`} aria-label="Title details" activateOnFocus>
      {tabs.map(tab => <Tabs.Tab className={TAB} key={tab.value} value={tab.value}>{tab.label}</Tabs.Tab>)}
    </Tabs.List>
    {children}
  </Tabs.Root>
}
