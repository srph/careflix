import './style.css'
import { useState, type ReactNode } from 'react'
import { Tabs } from '@base-ui/react/tabs'
import UiModal from '~/components/UiModal'
import UiButton from '~/components/UiButton'
import UiPlainButton from '~/components/UiPlainButton'
import { useMediaMode } from '~/hooks/useMediaMode'
import { useMyPartiesQuery, useShowGroupsQuery } from '../queries'
import Artwork from '../Listing/Artwork'
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

export default function ShowModal(props: Props) {
  const media = useMediaMode()
  return <UiModal isOpen={Boolean(props.show)} onClose={props.onClose}
    shouldCloseOnOverlayClick={media === 'desktop'} ariaLabel={props.show?.title}
    overlayClassName="show-modal-overlay" modalClassName="show-modal">
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
    : groupsQuery.isError ? <p role="alert">Unable to load episodes. <button type="button" onClick={() => { void groupsQuery.refetch() }}>Retry</button></p>
    : !groups.some(group => group.videos.length) ? <p>No episodes available yet.</p> : null

  return <>
    <header className="show-modal-hero">
      <Artwork src={show.preview_image} eager />
      <UiPlainButton className="show-modal-close" onClick={onClose} aria-label="Close details"><i className="fa fa-close" aria-hidden="true" /></UiPlainButton>
      <div className="show-modal-heading">
        <h2>{show.title}</h2>
        <p className="show-modal-meta">{metadata}</p>
        <p className="show-modal-synopsis">{show.synopsis}</p>
        <div className="show-modal-actions">
          <UiButton variant="primary" size="l" glow disabled={isCreating || !video} onClick={() => { if (video) onPlay(video) }}>
            <i className={`fa ${isCreating ? 'fa-spinner fa-spin' : 'fa-play'}`} aria-hidden="true" />{isCreating ? 'Starting…' : 'Start Party'}
          </UiButton>
        </div>
        {!isSeries && !show.movie && <p className="show-modal-notice">This title is not available to play yet.</p>}
      </div>
    </header>
    <div className="show-modal-content" aria-busy={partiesQuery.isPending}>
      {createError && <p className="show-modal-status" role="alert">Unable to start the party. Please try again.</p>}
      {partiesQuery.isPending ? <DetailsLoading isSeries={isSeries} /> : <>
        {liveRoom && <LiveRoom party={liveRoom} />}
        {partiesQuery.isError && !parties.length && <div className="show-modal-status" role="alert">Unable to load your parties. <button type="button" onClick={() => { void partiesQuery.refetch() }}>Retry</button></div>}
        {tabs.length === 1 ? <div className="show-modal-pane"><Details show={show} groups={groups} groupsStatus={null} /></div>
          : <DetailTabs tabs={tabs}>
            {isSeries && <Tabs.Panel className="show-modal-pane" value="episodes">
              {groupsQuery.isPending ? <EpisodesLoading /> : <>
                {groupsStatus && <div className="show-modal-status">{groupsStatus}</div>}
                {groups.length > 0 && !groupsQuery.isError && <Episodes show={show} groups={groups} group={group} onGroupChange={setGroupId} onPlay={onPlay} isCreating={isCreating} />}
              </>}
            </Tabs.Panel>}
            {parties.length > 0 && <Tabs.Panel className="show-modal-pane" value="parties">
              <PartyHistory parties={parties} />
              {partiesQuery.isFetchNextPageError && <p className="show-modal-status" role="alert">Unable to load more parties. <button type="button" onClick={() => { void partiesQuery.fetchNextPage() }}>Retry</button></p>}
              {partiesQuery.hasNextPage && !partiesQuery.isFetchNextPageError && <div className="show-modal-more"><UiButton size="l" disabled={partiesQuery.isFetchingNextPage} onClick={() => { void partiesQuery.fetchNextPage() }}>{partiesQuery.isFetchingNextPage ? 'Loading…' : 'Load more parties'}</UiButton></div>}
            </Tabs.Panel>}
            <Tabs.Panel className="show-modal-pane" value="details">
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
  return <Tabs.Root className="show-modal-tab-content" value={tab} onValueChange={value => setSelectedTab(value as DetailTab)}>
    <Tabs.List className="show-modal-tabs" aria-label="Title details" activateOnFocus>
      {tabs.map(tab => <Tabs.Tab key={tab.value} value={tab.value}>{tab.label}</Tabs.Tab>)}
    </Tabs.List>
    {children}
  </Tabs.Root>
}
