import { Autocomplete } from '@base-ui/react/autocomplete'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { UiSkeleton } from '~/components/ui-skeleton/ui-skeleton'
import { useListingSearchQuery } from '../app-home-queries'
import { AppHomeListingArtwork } from './app-home-listing-artwork'
import { partyDetails, partyStatus, showMeta } from './app-home-listing-format'

type SearchOption = { key: string; show: AppShow; party: AppParty | null }
type SearchGroup = { value: 'Titles' | 'Parties'; items: SearchOption[] }

// A result row and its skeleton share these, so the list doesn't shift when results arrive.
const GROUP = 'px-2.5 pt-2 pb-1.5 font-label text-11 font-bold tracking-widest text-neutral-400 uppercase'
const ROW = 'flex w-full items-center gap-3 px-2.5 py-2'
const THUMBNAIL = 'static h-10 w-18 flex-none rounded-md'

function SearchSkeleton() {
  return <div data-testid="search-skeleton" aria-hidden="true">
    {[{ label: 'Titles', widths: [68, 52, 60] }, { label: 'Parties', widths: [58, 72] }].map(({ label, widths }) => <Fragment key={label}>
      <div className={GROUP}>{label}</div>
      {widths.map((width, index) => <div className={ROW} key={index}>
        <UiSkeleton className={THUMBNAIL} />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <UiSkeleton width={`${width}%`} height={14} />
          <UiSkeleton width={`${width + 12}%`} height={10} />
        </div>
      </div>)}
    </Fragment>)}
  </div>
}

export function AppHomeListingSearch({ onShowSelect }: { onShowSelect: (show: AppShow) => void }) {
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
    { value: 'Titles' as const, items: results.titles.map((show): SearchOption => ({ key: `title-${show.id}`, show, party: null })) },
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
    const index = value.toLocaleLowerCase().indexOf(term.toLocaleLowerCase())
    if (index < 0 || !term) return value
    return <>{value.slice(0, index)}<mark className="rounded-xs bg-pink-500 px-[.04em] text-white">{value.slice(index, index + term.length)}</mark>{value.slice(index + term.length)}</>
  }

  // Base UI opens on ↑/↓ even when the field is empty; with no query there's nothing to show, so stay closed.
  return <Autocomplete.Root items={groups} filter={null} value={text} autoHighlight open={open && Boolean(trimmed)}
    onOpenChange={next => setOpen(next && Boolean(input.current?.value.trim()))}
    onValueChange={(value, details) => { if (details.reason !== 'item-press') setText(value) }}
    itemToStringValue={(option: SearchOption) => option.show.title}>
    <Autocomplete.InputGroup data-testid="search" className="group relative flex h-9 min-w-0 flex-1 items-center gap-1.75 rounded-xl border border-neutral-800 bg-neutral-900 px-2.5 text-neutral-400 transition-colors duration-200 focus-within:border-neutral-500 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-3 has-[input:focus-visible]:outline-pink-700 sm:-ml-2.5 sm:h-10.5 sm:w-[min(240px,35%)] sm:flex-initial sm:gap-2.5 sm:pr-3 sm:pl-3.5 lg:w-62.5 xl:-ml-5">
      <i className="fa fa-search" aria-hidden="true" />
      <Autocomplete.Input ref={input} aria-label="Search titles and parties" placeholder="Search titles & parties"
        autoComplete="off" maxLength={200} className="w-full min-w-0 flex-1 text-sm text-white outline-none! placeholder:text-xs placeholder:text-neutral-500 sm:placeholder:text-13" />
      <Autocomplete.Clear className="-mr-1 grid size-5 flex-none cursor-pointer place-items-center rounded-full bg-neutral-800 text-sm leading-none text-neutral-300 transition-colors duration-200 hover:bg-neutral-700 hover:text-white" aria-label="Clear search"><i className="fa fa-close" aria-hidden="true" /></Autocomplete.Clear>
      {!text && <kbd aria-hidden="true" className="hidden rounded-sm border border-neutral-700 px-1.25 py-0.5 text-11 sm:inline sm:group-focus-within:hidden">/</kbd>}
    </Autocomplete.InputGroup>
    <Autocomplete.Portal>
      <Autocomplete.Positioner className="z-40 outline-none" align="end" sideOffset={8} collisionPadding={16}>
        {/* The list is portalled out of the listing, so it carries its own type settings. */}
        <Autocomplete.Popup data-testid="search-dropdown" className="max-h-[min(70vh,var(--available-height))] w-[min(420px,var(--available-width))] overflow-y-auto rounded-2xl border border-neutral-700 bg-neutral-900/96 p-2 text-sm text-white antialiased shadow-menu outline-none sm:max-h-[min(650px,75vh,var(--available-height))]">
          <Autocomplete.Status data-testid="search-status">
            {loading && <span className="sr-only">Searching titles and parties…</span>}
            {failed && <div role="alert" className="px-2.5 py-4.5 text-neutral-300">Unable to search. <button type="button" className="cursor-pointer leading-[inherit] text-white underline" onClick={() => { void query.refetch() }}>Retry</button></div>}
          </Autocomplete.Status>
          {loading && <SearchSkeleton />}
          <Autocomplete.Empty data-testid="search-empty">
            {results && <p className="px-2.5 py-4.5 text-neutral-300">No matches for “{term}”.</p>}
          </Autocomplete.Empty>
          <Autocomplete.List aria-label="Search results" aria-busy={loading}>
            {(group: SearchGroup) => <Autocomplete.Group key={group.value} items={group.items}>
              <Autocomplete.GroupLabel className={GROUP}>{group.value}</Autocomplete.GroupLabel>
              <Autocomplete.Collection>
                {(option: SearchOption) => <Autocomplete.Item key={option.key} value={option} className={`group ${ROW} cursor-pointer rounded-lg text-white outline-none data-highlighted:bg-neutral-800`}
                  onClick={() => select(option)}>
                  <AppHomeListingArtwork src={option.party?.video.preview_image || option.show.preview_image} className={THUMBNAIL} />
                  <span className="min-w-0"><b className="block text-sm">{highlight(option.show.title)}</b><small className="block truncate text-xs text-neutral-400">{option.party ? `${partyDetails(option.party)} · ${partyStatus(option.party)}` : showMeta(option.show, true)}</small></span>
                  <span className="ml-auto opacity-0 group-data-highlighted:opacity-100" aria-hidden="true">↵</span>
                </Autocomplete.Item>}
              </Autocomplete.Collection>
            </Autocomplete.Group>}
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
}
