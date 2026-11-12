import { UiButton } from '~/components/ui-button/ui-button'
import type { ComponentProps } from 'react'
import { UiSkeleton } from '~/components/ui-skeleton/ui-skeleton'
import { cn } from '~/utils/cn'
import {
  FEATURED,
  FEATURED_COPY,
  FEATURED_LIST,
  FEATURED_LIST_ITEM,
  FEATURED_STAGE,
  PARTY_BADGES,
  PARTY_CONTENT,
  PARTY_GRID,
  SECTION_HEADING,
  SECTION_TITLE,
  SHOW_GRID
} from './app-home-listing-classes'

/**
 * The listing's skeleton: a sheen that sweeps across every shape together, since they share one fixed gradient.
 * Inside a placeholder whose load failed (`data-frozen`), the shapes stop and go flat.
 */
function Skeleton({ className, ...props }: ComponentProps<typeof UiSkeleton>) {
  return (
    <UiSkeleton
      {...props}
      className={cn(
        'animate-sweep bg-[linear-gradient(100deg,var(--color-neutral-900)_30%,var(--color-neutral-800)_50%,var(--color-neutral-900)_70%)] bg-size-[200vw_100%] bg-fixed bg-no-repeat',
        'group-data-[frozen=true]/placeholder:animate-none group-data-[frozen=true]/placeholder:bg-neutral-900 group-data-[frozen=true]/placeholder:bg-none',
        className
      )}
    />
  )
}

const COPY = 'flex flex-col gap-2'

function RetryButton({
  onRetry,
  size,
  className,
  children = 'Retry'
}: {
  onRetry: () => void
  size?: 'm' | 'l'
  className?: string
  children?: string
}) {
  return (
    <UiButton type="button" size={size} className={className} onClick={onRetry}>
      <i className="fa fa-repeat" aria-hidden="true" />
      {children}
    </UiButton>
  )
}

function ErrorOverlay({ title, description, onRetry }: { title: string; description?: string; onRetry: () => void }) {
  return (
    <div
      role="alert"
      className="absolute inset-0 z-3 flex flex-col items-center justify-center gap-1.5 bg-radial-[closest-side] from-neutral-950/90 from-45% to-transparent p-5 text-center">
      <b className="text-lg">{title}</b>
      {description && <span className="text-sm text-neutral-300">{description}</span>}
      <RetryButton onRetry={onRetry} size="l" className="mt-3 flex-none">
        {description ? 'Try again' : 'Retry'}
      </RetryButton>
    </div>
  )
}

export function FeaturedPlaceholder({
  error,
  parties = false,
  onRetry
}: {
  error: boolean
  parties?: boolean
  onRetry: () => void
}) {
  return (
    <section
      data-frozen={error}
      className={`group/placeholder relative ${FEATURED}`}
      aria-label="Featured"
      aria-busy={!error}>
      {!error && (
        <span className="sr-only" role="status">
          Loading featured {parties ? 'parties' : 'titles'}…
        </span>
      )}
      <div className={FEATURED_STAGE}>
        <div className={`${FEATURED_COPY} ${COPY}`} aria-hidden="true">
          <Skeleton width={150} height={11} />
          <Skeleton className="mt-2.5 mb-3" width="62%" height={60} radius={8} />
          <Skeleton width="84%" height={13} />
          <Skeleton width="70%" height={13} />
          <div className="mt-4.5 flex flex-wrap gap-3">
            <Skeleton width={164} height={44} radius={24} />
            <Skeleton width={104} height={44} radius={24} />
          </div>
        </div>
        {error && (
          <ErrorOverlay
            title={parties ? "Your parties didn't load" : "Titles didn't load"}
            description="Check your connection, then try again."
            onRetry={onRetry}
          />
        )}
      </div>
      <ol className={FEATURED_LIST} aria-hidden="true">
        {[56, 48, 62, 44, 52].slice(0, parties ? 4 : 5).map((width, index) => (
          <li key={index} className={FEATURED_LIST_ITEM}>
            <div
              data-testid="featured-skeleton"
              className="flex flex-1 flex-col justify-center gap-2 rounded-xl bg-neutral-900 px-4.5 py-3">
              <Skeleton width={`${width}%`} height={13} />
              <Skeleton width="34%" height={10} />
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function PartySkeletonCards() {
  return (
    <>
      {[0, 1, 2].map((index) => (
        <div
          data-testid="party-skeleton"
          className="relative aspect-video min-w-0 rounded-xl bg-neutral-900 ring-1 ring-neutral-800"
          key={index}
          aria-hidden="true">
          <div className={PARTY_BADGES}>
            <Skeleton width={96} height={22} radius={99} />
            <Skeleton width={52} height={22} radius={99} />
          </div>
          <div className={`${PARTY_CONTENT} ${COPY}`}>
            <Skeleton width="52%" height={17} />
            <Skeleton width="36%" height={11} />
            <Skeleton className="mt-1" width="100%" height={3} />
            <div className="flex items-center gap-2.5">
              <Skeleton width={28} height={28} radius="50%" />
              <Skeleton className="-ml-3.5" width={28} height={28} radius="50%" />
              <Skeleton width="30%" height={10} />
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export function PartiesPlaceholder({
  recent = false,
  error = false,
  onRetry
}: {
  recent?: boolean
  error?: boolean
  onRetry?: () => void
}) {
  const title = recent ? 'Recent parties' : 'All parties'
  return (
    <section data-frozen={error} className="group/placeholder relative" aria-label={title} aria-busy={!error}>
      <div className={SECTION_HEADING}>
        <h2 className={SECTION_TITLE}>{title}</h2>
      </div>
      {!error && (
        <span className="sr-only" role="status">
          Loading {recent ? 'recent ' : ''}parties…
        </span>
      )}
      <div className="relative">
        <div className={PARTY_GRID}>
          <PartySkeletonCards />
        </div>
        {error && onRetry && <ErrorOverlay title="Your parties didn't load" onRetry={onRetry} />}
      </div>
    </section>
  )
}

export function ShowSkeletonCards() {
  return (
    <>
      {[68, 54, 74, 60, 48].map((width, index) => (
        <div data-testid="show-skeleton" className="flex min-w-0 flex-col gap-2" key={index} aria-hidden="true">
          <Skeleton className="mb-1 aspect-video h-auto w-full" radius={8} />
          <Skeleton width={`${width}%`} height={13} />
          <Skeleton width="36%" height={10} />
        </div>
      ))}
    </>
  )
}

export function TitlesPlaceholder({ title, error }: { title: string; error: boolean }) {
  return (
    <section
      data-testid="catalog-placeholder"
      data-frozen={error}
      className="group/placeholder relative data-[frozen=true]:mask-b-from-30%"
      aria-label={title}
      aria-busy={!error}>
      <div className={SECTION_HEADING}>
        <h2 className={SECTION_TITLE}>{title}</h2>
      </div>
      <div className={SHOW_GRID}>
        <ShowSkeletonCards />
      </div>
    </section>
  )
}

export function LoadMoreError({ parties, onRetry }: { parties: boolean; onRetry: () => void }) {
  return (
    <div
      data-testid="load-more-error"
      role="alert"
      className="mt-8.5 flex flex-wrap items-center justify-center gap-4 border-t border-neutral-800 pt-6.5 text-neutral-300">
      <span>Couldn't load more {parties ? 'parties' : 'titles'}.</span>
      <RetryButton onRetry={onRetry} />
    </div>
  )
}
