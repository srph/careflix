import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { UiButton } from '~/components/ui-button/ui-button'
import { UiAvatarGroup } from '~/components/ui-avatar-group/ui-avatar-group'
import { AppHomeListingArtwork } from './app-home-listing-artwork'
import { cn } from '~/utils/cn'
import {
  FEATURED,
  FEATURED_COPY,
  FEATURED_LIST,
  FEATURED_LIST_ITEM,
  FEATURED_STAGE,
  PROGRESS
} from './app-home-listing-classes'
import { clockTime, partyDetails, partyStatus, showMeta } from './app-home-listing-format'

export interface FeaturedItem {
  show: AppShow
  party?: AppParty
}

export function AppHomeListingFeaturedCarousel({
  items,
  onDetails,
  onStart,
  isCreating
}: {
  items: FeaturedItem[]
  onDetails: (show: AppShow) => void
  onStart: (show: AppShow) => void
  isCreating: boolean
}) {
  const [active, setActive] = useState(0)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [stopped, setStopped] = useState(false)
  const reduceMotion = useReducedMotion()
  const paused = hovered || focused || stopped || reduceMotion
  const index = Math.min(active, items.length - 1)

  useEffect(() => {
    if (paused || items.length < 2) return
    const timer = setTimeout(() => setActive((index + 1) % items.length), 6000)
    return () => clearTimeout(timer)
  }, [index, items.length, paused])

  if (!items.length) return null
  return (
    <section
      className={FEATURED}
      aria-label="Featured"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false)
      }}>
      <div className={FEATURED_STAGE}>
        {items.map(({ show, party }, position) => (
          <article
            key={party?.id ?? show.id}
            className={cn(
              'absolute inset-0 transition-opacity duration-700',
              position === index ? 'opacity-100' : 'pointer-events-none opacity-0'
            )}
            aria-hidden={position !== index}
            inert={position !== index}
            aria-label={`${position + 1} of ${items.length}: ${show.title}`}
            aria-roledescription="slide">
            {/* The picture eases back from a slight zoom while its slide is showing. */}
            <AppHomeListingArtwork
              src={party?.video.preview_image || show.preview_image}
              eager
              className={cn(
                'transition-[scale] duration-[6s] ease-out',
                position === index ? 'scale-100' : 'scale-104'
              )}
            />
            <div className="absolute inset-0 bg-linear-to-r from-neutral-950/70 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-neutral-950/92 to-neutral-950/6 to-95%" />
            <div className={FEATURED_COPY}>
              <div className="font-label text-10 font-semibold tracking-label text-white/78 uppercase sm:text-xs">
                {party ? partyStatus(party) : showMeta(show, true)}
              </div>
              <h1 className="mt-3.5 mb-3 text-[clamp(40px,11vw,60px)] leading-[.98] font-extrabold tracking-tight wrap-anywhere sm:text-[44px] lg:text-[54px] xl:text-[clamp(40px,5.3vw,76px)]">
                {show.title}
              </h1>
              <p className="mb-5.5 line-clamp-3 max-w-110 text-sm text-white/80 sm:text-base">
                {party
                  ? `${partyDetails(party)}${show.title_type === 'series' ? ` · ${clockTime(party.current_time)} in` : ''}`
                  : show.synopsis}
              </p>
              {party && (
                <div
                  className={`mb-5 h-1 max-w-85 ${PROGRESS}`}
                  role="progressbar"
                  aria-label="Featured playback progress"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(
                    Math.max(
                      0,
                      Math.min(100, party.video.duration ? (party.current_time / party.video.duration) * 100 : 0)
                    )
                  )}>
                  <i
                    style={{
                      width: `${Math.max(0, Math.min(100, party.video.duration ? (party.current_time / party.video.duration) * 100 : 0))}%`
                    }}
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {party ? (
                  <UiButton link to={`/watch/${party.id}`} variant="primary" size="l">
                    <i className="fa fa-play" aria-hidden="true" /> Rejoin party
                  </UiButton>
                ) : (
                  <>
                    <UiButton variant="primary" size="l" disabled={isCreating} onClick={() => onStart(show)}>
                      <i className="fa fa-play" aria-hidden="true" /> {isCreating ? 'Starting…' : 'Start a party'}
                    </UiButton>
                    <UiButton size="l" onArt onClick={() => onDetails(show)}>
                      Details
                    </UiButton>
                  </>
                )}
                {party && <UiAvatarGroup users={party.members ?? []} size="sm" avatarClassName="size-7.5 text-11" />}
              </div>
            </div>
          </article>
        ))}
        {items.length > 1 && (
          <button
            type="button"
            className="absolute top-3.5 right-3.5 z-2 grid size-8 cursor-pointer place-items-center rounded-full border border-white/25 bg-neutral-950/47 text-white"
            aria-label={stopped ? 'Play slideshow' : 'Pause slideshow'}
            onClick={() => setStopped(!stopped)}>
            <i className={`fa fa-${stopped ? 'play' : 'pause'}`} aria-hidden="true" />
          </button>
        )}
      </div>
      <ol className={FEATURED_LIST} aria-label="Choose a featured title">
        {items.map(({ show, party }, position) => (
          <li key={party?.id ?? show.id} className={FEATURED_LIST_ITEM}>
            <button
              type="button"
              className="group relative flex flex-1 cursor-pointer items-center overflow-hidden rounded-xl bg-neutral-900 p-3 text-left text-white hover:bg-neutral-800 aria-[current=true]:bg-neutral-800 sm:px-4.5 sm:py-0"
              aria-current={index === position ? 'true' : undefined}
              onClick={() => setActive(position)}>
              {/* A faded slice of the picture on the right of each row. */}
              <AppHomeListingArtwork
                src={party?.video.preview_image || show.preview_image}
                eager
                className="top-1/2 right-0 left-auto aspect-video h-auto w-[64%] -translate-y-1/2 scale-106 [mask-image:linear-gradient(90deg,transparent,#0007_42%,#000)] opacity-26 transition-[opacity,scale] duration-[.5s,1s] group-hover:opacity-38 group-aria-[current=true]:scale-100 group-aria-[current=true]:opacity-52"
              />
              <span className="relative min-w-0">
                <b className="block text-13 font-bold sm:text-base">{show.title}</b>
                <small className="mt-0.5 block text-10 text-neutral-400 sm:text-xs">
                  {party ? partyStatus(party) : showMeta(show, true)}
                </small>
              </span>
              {position === index && (
                <i
                  key={`${position}-${Boolean(paused)}`}
                  className={cn('absolute bottom-0 left-0 h-0.5 bg-pink-500', paused ? 'w-full' : 'animate-fill')}
                  aria-hidden="true"
                />
              )}
            </button>
          </li>
        ))}
      </ol>
    </section>
  )
}
