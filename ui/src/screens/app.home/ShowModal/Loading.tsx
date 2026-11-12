import UiSkeleton from '~/components/UiSkeleton'
import { cn } from '~/utils/cn'
import { EPISODE_ART, EPISODE_GRID, EPISODE_HEADING, PANE, PARTY_ROW_LINE, TAB_BAR, TAB_COLUMN } from './classes'

function EpisodeShapes() {
  return <>
    <div className={EPISODE_HEADING}><UiSkeleton width={124} height={34} radius={8} /><UiSkeleton width={144} height={11} /></div>
    <div className={EPISODE_GRID}>
      {[0, 1, 2, 3].map(index => <div className="flex flex-col gap-1.75" key={index}>
        <UiSkeleton className={cn(EPISODE_ART, 'mb-0.5 h-auto')} />
        <UiSkeleton width="72%" height={19} /><UiSkeleton width="96%" height={12} /><UiSkeleton width="84%" height={12} /><UiSkeleton width={32} height={16} />
      </div>)}
    </div>
  </>
}

export function EpisodesLoading() {
  return <div role="status"><span className="sr-only">Loading episodes…</span><EpisodeShapes /></div>
}

export function DetailsLoading({ isSeries }: { isSeries: boolean }) {
  return <div className={TAB_COLUMN} role="status">
    <span className="sr-only">Loading title details…</span>
    <div className={`${TAB_BAR} h-13.5 items-center gap-7`}><UiSkeleton width={60} height={16} /><UiSkeleton width={48} height={16} /><UiSkeleton width={48} height={16} /></div>
    <div className={cn(PANE, 'overflow-hidden')}>{isSeries ? <EpisodeShapes /> : <div>
      {[0, 1, 2].map(index => <div className={`flex min-h-14.5 items-center gap-4 px-2.5 py-3.5 ${PARTY_ROW_LINE}`} key={index}><UiSkeleton width={64} height={24} radius={24} /><UiSkeleton width="48%" height={16} /><UiSkeleton width={80} height={12} /></div>)}
    </div>}</div>
  </div>
}
