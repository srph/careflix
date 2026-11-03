import UiSkeleton from '~/components/UiSkeleton'

function EpisodeShapes() {
  return <>
    <div className="show-modal-episode-heading"><UiSkeleton width={124} height={34} radius={8} /><UiSkeleton width={144} height={11} /></div>
    <div className="show-modal-episodes">
      {[0, 1, 2, 3].map(index => <div className="show-modal-episode-skeleton" key={index}>
        <UiSkeleton className="show-modal-episode-art" height="auto" radius={8} />
        <UiSkeleton width="72%" height={19} /><UiSkeleton width="96%" height={12} /><UiSkeleton width="84%" height={12} /><UiSkeleton width={32} height={16} />
      </div>)}
    </div>
  </>
}

export function EpisodesLoading() {
  return <div role="status"><span className="show-modal-loading-label">Loading episodes…</span><EpisodeShapes /></div>
}

export function DetailsLoading({ isSeries }: { isSeries: boolean }) {
  return <div className="show-modal-content-placeholder" role="status">
    <span className="show-modal-loading-label">Loading title details…</span>
    <div className="show-modal-pending-tabs"><UiSkeleton width={60} height={16} /><UiSkeleton width={48} height={16} /><UiSkeleton width={48} height={16} /></div>
    <div className="show-modal-pane">{isSeries ? <EpisodeShapes /> : <div className="show-modal-history-skeleton">
      {[0, 1, 2].map(index => <div key={index}><UiSkeleton width={64} height={24} radius={24} /><UiSkeleton width="48%" height={16} /><UiSkeleton width={80} height={12} /></div>)}
    </div>}</div>
  </div>
}
