import UiSelect from '~/components/UiSelect'
import Artwork from '../Listing/Artwork'
import { EPISODE_ART, EPISODE_GRID, EPISODE_HEADING, STATUS } from './classes'
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
    <div className={EPISODE_HEADING}>
      <UiSelect aria-label="Season" value={group.id} onChange={event => onGroupChange(Number(event.currentTarget.value))} className="max-w-[65%] min-w-31"
        selectClassName="h-8.5 rounded-lg border-neutral-700 pr-8 text-xs font-semibold *:bg-neutral-900 *:text-white" caretClassName="top-2">
        {groups.map(group => <option key={group.id} value={group.id}>{group.title}</option>)}
      </UiSelect>
      <span className="ml-auto text-right font-label text-11 font-semibold tracking-label text-neutral-400 uppercase">{group.videos.length} episode{group.videos.length === 1 ? '' : 's'} · {duration(totalDuration(group.videos))}</span>
    </div>
    {!group.videos.length && <p className={STATUS}>No episodes available in this season yet.</p>}
    <div className={EPISODE_GRID}>
      {group.videos.map((video, index) => <button type="button" data-testid="episode" key={video.id} disabled={isCreating} onClick={() => onPlay(video)}
        className="group block w-full min-w-0 cursor-pointer border-0 bg-transparent p-0 text-left text-white disabled:cursor-default disabled:opacity-60">
        <span className={`${EPISODE_ART} transition-shadow duration-200 group-hover:ring-neutral-500 group-focus-visible:ring-neutral-500`}>
          <Artwork src={video.preview_image || show.preview_image} />
          <span className="absolute inset-0 grid place-items-center bg-neutral-950/40 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"><i className="fa fa-play" aria-hidden="true" /></span>
        </span>
        <b className="mt-2.25 block text-sm font-semibold wrap-anywhere"><span aria-hidden="true">{index + 1}. </span><span>{video.title}</span></b>
        {video.synopsis && <span className="mt-1 line-clamp-2 text-xs/normal text-neutral-400">{video.synopsis}</span>}
        <span className="mt-1.25 block font-label text-11 font-medium text-neutral-400">{duration(video.duration)}</span>
      </button>)}
    </div>
  </>
}
