/**
 * Class lists the listing's real content and its loading placeholders both use, so a skeleton
 * always sits in the same box as the thing it stands in for. Phone layout first; `sm`, `lg` and `xl` add to it.
 */

/** The featured block: a stage, with a list of titles under it on phones and beside it from `sm`. */
export const FEATURED =
  'mx-5 mt-3 flex flex-col gap-2.5 sm:mx-6 sm:grid sm:h-105 sm:grid-cols-[minmax(0,1fr)_220px] sm:gap-3.5 lg:mx-10 lg:h-110 lg:grid-cols-[minmax(0,1fr)_260px] xl:grid-cols-[minmax(0,1fr)_300px]'
export const FEATURED_STAGE =
  'relative h-105 flex-none overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 sm:h-auto'
export const FEATURED_COPY =
  'absolute inset-x-6 bottom-7 max-w-135 sm:right-5 sm:bottom-7.5 lg:right-6 lg:left-7 xl:right-7.5 xl:bottom-9.5 xl:left-10'
export const FEATURED_LIST =
  'flex min-w-0 gap-1.5 overflow-x-auto px-0.5 pt-0.5 pb-2 [scrollbar-width:thin] sm:flex-col sm:overflow-x-visible sm:p-0'
export const FEATURED_LIST_ITEM = 'flex min-h-18 flex-[1_0_145px] sm:min-h-0 sm:flex-1'

export const SECTION_HEADING = 'mb-3.5 flex items-baseline gap-2 sm:mb-5 sm:gap-2.5'
export const SECTION_TITLE = 'text-xl font-bold tracking-[-.01em] sm:text-2xl'

export const PARTY_GRID =
  'grid grid-cols-1 gap-5 py-1.5 sm:grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] sm:gap-x-4 sm:gap-y-7.5'
export const PARTY_BADGES = 'absolute inset-x-2.5 top-2.5 flex justify-between gap-2'
export const PARTY_CONTENT = 'absolute inset-x-3.5 bottom-3'

export const SHOW_GRID =
  'grid grid-cols-2 gap-x-3 gap-y-5.5 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-6.5 lg:grid-cols-[repeat(auto-fill,minmax(min(230px,100%),1fr))]'

/** A thin track with a pink fill, used for playback progress. The fill is an `<i>` with a width. */
export const PROGRESS = 'overflow-hidden rounded-sm bg-white/19 *:block *:h-full *:rounded-[inherit] *:bg-pink-500'
