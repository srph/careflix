import { AppHomeListingPartyCard } from './app-home-listing-party-card'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import { PartySkeletonCards } from './app-home-listing-states'
import { PARTY_GRID, SECTION_HEADING, SECTION_TITLE } from './app-home-listing-classes'

const CARD = '[data-testid="party-card"]'

export function AppHomeListingPartySection({ parties, recent = false, onSeeAll, isLoadingMore = false }: {
  parties: AppParty[]; recent?: boolean; onSeeAll?: () => void; isLoadingMore?: boolean
}) {
  const grid = useRef<HTMLDivElement>(null)
  const hovered = useRef<HTMLElement | null>(null)
  const [styles, setStyles] = useState<CSSProperties[]>([])
  const reduceMotion = useReducedMotion()
  function shift(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const list = grid.current
    const card = (event.target as HTMLElement).closest<HTMLElement>(CARD)
    if (!list || !card || card === hovered.current) return
    hovered.current = card
    const cards = Array.from(list.querySelectorAll<HTMLElement>(CARD))
    const row = cards.filter(other => other.offsetTop === card.offsetTop)
    const columns = getComputedStyle(list).gridTemplateColumns.split(' ').length
    if (columns < 2) return
    const column = row.indexOf(card)
    const growth = card.offsetWidth * .1
    const offset = column === 0 ? growth / 2 : column === columns - 1 ? -growth / 2 : 0
    setStyles(cards.map(other => {
      if (other.offsetTop !== card.offsetTop) return {}
      if (other === card) return { transform: `translateX(${offset}px) scale(1.1)`, zIndex: 4 }
      return { transform: `translateX(${row.indexOf(other) < column ? -growth / 2 + offset : growth / 2 + offset}px)` }
    }))
  }
  return <section aria-label={recent ? 'Recent parties' : 'All parties'} aria-busy={isLoadingMore}>
    <div className={SECTION_HEADING}><h2 className={SECTION_TITLE}>{recent ? 'Recent parties' : 'All parties'}</h2>
      {recent && onSeeAll && <button type="button" onClick={onSeeAll} className="ml-auto cursor-pointer py-1.25 text-xs text-neutral-300 hover:text-pink-500 sm:text-13">See all parties <span aria-hidden="true" className="ml-1.25">→</span></button>}
    </div>
    {parties.length ? <div className={PARTY_GRID} ref={grid} onPointerOver={shift} onPointerLeave={() => { hovered.current = null; setStyles([]) }}>
      {(recent ? parties.slice(0, 3) : parties).map((party, index) => <AppHomeListingPartyCard party={party} key={party.id} style={styles[index]} />)}
      {isLoadingMore && <PartySkeletonCards />}</div>
      : <p className="py-9 text-base text-neutral-400">Your parties will appear here. Pick a title to start watching together.</p>}
    {isLoadingMore && <span className="sr-only" role="status">Loading more parties…</span>}
  </section>
}
