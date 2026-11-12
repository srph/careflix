import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { InfiniteScroll } from '~/components/infinite-scroll/infinite-scroll'
import { PageTitle } from '~/components/page-title/page-title'
import { AppHomeShowModal } from './app-home-show-modal/app-home-show-modal'
import { useCreatePartyMutation, useMyPartiesQuery, useShowsQuery, type ListingTab } from './app-home-queries'
import { AppHomeListingFeaturedCarousel } from './app-home-listing/app-home-listing-featured-carousel'
import { AppHomeListingNav } from './app-home-listing/app-home-listing-nav'
import { AppHomeListingPartySection } from './app-home-listing/app-home-listing-party-section'
import { AppHomeListingShowCard } from './app-home-listing/app-home-listing-show-card'
import { FeaturedPlaceholder, LoadMoreError, PartiesPlaceholder, ShowSkeletonCards, TitlesPlaceholder } from './app-home-listing/app-home-listing-states'
import { SECTION_HEADING, SECTION_TITLE, SHOW_GRID } from './app-home-listing/app-home-listing-classes'

export function AppHomeAuth() {
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

  // Reduced motion stops everything on this screen, whatever the component.
  return <div className="min-h-screen overflow-x-clip bg-neutral-950 text-sm text-white antialiased motion-reduce:**:animate-none! motion-reduce:**:[transition:none]!">
    <PageTitle title="Watch together" />
    <div className="mx-auto max-w-400">
      <AppHomeListingNav tab={tab} onTabChange={setTab} onShowSelect={setSelectedShow} />
      <main id="listing-panel" role="tabpanel" aria-labelledby={`listing-tab-${tab}`} tabIndex={0} className="focus:outline-none">
        {tab !== 'parties' && (!query.data ? <FeaturedPlaceholder error={initialError} onRetry={() => { void query.refetch() }} />
          : <AppHomeListingFeaturedCarousel key={tab} items={featured} onDetails={setSelectedShow} onStart={start} isCreating={createParty.isPending} />)}
        <div className="px-5 pt-7 pb-15 sm:px-6 sm:pt-7.5 lg:px-10 lg:pt-9 lg:pb-20">
          {createParty.isError && <div role="alert" className="mb-8 rounded-xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-300 sm:mb-11">Unable to start the party. Please try again. <button type="button" className="cursor-pointer rounded-md border border-neutral-600 px-3 py-1.5 leading-[inherit] text-white" onClick={() => createParty.reset()}>Dismiss</button></div>}
          {tab === 'all' && <AnimatePresence initial={false}>
            {showRecentParties && <motion.div key="recent-parties" data-testid="recent-parties" initial={false}
              exit={{ height: 0, opacity: 0, overflow: 'hidden' }} transition={{ duration: reduceMotion ? 0 : .45 }}>
              {/* The gap under the section is padding, so it closes along with the section when the last party goes. */}
              <div className="pb-8 sm:pb-11">
                {!partiesQuery.data ? <PartiesPlaceholder recent error={partiesError} onRetry={() => { void partiesQuery.refetch() }} />
                  : <AppHomeListingPartySection parties={parties} recent onSeeAll={partiesQuery.data.pages[0].total >= 5 ? () => { setTab('parties'); window.scrollTo({ top: 0 }) } : undefined} />}
              </div>
            </motion.div>}
          </AnimatePresence>}
          {!query.data ? (tab === 'parties' ? <PartiesPlaceholder error={initialError} onRetry={() => { void query.refetch() }} /> : <TitlesPlaceholder title={title} error={initialError} />)
            : <InfiniteScroll key={tab} itemCount={items.length} hasMore={Boolean(query.hasNextPage)} isLoading={query.isFetching}
              onLoadMore={async () => { const result = await query.fetchNextPage(); if (result.isError) throw result.error }}
              renderError={retry => <LoadMoreError parties={tab === 'parties'} onRetry={retry} />}>
              {tab === 'parties' ? <AppHomeListingPartySection parties={parties} isLoadingMore={partiesQuery.isFetchingNextPage} />
                : <section aria-label={title}>
                  <div className={SECTION_HEADING}><h2 className={SECTION_TITLE}>{title}</h2>{tab !== 'all' && <span data-testid="section-count" className="font-label text-xs font-semibold text-neutral-400">{showsQuery.data?.pages[0].total ?? shows.length}</span>}</div>
                  <div className={SHOW_GRID}>
                    {shows.map(show => <AppHomeListingShowCard key={show.id} show={show} onDetails={setSelectedShow} />)}
                    {showsQuery.isFetchingNextPage && <ShowSkeletonCards />}
                  </div>
                  {showsQuery.isFetchingNextPage && <span className="sr-only" role="status">Loading more titles…</span>}
                  {!showsQuery.isPending && !shows.length && <p className="py-9 text-base text-neutral-400">No {tab === 'all' ? 'titles' : tab === 'movie' ? 'movies' : 'series'} available yet.</p>}
                </section>}
            </InfiniteScroll>}
        </div>
      </main>
    </div>
    <AppHomeShowModal show={selectedShow} onClose={() => setSelectedShow(null)} onPlay={video => { if (!createParty.isPending) createParty.mutate(video) }} isCreating={createParty.isPending} createError={createParty.isError} />
  </div>
}
