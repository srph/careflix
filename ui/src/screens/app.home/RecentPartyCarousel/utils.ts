import { SLIDE_HOVER_WIDTH, SLIDE_MARGIN } from './constants'

/**
 * Get scale and translate offset
 */
export function getOffset({ active, data }: { active: number; data: any[] }): number {
  if (active === 0) {
    return SLIDE_HOVER_WIDTH / 4 - SLIDE_MARGIN * 4
  }

  if (active === data.length - 1) {
    return -(SLIDE_HOVER_WIDTH / 4 - SLIDE_MARGIN * 4)
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
