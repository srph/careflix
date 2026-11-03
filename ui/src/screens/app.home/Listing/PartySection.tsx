import PartyCard from './PartyCard'
import { useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useReducedMotion } from 'motion/react'
import { PartySkeletonCards } from './ListingStates'

export default function PartySection({ parties, total, recent = false, onSeeAll, isLoadingMore = false }: {
  parties: AppParty[]; total: number; recent?: boolean; onSeeAll?: () => void; isLoadingMore?: boolean
}) {
  const grid = useRef<HTMLDivElement>(null)
  const hovered = useRef<HTMLElement | null>(null)
  const [styles, setStyles] = useState<CSSProperties[]>([])
  const reduceMotion = useReducedMotion()
  function shift(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const card = (event.target as HTMLElement).closest<HTMLElement>('.listing-party-card')
    if (!card || card === hovered.current) return
    hovered.current = card
    const cards = Array.from(grid.current.querySelectorAll<HTMLElement>('.listing-party-card'))
    const row = cards.filter(other => other.offsetTop === card.offsetTop)
    const columns = getComputedStyle(grid.current).gridTemplateColumns.split(' ').length
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
  return <section className="listing-section" aria-label={recent ? 'Recent parties' : 'All parties'} aria-busy={isLoadingMore}>
    <div className="listing-section-heading"><h2>{recent ? 'Recent parties' : 'All parties'}</h2><span>{recent ? Math.min(3, parties.length) : total}</span>
      {recent && <button type="button" onClick={onSeeAll}>See all parties <span aria-hidden="true">→</span></button>}
    </div>
    {parties.length ? <div className="listing-party-grid" ref={grid} onPointerOver={shift} onPointerLeave={() => { hovered.current = null; setStyles([]) }}>
      {(recent ? parties.slice(0, 3) : parties).map((party, index) => <PartyCard party={party} key={party.id} style={styles[index]} />)}
      {isLoadingMore && <PartySkeletonCards />}</div>
      : <p className="listing-empty">Your parties will appear here. Pick a title to start watching together.</p>}
    {isLoadingMore && <span className="listing-loading-label" role="status">Loading more parties…</span>}
  </section>
}
