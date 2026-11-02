import './style.css'
import { useMemo, useState } from 'react'
import InfiniteScroll from '~/components/InfiniteScroll'
import PageTitle from '~/components/PageTitle'
import ShowModal from '../ShowModal'
import { useCreatePartyMutation, useMyPartiesQuery, useShowsQuery, type ListingTab } from '../queries'
import FeaturedCarousel from '../Listing/FeaturedCarousel'
import ListingNavigation from '../Listing/ListingNavigation'
import PartySection from '../Listing/PartySection'
import ShowCard from '../Listing/ShowCard'

export default function AuthHome() {
  const [tab, setTab] = useState<ListingTab>('all')
  const [selectedShow, setSelectedShow] = useState<AppShow | null>(null)
  const showsQuery = useShowsQuery(tab === 'movie' || tab === 'series' ? tab : undefined, tab !== 'parties')
  const partiesQuery = useMyPartiesQuery()
  const createParty = useCreatePartyMutation()
  const shows = useMemo(() => showsQuery.data?.pages.flatMap(page => page.data) ?? [], [showsQuery.data])
  const parties = useMemo(() => partiesQuery.data?.pages.flatMap(page => page.data) ?? [], [partiesQuery.data])
  const featured = useMemo(() => tab === 'parties'
    ? parties.slice(0, 4).map(party => ({ show: party.video.show, party }))
    : shows.slice(0, 5).map(show => ({ show })), [tab, shows, parties])
  const query = tab === 'parties' ? partiesQuery : showsQuery
  const items = tab === 'parties' ? parties : shows
  const title = tab === 'movie' ? 'Movies' : tab === 'series' ? 'Series' : 'All titles'

  function start(show: AppShow) {
    if (createParty.isPending) return
    if (show.title_type === 'movie' && show.movie) createParty.mutate(show.movie)
    else setSelectedShow(show)
  }

  return <div className="listing-home">
    <PageTitle title="Watch together" />
    <div className="listing-shell">
      <ListingNavigation tab={tab} onTabChange={setTab} onShowSelect={setSelectedShow} parties={parties} />
      <main id="listing-panel" role="tabpanel" aria-labelledby={`listing-tab-${tab}`} tabIndex={0}>
        {query.isPending && !items.length ? <div className="listing-featured-placeholder" role="status" aria-label="Loading featured titles" />
          : <FeaturedCarousel key={tab} items={featured} onDetails={setSelectedShow} onStart={start} isCreating={createParty.isPending} />}
        <div className="listing-body">
          {createParty.isError && <div className="listing-status" role="alert">Unable to start the party. Please try again. <button type="button" onClick={() => createParty.reset()}>Dismiss</button></div>}
          {tab === 'all' && <>
            {partiesQuery.isError && !parties.length ? <div className="listing-status" role="alert">Unable to load your parties. <button type="button" onClick={() => { void partiesQuery.refetch() }}>Retry</button></div>
              : partiesQuery.isPending ? <div className="listing-party-grid" role="status" aria-label="Loading recent parties">{[0, 1, 2].map(i => <div key={i} className="listing-card-placeholder" />)}</div>
              : <PartySection parties={parties} total={partiesQuery.data?.pages[0].total ?? parties.length} recent onSeeAll={() => { setTab('parties'); window.scrollTo({ top: 0 }) }} />}
          </>}
          {query.isError && !items.length ? <div className="listing-status" role="alert">Unable to load {tab === 'parties' ? 'your parties' : 'titles'}. <button type="button" onClick={() => { void query.refetch() }}>Retry</button></div>
            : <InfiniteScroll key={tab} itemCount={items.length} hasMore={Boolean(query.hasNextPage)} isLoading={query.isFetching}
              onLoadMore={async () => { const result = await query.fetchNextPage(); if (result.isError) throw result.error }}>
              {tab === 'parties' ? (partiesQuery.isPending ? <div className="listing-party-grid" role="status" aria-label="Loading parties">{[0, 1, 2].map(i => <div key={i} className="listing-card-placeholder" />)}</div>
                : <PartySection parties={parties} total={partiesQuery.data?.pages[0].total ?? parties.length} />)
                : <section className="listing-section" aria-label={title}>
                  <div className="listing-section-heading"><h2>{title}</h2><span>{showsQuery.data?.pages[0].total ?? shows.length}</span></div>
                  <div className="listing-show-grid">
                    {shows.map(show => <ShowCard key={show.id} show={show} onDetails={setSelectedShow} />)}
                    {showsQuery.isFetching && [0, 1, 2, 3, 4].map(i => <div className="listing-show-placeholder" key={i} aria-hidden="true" />)}
                  </div>
                  {!showsQuery.isPending && !shows.length && <p className="listing-empty">No {tab === 'all' ? 'titles' : tab === 'movie' ? 'movies' : 'series'} available yet.</p>}
                </section>}
            </InfiniteScroll>}
        </div>
      </main>
    </div>
    <ShowModal show={selectedShow} onClose={() => setSelectedShow(null)} onPlay={video => { if (!createParty.isPending) createParty.mutate(video) }} isCreating={createParty.isPending} createError={createParty.isError} />
  </div>
}
