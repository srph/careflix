/**
 * Class lists the show details sheet and its loading placeholders both use, so a skeleton
 * always sits in the same box as the thing it stands in for. Phone layout first; `sm` adds the desktop sheet.
 */

/** The column under the hero that holds the tabs and their panels, or the placeholder for them. */
export const TAB_COLUMN = 'flex min-h-0 flex-1 flex-col'
/** The row of tabs. The hairline is a shadow so the selected tab's underline can sit on top of it. */
export const TAB_BAR = 'flex px-6 shadow-[inset_0_-1px_0_var(--color-neutral-800)] sm:px-9'
/** A tab panel: it scrolls inside the sheet's fixed height. */
export const PANE = 'min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 pt-5.5 pb-8 [scrollbar-color:var(--color-neutral-700)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] focus-visible:-outline-offset-6 sm:px-9 sm:pb-8.5'

/** A line that says something is empty or went wrong. `STATUS_BAND` is the same line outside a panel. */
export const STATUS = 'leading-relaxed text-neutral-300'
export const STATUS_BAND = `shrink-0 px-6 py-3.5 sm:px-9 ${STATUS}`
/** A button that reads as a link inside a sentence, such as Retry. */
export const TEXT_BUTTON = 'cursor-pointer border-0 bg-transparent px-1 py-0.5 leading-[inherit] text-white underline'

export const EPISODE_HEADING = 'flex items-center gap-3.5'
export const EPISODE_GRID = 'mt-4.5 grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-[repeat(auto-fill,minmax(min(196px,100%),1fr))] sm:gap-x-3.5'
export const EPISODE_ART = 'relative block aspect-video overflow-hidden rounded-lg ring-1 ring-neutral-800'

/** A row in the party history. Each row after the first draws a hairline above itself. */
export const PARTY_ROW_LINE = 'not-first:shadow-[0_-1px_0_var(--color-neutral-800)]'
