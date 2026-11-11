import type { ReactNode } from 'react'
import { airYears, duration, totalDuration } from './format'
import UiSkeleton from '~/components/UiSkeleton'

export default function Details({ show, groups, groupsStatus, groupsLoading }: { show: AppShow; groups: AppShowGroup[]; groupsStatus: ReactNode; groupsLoading?: boolean }) {
  const isSeries = show.title_type === 'series'
  return <>
    <dl data-testid="show-facts" className="show-modal-facts">
      <div><dt>{isSeries ? 'Aired' : 'Released'}</dt><dd>{airYears(show) || 'Unavailable'}</dd></div>
      <div><dt>Runtime</dt><dd>{groupsLoading ? <UiSkeleton width={100} height={20} /> : isSeries ? (groupsStatus ? 'Unavailable' : duration(totalDuration(groups.flatMap(group => group.videos)))) : duration(show.movie?.duration)}</dd></div>
      <div><dt>Language</dt><dd>{show.language || 'Unavailable'}</dd></div>
      {isSeries && <div><dt>Seasons</dt><dd>{groupsLoading ? <>
        <div className="show-modal-loading-label">{groupsStatus}</div>
        <div data-testid="show-seasons" className="show-modal-seasons">{Array.from({ length: Math.min(show.groups_count ?? 3, 4) }, (_, index) => <UiSkeleton key={index} width="80%" height={20} />)}</div>
      </> : groupsStatus || <div data-testid="show-seasons" className="show-modal-seasons">{groups.map(group => <div key={group.id}>
        <span>{group.title}</span><span>{group.videos.length} episode{group.videos.length === 1 ? '' : 's'} · {duration(totalDuration(group.videos))}</span>
      </div>)}</div>}</dd></div>}
    </dl>
  </>
}
