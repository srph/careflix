import { SLIDE_MARGIN, SLIDE_COUNT } from './constants'

interface GetOffsetPayload {
  active: number
  width: number
  hoverWidth: number
}

/**
 * Get scale and translate offset
 */
export function getOffset({ active, width, hoverWidth }: GetOffsetPayload): number {
  if (active === 0) {
    return (hoverWidth - width) / 2
  }

  if (active === SLIDE_COUNT - 1) {
    return -((hoverWidth - width) / 2)
  }

  return 0
}

interface StyleObject {
  transition?: string
  transform?: string
}

/**
 * Get the styles for each item
 */
export function getStyles({
  active,
  data,
  offset,
  scale,
  translate
}: {
  data: any[]
  active: number
  offset: number
  scale: number
  translate: number
}): StyleObject[] {
  return data.map((_, i) => {
    if (active === -1) {
      return {
        transition: '400ms all ease',
        transform: 'translateX(0) scale(1)'
      }
    }

    if (active === i) {
      return {
        transition: '400ms all ease',
        transform: `translateX(${offset}px) scale(${scale})`
      }
    }

    if (i < active) {
      return {
        transition: '400ms all ease',
        transform: `translateX(-${translate - offset}px) scale(1)`
      }
    }

    if (i > active) {
      return {
        transition: '400ms all ease',
        transform: `translateX(${translate + offset}px) scale(1)`
      }
    }

    return {}
  })
}
