import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useListingSearchQuery } from '../queries'
import Artwork from './Artwork'
import { partyDetails, partyStatus, showMeta } from './format'

export default function ListingSearch({ onShowSelect, recentParties }: { onShowSelect: (show: AppShow) => void; recentParties: AppParty[] }) {
  const [text, setText] = useState('')
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const navigate = useNavigate()
  const trimmed = text.trim()
  const query = useListingSearchQuery(term, open && trimmed === term)
  const busy = Boolean(trimmed) && (trimmed !== term || query.isPending)
  const expanded = open
  const titles = trimmed && !busy ? query.data?.titles ?? [] : []
  const parties = trimmed ? (!busy ? query.data?.parties ?? [] : []) : recentParties.slice(0, 3)
  const options = [
    ...titles.map(show => ({ show, party: null as AppParty | null })),
    ...parties.map(party => ({ show: party.video.show, party })),
  ]

  useEffect(() => {
    const timer = setTimeout(() => setTerm(trimmed), 200)
    return () => clearTimeout(timer)
  }, [trimmed])

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      const target = event.target as HTMLElement
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey &&
        !target.closest('input, textarea, select, [contenteditable="true"]') && !document.querySelector('[role="dialog"]')) {
        event.preventDefault()
        input.current?.focus()
      }
    }
    document.addEventListener('keydown', shortcut)
    return () => document.removeEventListener('keydown', shortcut)
  }, [])

  function select(index: number) {
    const option = options[index]
    if (!option) return
    setOpen(false)
    setText('')
    setActive(-1)
    if (option.party) navigate(`/watch/${option.party.id}`)
    else onShowSelect(option.show)
  }

  function highlight(value: string) {
    const index = value.toLocaleLowerCase().indexOf(trimmed.toLocaleLowerCase())
    if (index < 0 || !trimmed) return value
    return <>{value.slice(0, index)}<mark>{value.slice(index, index + trimmed.length)}</mark>{value.slice(index + trimmed.length)}</>
  }

  return <div className="listing-search" onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false)
  }}>
    <i className="fa fa-search" aria-hidden="true" />
    <input ref={input} role="combobox" aria-label="Search titles and parties" placeholder="Search titles & parties"
      aria-expanded={expanded} aria-controls={expanded ? `${id}-results` : undefined} aria-autocomplete="list"
      aria-activedescendant={expanded && active >= 0 && options[active] ? `${id}-${active}` : undefined}
      autoComplete="off" maxLength={200} value={text} onFocus={() => setOpen(true)}
      onChange={event => { setText(event.target.value); setOpen(true); setActive(-1) }}
      onKeyDown={event => {
        if (event.key === 'Escape') { event.preventDefault(); setText(''); setActive(-1); setOpen(false); input.current?.blur() }
        else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          setOpen(true)
          if (options.length) setActive(index => event.key === 'ArrowDown' ? (index + 1) % options.length : (index <= 0 ? options.length : index) - 1)
        } else if (event.key === 'Enter' && expanded && !busy) {
          event.preventDefault()
          select(active < 0 ? 0 : active)
        }
      }} />
    <kbd aria-hidden="true">/</kbd>
    {expanded && <div className="listing-search-dropdown">
      {busy ? <p role="status">Searching…</p> : trimmed && query.isError ? <div role="alert">Unable to search. <button type="button" onClick={() => { void query.refetch() }}>Retry</button></div> : null}
      <div id={`${id}-results`} role="listbox" aria-label="Search results" aria-busy={busy}>
        {!busy && !(trimmed && query.isError) && !options.length && <p role="status">{trimmed ? `No matches for “${trimmed}”.` : 'Search for a title or a party.'}</p>}
        {options.map((option, index) => <Fragment key={`${option.party ? 'party' : 'title'}-${option.party?.id ?? option.show.id}`}>
          {(index === 0 || index === titles.length) && <div className="listing-search-group" role="presentation">{!trimmed ? 'Jump back in' : option.party ? 'Parties' : 'Titles'}</div>}
          <button type="button" role="option" id={`${id}-${index}`} aria-selected={active === index} tabIndex={-1}
            className="listing-search-option" onMouseEnter={() => setActive(index)} onMouseDown={event => event.preventDefault()} onClick={() => select(index)}>
            <Artwork src={option.party?.video.preview_image || option.show.preview_image} />
            <span><b>{highlight(option.show.title)}</b><small>{option.party ? `${partyDetails(option.party)} · ${partyStatus(option.party)}` : showMeta(option.show, true)}</small></span>
            <span className="listing-search-return" aria-hidden="true">↵</span>
          </button>
        </Fragment>)}
      </div>
    </div>}
  </div>
}
