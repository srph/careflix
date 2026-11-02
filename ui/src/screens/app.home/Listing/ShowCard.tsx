import UiPlainButton from '~/components/UiPlainButton'
import Artwork from './Artwork'
import { showMeta } from './format'

export default function ShowCard({ show, onDetails }: { show: AppShow; onDetails: (show: AppShow) => void }) {
  return <div className="listing-show-card">
    <UiPlainButton className="listing-show-trigger" onClick={event => { event.currentTarget.focus(); onDetails(show) }} aria-label={`Details for ${show.title}`}>
      <div className="listing-show-thumbnail"><Artwork src={show.preview_image} /></div>
      <h3>{show.title}</h3><span>{showMeta(show)}</span>
    </UiPlainButton>
    <div className="listing-show-preview" aria-hidden="true">
      <div className="listing-show-preview-art"><Artwork src={show.preview_image} /></div>
      <div className="listing-show-preview-body"><b>{show.title}</b><span>{showMeta(show, true)}</span><p>{show.synopsis}</p></div>
    </div>
  </div>
}
