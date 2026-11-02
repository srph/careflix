import { Link } from 'react-router'
import UiLogo from '~/components/UiLogo'
import UiAvatar from '~/components/UiAvatar'
import UiPlainButton from '~/components/UiPlainButton'
import { useAuth } from '~/contexts/Auth'
import { type ListingTab } from '../queries'
import ListingSearch from './ListingSearch'

const tabs: Array<[ListingTab, string]> = [['all', 'All'], ['movie', 'Movies'], ['series', 'Series'], ['parties', 'Parties']]

export default function ListingNavigation({ tab, onTabChange, onShowSelect, parties }: {
  tab: ListingTab; onTabChange: (tab: ListingTab) => void; onShowSelect: (show: AppShow) => void; parties: AppParty[]
}) {
  const auth = useAuth()
  return <nav className="listing-navigation" aria-label="Catalog">
    <Link to="/" className="listing-logo" aria-label="Care.tv" onClick={() => onTabChange('all')}><UiLogo /></Link>
    <div className="listing-tabs" role="tablist" aria-label="Browse">
      {tabs.map(([value, label], index) => <UiPlainButton key={value} id={`listing-tab-${value}`} role="tab"
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
    <ListingSearch onShowSelect={onShowSelect} recentParties={parties} />
    <Link to="/settings" className="listing-account" aria-label="Account settings"><UiAvatar user={auth.data} /></Link>
  </nav>
}
