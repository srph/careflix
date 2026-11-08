import './style.css'
import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import InfiniteScroll from '~/components/InfiniteScroll'
import PageTitle from '~/components/PageTitle'
import ShowModal from '../ShowModal'
import { useCreatePartyMutation, useMyPartiesQuery, useShowsQuery, type ListingTab } from '../queries'
import FeaturedCarousel from '../Listing/FeaturedCarousel'
import ListingNavigation from '../Listing/ListingNavigation'
import PartySection from '../Listing/PartySection'
import ShowCard from '../Listing/ShowCard'
import { FeaturedPlaceholder, LoadMoreError, PartiesPlaceholder, ShowSkeletonCards, TitlesPlaceholder } from '../Listing/ListingStates'

export default function AuthHome() {
  const [tab, setTab] = useState<ListingTab>('all')
  const [selectedShow, setSelectedShow] = useState<AppShow | null>(null)
  const showsQuery = useShowsQuery(tab === 'movie' || tab === 'series' ? tab : undefined, tab !== 'parties')
  const partiesQuery = useMyPartiesQuery()
  const createParty = useCreatePartyMutation()
  const reduceMotion = useReducedMotion()
  const shows = useMemo(() => showsQuery.data?.pages.flatMap(page => page.data) ?? [], [showsQuery.data])
  const parties = useMemo(() => partiesQuery.data?.pages.flatMap(page => page.data) ?? [], [partiesQuery.data])
  const featured = useMemo(() => shows.slice(0, 5).map(show => ({ show })), [shows])
  const query = tab === 'parties' ? partiesQuery : showsQuery
  const items = tab === 'parties' ? parties : shows
  const title = tab === 'movie' ? 'Movies' : tab === 'series' ? 'Series' : 'All titles'
  const initialError = query.isError && !query.isFetching
  const partiesError = partiesQuery.isError && !partiesQuery.isFetching
  const showRecentParties = !partiesQuery.data || parties.length > 0

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
        {tab !== 'parties' && (!query.data ? <FeaturedPlaceholder error={initialError} onRetry={() => { void query.refetch() }} />
          : <FeaturedCarousel key={tab} items={featured} onDetails={setSelectedShow} onStart={start} isCreating={createParty.isPending} />)}
        <div className="listing-body">
          {createParty.isError && <div className="listing-status" role="alert">Unable to start the party. Please try again. <button type="button" onClick={() => createParty.reset()}>Dismiss</button></div>}
          {tab === 'all' && <AnimatePresence initial={false}>
            {showRecentParties && <motion.div key="recent-parties" className="listing-recent-parties" initial={false}
              exit={{ height: 0, opacity: 0, marginTop: 0, overflow: 'hidden' }} transition={{ duration: reduceMotion ? 0 : .45 }}>
              <div className="listing-recent-parties-content">
                {!partiesQuery.data ? <PartiesPlaceholder recent error={partiesError} onRetry={() => { void partiesQuery.refetch() }} />
                  : <PartySection parties={parties} recent onSeeAll={() => { setTab('parties'); window.scrollTo({ top: 0 }) }} />}
              </div>
            </motion.div>}
          </AnimatePresence>}
          {!query.data ? (tab === 'parties' ? <PartiesPlaceholder error={initialError} onRetry={() => { void query.refetch() }} /> : <TitlesPlaceholder title={title} error={initialError} />)
            : <InfiniteScroll key={tab} itemCount={items.length} hasMore={Boolean(query.hasNextPage)} isLoading={query.isFetching}
              onLoadMore={async () => { const result = await query.fetchNextPage(); if (result.isError) throw result.error }}
              renderError={retry => <LoadMoreError parties={tab === 'parties'} onRetry={retry} />}>
              {tab === 'parties' ? <PartySection parties={parties} isLoadingMore={partiesQuery.isFetchingNextPage} />
                : <section className="listing-section" aria-label={title}>
                  <div className="listing-section-heading"><h2>{title}</h2>{tab !== 'all' && <span>{showsQuery.data?.pages[0].total ?? shows.length}</span>}</div>
                  <div className="listing-show-grid">
                    {shows.map(show => <ShowCard key={show.id} show={show} onDetails={setSelectedShow} />)}
                    {showsQuery.isFetchingNextPage && <ShowSkeletonCards />}
                  </div>
                  {showsQuery.isFetchingNextPage && <span className="listing-loading-label" role="status">Loading more titles…</span>}
                  {!showsQuery.isPending && !shows.length && <p className="listing-empty">No {tab === 'all' ? 'titles' : tab === 'movie' ? 'movies' : 'series'} available yet.</p>}
                </section>}
            </InfiniteScroll>}
        </div>
      </main>
    </div>
    <ShowModal show={selectedShow} onClose={() => setSelectedShow(null)} onPlay={video => { if (!createParty.isPending) createParty.mutate(video) }} isCreating={createParty.isPending} createError={createParty.isError} />
  </div>
}
