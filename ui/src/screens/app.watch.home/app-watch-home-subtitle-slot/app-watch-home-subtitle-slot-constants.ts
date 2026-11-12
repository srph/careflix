const VERTICAL = { bottom: 'bottom-0', middle: 'top-1/2 -translate-y-1/2', top: 'top-0' }
const HORIZONTAL = { left: 'text-left', center: 'text-center', right: 'text-right' }

interface SubtitlePlacement {
  key: string
  vertical: keyof typeof VERTICAL
  className: string
  indicator: string
}

/**
 * The nine places a subtitle can sit. A cue picks one with a tag numbered like a keypad:
 * {\an1} is bottom left, {\an5} the middle, {\an9} top right.
 */
const placements: SubtitlePlacement[] = (['bottom', 'middle', 'top'] as const).flatMap((vertical, row) =>
  (['left', 'center', 'right'] as const).map((horizontal, column) => ({
    key: `${vertical}-${horizontal}`,
    vertical,
    className: `${VERTICAL[vertical]} ${HORIZONTAL[horizontal]}`,
    indicator: `{\\an${row * 3 + column + 1}}`
  })))

const HAS_PLACEMENT_PATTERN = /{\\an\d}/

export { placements, HAS_PLACEMENT_PATTERN }
