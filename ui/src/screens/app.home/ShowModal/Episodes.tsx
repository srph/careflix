import UiSelect from '~/components/UiSelect'
import Artwork from '../Listing/Artwork'
import { duration, totalDuration } from './format'

interface Props {
  show: AppShow
  groups: AppShowGroup[]
  group: AppShowGroup
  onGroupChange: (id: AppId) => void
  onPlay: (video: AppShowVideo) => void
  isCreating?: boolean
}

export default function Episodes({ show, groups, group, onGroupChange, onPlay, isCreating }: Props) {
  return <>
    <div className="show-modal-episode-heading">
      <UiSelect aria-label="Season" value={group.id} onChange={event => onGroupChange(Number(event.currentTarget.value))}>
        {groups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}
      </UiSelect>
      <span>{group.videos.length} episode{group.videos.length === 1 ? '' : 's'} · {duration(totalDuration(group.videos))}</span>
    </div>
    {!group.videos.length && <p className="show-modal-status">No episodes available in this season yet.</p>}
    <div className="show-modal-episodes">
      {group.videos.map((video, index) => <button type="button" className="show-modal-episode" data-testid="episode" key={video.id} disabled={isCreating} onClick={() => onPlay(video)}>
        <span className="show-modal-episode-art"><Artwork src={video.preview_image || show.preview_image} /><span className="show-modal-episode-play"><i className="fa fa-play" aria-hidden="true" /></span></span>
        <b><span aria-hidden="true">{index + 1}. </span><span>{video.title}</span></b>
        {video.synopsis && <span className="show-modal-episode-synopsis">{video.synopsis}</span>}
        <span className="show-modal-episode-duration">{duration(video.duration)}</span>
      </button>)}
    </div>
  </>
}
