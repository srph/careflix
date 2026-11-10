import { Autocomplete } from '@base-ui/react/autocomplete'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import UiSkeleton from '~/components/UiSkeleton'
import { useListingSearchQuery } from '../queries'
import Artwork from './Artwork'
import { partyDetails, partyStatus, showMeta } from './format'

type SearchOption = { key: string; show: AppShow; party: AppParty | null }
type SearchGroup = { value: 'Titles' | 'Parties'; items: SearchOption[] }

function SearchSkeleton() {
  return <div className="listing-search-loading" aria-hidden="true">
    {[{ label: 'Titles', widths: [68, 52, 60] }, { label: 'Parties', widths: [58, 72] }].map(({ label, widths }) => <Fragment key={label}>
      <div className="listing-search-group">{label}</div>
      {widths.map((width, index) => <div className="listing-search-skeleton-row" key={index}>
        <UiSkeleton className="listing-search-skeleton-artwork" />
        <div className="listing-search-skeleton-copy">
          <UiSkeleton width={`${width}%`} height={14} />
          <UiSkeleton width={`${width + 12}%`} height={10} />
        </div>
      </div>)}
    </Fragment>)}
  </div>
}

export default function ListingSearch({ onShowSelect }: { onShowSelect: (show: AppShow) => void }) {
  const [text, setText] = useState('')
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const trimmed = text.trim()
  const query = useListingSearchQuery(term)
  // Data (fresh or cached) wins, then the error, otherwise a skeleton.
  const results = trimmed ? query.data : undefined
  const failed = Boolean(trimmed) && !results && query.isError
  const loading = Boolean(trimmed) && !results && !failed
  const groups: SearchGroup[] = results ? [
    { value: 'Titles' as const, items: results.titles.map(show => ({ key: `title-${show.id}`, show, party: null })) },
    { value: 'Parties' as const, items: results.parties.map(party => ({ key: `party-${party.id}`, show: party.video.show, party })) },
  ].filter(group => group.items.length) : []

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

  function select(option: SearchOption) {
    setText('')
    if (option.party) navigate(`/watch/${option.party.id}`)
    else onShowSelect(option.show)
  }

  function highlight(value: string) {
    const index = value.toLocaleLowerCase().indexOf(trimmed.toLocaleLowerCase())
    if (index < 0 || !trimmed) return value
    return <>{value.slice(0, index)}<mark>{value.slice(index, index + trimmed.length)}</mark>{value.slice(index + trimmed.length)}</>
  }

  // Base UI opens on ↑/↓ even when the field is empty; with no query there's nothing to show, so stay closed.
  return <Autocomplete.Root items={groups} filter={null} value={text} autoHighlight open={open && Boolean(trimmed)}
    onOpenChange={next => setOpen(next && Boolean(input.current?.value.trim()))}
    onValueChange={(value, details) => { if (details.reason !== 'item-press') setText(value) }}
    itemToStringValue={(option: SearchOption) => option.show.title}>
    <Autocomplete.InputGroup className="listing-search">
      <i className="fa fa-search" aria-hidden="true" />
      <Autocomplete.Input ref={input} aria-label="Search titles and parties" placeholder="Search titles & parties"
        autoComplete="off" maxLength={200} />
      <Autocomplete.Clear className="listing-search-clear" aria-label="Clear search"><i className="fa fa-close" aria-hidden="true" /></Autocomplete.Clear>
      {!text && <kbd aria-hidden="true">/</kbd>}
    </Autocomplete.InputGroup>
    <Autocomplete.Portal>
      <Autocomplete.Positioner className="listing-search-positioner" align="end" sideOffset={8} collisionPadding={16}>
        <Autocomplete.Popup className="listing-search-dropdown">
          <Autocomplete.Status className="listing-search-status">
            {loading && <span className="listing-search-loading-label">Searching titles and parties…</span>}
            {failed && <div role="alert">Unable to search. <button type="button" onClick={() => { void query.refetch() }}>Retry</button></div>}
          </Autocomplete.Status>
          {loading && <SearchSkeleton />}
          <Autocomplete.Empty className="listing-search-empty">
            {results && <p>No matches for “{trimmed}”.</p>}
          </Autocomplete.Empty>
          <Autocomplete.List aria-label="Search results" aria-busy={loading}>
            {(group: SearchGroup) => <Autocomplete.Group key={group.value} items={group.items}>
              <Autocomplete.GroupLabel className="listing-search-group">{group.value}</Autocomplete.GroupLabel>
              <Autocomplete.Collection>
                {(option: SearchOption) => <Autocomplete.Item key={option.key} value={option} className="listing-search-option"
                  onClick={() => select(option)}>
                  <Artwork src={option.party?.video.preview_image || option.show.preview_image} />
                  <span><b>{highlight(option.show.title)}</b><small>{option.party ? `${partyDetails(option.party)} · ${partyStatus(option.party)}` : showMeta(option.show, true)}</small></span>
                  <span className="listing-search-return" aria-hidden="true">↵</span>
                </Autocomplete.Item>}
              </Autocomplete.Collection>
            </Autocomplete.Group>}
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
}
