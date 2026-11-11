import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import UiButton from '~/components/UiButton'
import UiAvatarGroup from '~/components/UiAvatarGroup'
import Artwork from './Artwork'
import { clockTime, partyDetails, partyStatus, showMeta } from './format'

export interface FeaturedItem { show: AppShow; party?: AppParty }

export default function FeaturedCarousel({ items, onDetails, onStart, isCreating }: {
  items: FeaturedItem[]; onDetails: (show: AppShow) => void; onStart: (show: AppShow) => void; isCreating: boolean
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
  return <section className="listing-featured" aria-label="Featured" aria-roledescription="carousel"
    onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false) }}>
    <div className="listing-featured-stage">
      {items.map(({ show, party }, position) => <article key={party?.id ?? show.id} className={`listing-featured-slide ${position === index ? 'is-active' : ''}`}
        aria-hidden={position !== index} inert={position !== index} aria-label={`${position + 1} of ${items.length}: ${show.title}`} aria-roledescription="slide">
        <Artwork src={party?.video.preview_image || show.preview_image} eager />
        <div className="listing-featured-shade" />
        <div className="listing-featured-copy">
          <div className="listing-featured-meta">{party ? partyStatus(party) : showMeta(show, true)}</div>
          <h1>{show.title}</h1>
          <p>{party ? `${partyDetails(party)}${show.title_type === 'series' ? ` · ${clockTime(party.current_time)} in` : ''}` : show.synopsis}</p>
          {party && <div className="listing-party-progress" role="progressbar" aria-label="Featured playback progress" aria-valuemin={0} aria-valuemax={100}
            aria-valuenow={Math.round(Math.max(0, Math.min(100, party.video.duration ? party.current_time / party.video.duration * 100 : 0)))}>
            <i style={{ width: `${Math.max(0, Math.min(100, party.video.duration ? party.current_time / party.video.duration * 100 : 0))}%` }} />
          </div>}
          <div className="listing-featured-actions">
            {party ? <UiButton link to={`/watch/${party.id}`} variant="primary" size="l"><i className="fa fa-play" aria-hidden="true" /> Rejoin party</UiButton>
              : <><UiButton variant="primary" size="l" disabled={isCreating} onClick={() => onStart(show)}><i className="fa fa-play" aria-hidden="true" /> {isCreating ? 'Starting…' : 'Start a party'}</UiButton>
                <UiButton size="l" onArt onClick={() => onDetails(show)}>Details</UiButton></>}
            {party && <UiAvatarGroup users={party.members ?? []} size="sm" />}
          </div>
        </div>
      </article>)}
      {items.length > 1 && <button type="button" className="listing-carousel-toggle" aria-label={stopped ? 'Play slideshow' : 'Pause slideshow'} onClick={() => setStopped(!stopped)}>
        <i className={`fa fa-${stopped ? 'play' : 'pause'}`} aria-hidden="true" />
      </button>}
    </div>
    <ol className={`listing-featured-list ${paused ? 'is-paused' : ''}`} aria-label="Choose a featured title">
      {items.map(({ show, party }, position) => <li key={party?.id ?? show.id}>
        <button type="button" aria-current={index === position ? 'true' : undefined} onClick={() => setActive(position)}>
          <Artwork src={party?.video.preview_image || show.preview_image} eager />
          <span><b>{show.title}</b><small>{party ? partyStatus(party) : showMeta(show, true)}</small></span>
          {position === index && <i key={`${position}-${Boolean(paused)}`} className="listing-carousel-progress" aria-hidden="true" />}
        </button>
      </li>)}
    </ol>
  </section>
}
