import UiPlainButton from '~/components/UiPlainButton'
import Artwork from './Artwork'
import { showMeta } from './format'

export default function ShowCard({ show, onDetails }: { show: AppShow; onDetails: (show: AppShow) => void }) {
  return <div data-testid="show-card" className="group relative min-w-0 focus-within:z-5 hover:z-5">
    <UiPlainButton className="block w-full text-left" onClick={event => { event.currentTarget.focus(); onDetails(show) }} aria-label={`Details for ${show.title}`}>
      <div className="relative aspect-video overflow-hidden rounded-lg ring-1 ring-neutral-800"><Artwork src={show.preview_image} /></div>
      <h3 className="mt-2.5 text-sm font-semibold sm:text-base">{show.title}</h3><span className="text-11 text-neutral-400 sm:text-xs">{showMeta(show)}</span>
    </UiPlainButton>
    {/* A larger card over the thumbnail: after a pause on hover with a mouse, at once on keyboard focus. Not on phones. */}
    <div aria-hidden="true" className="pointer-events-none absolute -top-[14%] -right-[11%] -left-[11%] hidden origin-[50%_25%] scale-86 overflow-hidden rounded-xl bg-neutral-800 opacity-0 shadow-[0_34px_60px_-18px_#000e] ring-1 ring-neutral-700 transition-[opacity,scale] duration-[.18s,.3s] group-focus-within:scale-100 group-focus-within:opacity-100 sm:block pointer-fine:group-hover:scale-100 pointer-fine:group-hover:opacity-100 pointer-fine:group-hover:delay-350">
      <div className="relative aspect-video after:absolute after:inset-0 after:bg-linear-to-t after:from-neutral-800 after:to-transparent after:to-34%"><Artwork src={show.preview_image} /></div>
      <div className="px-4 pt-3.25 pb-4">
        <b className="block text-lg/tight tracking-[-.012em]">{show.title}</b>
        <span className="mt-1.75 block font-label text-11 font-semibold tracking-label text-neutral-400 uppercase">{showMeta(show, true)}</span>
        <p className="mt-3.25 line-clamp-4 text-xs/relaxed text-neutral-300">{show.synopsis}</p>
      </div>
    </div>
  </div>
}
