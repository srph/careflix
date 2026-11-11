import UiButton from '~/components/UiButton'
import UiSkeleton from '~/components/UiSkeleton'

function RetryButton({ onRetry, size, children = 'Retry' }: { onRetry: () => void; size?: 'm' | 'l'; children?: string }) {
  return <UiButton type="button" size={size} onClick={onRetry}><i className="fa fa-repeat" aria-hidden="true" />{children}</UiButton>
}

function ErrorOverlay({ title, description, onRetry }: { title: string; description?: string; onRetry: () => void }) {
  return <div className="listing-error-overlay" role="alert">
    <b>{title}</b>
    {description && <span>{description}</span>}
    <RetryButton onRetry={onRetry} size="l">{description ? 'Try again' : 'Retry'}</RetryButton>
  </div>
}

export function FeaturedPlaceholder({ error, parties = false, onRetry }: { error: boolean; parties?: boolean; onRetry: () => void }) {
  return <section data-frozen={error} className={`listing-featured listing-placeholder${error ? ' is-frozen' : ''}`} aria-label="Featured" aria-busy={!error}>
    {!error && <span className="listing-loading-label" role="status">Loading featured {parties ? 'parties' : 'titles'}…</span>}
    <div className="listing-featured-stage">
      <div className="listing-featured-copy listing-skeleton-copy" aria-hidden="true">
        <UiSkeleton width={150} height={11} />
        <UiSkeleton className="listing-skeleton-title" width="62%" height={60} radius={8} />
        <UiSkeleton width="84%" height={13} />
        <UiSkeleton width="70%" height={13} />
        <div className="listing-skeleton-actions"><UiSkeleton width={164} height={44} radius={24} /><UiSkeleton width={104} height={44} radius={24} /></div>
      </div>
      {error && <ErrorOverlay title={parties ? "Your parties didn't load" : "Titles didn't load"} description="Check your connection, then try again." onRetry={onRetry} />}
    </div>
    <ol className="listing-featured-list" aria-hidden="true">
      {[56, 48, 62, 44, 52].slice(0, parties ? 4 : 5).map((width, index) => <li key={index}>
        <div data-testid="featured-skeleton" className="listing-skeleton-featured-item"><UiSkeleton width={`${width}%`} height={13} /><UiSkeleton width="34%" height={10} /></div>
      </li>)}
    </ol>
  </section>
}

export function PartySkeletonCards() {
  return <>{[0, 1, 2].map(index => <div data-testid="party-skeleton" className="listing-party-skeleton" key={index} aria-hidden="true">
    <div className="listing-party-badges"><UiSkeleton width={96} height={22} radius={99} /><UiSkeleton width={52} height={22} radius={99} /></div>
    <div className="listing-party-content listing-skeleton-copy">
      <UiSkeleton width="52%" height={17} /><UiSkeleton width="36%" height={11} />
      <UiSkeleton className="listing-skeleton-progress" width="100%" height={3} />
      <div className="listing-skeleton-members"><UiSkeleton width={28} height={28} radius="50%" /><UiSkeleton width={28} height={28} radius="50%" /><UiSkeleton width="30%" height={10} /></div>
    </div>
  </div>)}</>
}

export function PartiesPlaceholder({ recent = false, error = false, onRetry }: { recent?: boolean; error?: boolean; onRetry?: () => void }) {
  const title = recent ? 'Recent parties' : 'All parties'
  return <section data-frozen={error} className={`listing-section listing-placeholder${error ? ' is-frozen' : ''}`} aria-label={title} aria-busy={!error}>
    <div className="listing-section-heading"><h2>{title}</h2></div>
    {!error && <span className="listing-loading-label" role="status">Loading {recent ? 'recent ' : ''}parties…</span>}
    <div className="listing-party-placeholder">
      <div className="listing-party-grid"><PartySkeletonCards /></div>
      {error && onRetry && <ErrorOverlay title="Your parties didn't load" onRetry={onRetry} />}
    </div>
  </section>
}

export function ShowSkeletonCards() {
  return <>{[68, 54, 74, 60, 48].map((width, index) => <div data-testid="show-skeleton" className="listing-show-skeleton" key={index} aria-hidden="true">
    <UiSkeleton className="listing-skeleton-thumbnail" radius={10} />
    <UiSkeleton width={`${width}%`} height={13} />
    <UiSkeleton width="36%" height={10} />
  </div>)}</>
}

export function TitlesPlaceholder({ title, error }: { title: string; error: boolean }) {
  return <section data-testid="catalog-placeholder" data-frozen={error} className={`listing-section listing-placeholder listing-catalog-placeholder${error ? ' is-frozen' : ''}`} aria-label={title} aria-busy={!error}>
    <div className="listing-section-heading"><h2>{title}</h2></div>
    <div className="listing-show-grid"><ShowSkeletonCards /></div>
  </section>
}

export function LoadMoreError({ parties, onRetry }: { parties: boolean; onRetry: () => void }) {
  return <div data-testid="load-more-error" className="listing-load-more-error" role="alert">
    <span>Couldn't load more {parties ? 'parties' : 'titles'}.</span><RetryButton onRetry={onRetry} />
  </div>
}
