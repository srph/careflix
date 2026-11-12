import { Link } from 'react-router'
import { UiLogo } from '~/components/ui-logo/ui-logo'
import { UiAvatar } from '~/components/ui-avatar/ui-avatar'
import { UiPlainButton } from '~/components/ui-plain-button/ui-plain-button'
import { useAuth } from '~/contexts/auth/auth'
import { type ListingTab } from '../queries'
import ListingSearch from './ListingSearch'
import JoinPartyModal from '../JoinPartyModal'

const tabs: Array<[ListingTab, string]> = [['all', 'All'], ['movie', 'Movies'], ['series', 'Series'], ['parties', 'Parties']]

export default function ListingNavigation({ tab, onTabChange, onShowSelect }: {
  tab: ListingTab; onTabChange: (tab: ListingTab) => void; onShowSelect: (show: AppShow) => void
}) {
  const auth = useAuth()
  return <nav aria-label="Catalog" className="sticky top-0 z-30 flex min-h-19 flex-wrap items-center gap-2.5 bg-neutral-950/95 px-3 pt-3.5 pb-2.5 min-[361px]:gap-3.5 min-[361px]:px-5 sm:gap-x-6 sm:gap-y-3 sm:px-6 sm:pt-4 lg:flex-nowrap lg:gap-6 lg:px-10 lg:py-3 xl:gap-9">
    <Link to="/" className="flex-none" aria-label="Care.tv" onClick={() => onTabChange('all')}><UiLogo className="font-bold text-white first-letter:text-pink-500 min-[361px]:text-lg sm:text-xl" /></Link>
    <div role="tablist" aria-label="Browse" className="sliding-tabs order-4 flex w-full items-center justify-between gap-3 sm:justify-start sm:gap-7 lg:order-none lg:w-auto lg:gap-5 xl:gap-6.5">
      {tabs.map(([value, label], index) => <UiPlainButton key={value} id={`listing-tab-${value}`} role="tab"
        className="relative rounded-sm py-2.5 text-sm font-bold text-neutral-400 aria-selected:text-white sm:text-base"
        aria-controls="listing-panel" aria-selected={tab === value} tabIndex={tab === value ? 0 : -1}
        onClick={() => onTabChange(value)} onKeyDown={event => {
          let next = index
          if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
          else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length
          else if (event.key === 'Home') next = 0
          else if (event.key === 'End') next = tabs.length - 1
          else return
          event.preventDefault()
          onTabChange(tabs[next][0])
          document.getElementById(`listing-tab-${tabs[next][0]}`)?.focus()
        }}>{label}</UiPlainButton>)}
    </div>
    <JoinPartyModal />
    <ListingSearch onShowSelect={onShowSelect} />
    <Link to="/settings" className="flex flex-none items-center sm:-ml-2 xl:-ml-5" aria-label="Account settings"><UiAvatar user={auth.data} className="size-7.5 sm:size-8.5" /></Link>
  </nav>
}
