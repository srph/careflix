import kebabCase from 'lodash.kebabcase'

const raw = {
  TOP_LEFT_SUBTITLE: '{\\an7}',
  TOP_CENTER_SUBTITLE: '{\\an8}',
  TOP_RIGHT_SUBTITLE: '{\\an9}',
  MIDDLE_LEFT_SUBTITLE: '{\\an4}',
  MIDDLE_CENTER_SUBTITLE: '{\\an5}',
  MIDDLE_RIGHT_SUBTITLE: '{\\an6}',
  BOTTOM_LEFT_SUBTITLE: '{\\an1}',
  BOTTOM_CENTER_SUBTITLE: '{\\an2}',
  BOTTOM_RIGHT_SUBTITLE: '{\\an3}',
}

interface SubtitlePlacement {
  className: string
  indicator: string
}

const placements: SubtitlePlacement[] = Object.keys(raw)
  .map(key => ({
    className: `is-${kebabCase(key)}`,
    indicator: raw[key]
  }))

const HAS_PLACEMENT_PATTERN = /{\\an\d}/

export { placements, HAS_PLACEMENT_PATTERN }