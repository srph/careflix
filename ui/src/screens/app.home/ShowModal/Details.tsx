import type { ReactNode } from 'react'
import { airYears, duration, totalDuration } from './format'
import { UiSkeleton } from '~/components/ui-skeleton/ui-skeleton'

const SEASONS = 'grid gap-1.5'

function Fact({ label, children }: { label: string; children: ReactNode }) {
  return <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3 border-b border-neutral-800 py-3 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-0">
    <dt className="font-label text-11/5 font-semibold tracking-label text-neutral-400 uppercase">{label}</dt>
    <dd className="wrap-anywhere text-neutral-200">{children}</dd>
  </div>
}

export default function Details({ show, groups, groupsStatus, groupsLoading }: { show: AppShow; groups: AppShowGroup[]; groupsStatus: ReactNode; groupsLoading?: boolean }) {
  const isSeries = show.title_type === 'series'
  return <>
    <dl data-testid="show-facts">
      <Fact label={isSeries ? 'Aired' : 'Released'}>{airYears(show) || 'Unavailable'}</Fact>
      <Fact label="Runtime">{groupsLoading ? <UiSkeleton width={100} height={20} /> : isSeries ? (groupsStatus ? 'Unavailable' : duration(totalDuration(groups.flatMap(group => group.videos)))) : duration(show.movie?.duration)}</Fact>
      <Fact label="Language">{show.language || 'Unavailable'}</Fact>
      {isSeries && <Fact label="Seasons">{groupsLoading ? <>
        <div className="sr-only">{groupsStatus}</div>
        <div data-testid="show-seasons" className={SEASONS}>{Array.from({ length: Math.min(show.groups_count ?? 3, 4) }, (_, index) => <UiSkeleton key={index} width="80%" height={20} />)}</div>
      </> : groupsStatus || <div data-testid="show-seasons" className={SEASONS}>{groups.map(group => <div className="flex flex-wrap gap-x-2.5 gap-y-0.5" key={group.id}>
        <span>{group.title}</span><span className="text-neutral-400">{group.videos.length} episode{group.videos.length === 1 ? '' : 's'} · {duration(totalDuration(group.videos))}</span>
      </div>)}</div>}</Fact>}
    </dl>
  </>
}
