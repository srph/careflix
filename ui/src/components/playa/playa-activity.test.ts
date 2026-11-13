import { describe, expect, it } from 'vitest'
import { hypeFor, movieTime, seekDirection, typingLabel } from './playa-activity'

describe('activity copy', () => {
  it('formats movie time the way the player does', () => {
    expect(movieTime(0)).toBe('0:00')
    expect(movieTime(2472)).toBe('41:12')
    expect(movieTime(3735)).toBe('1:02:15')
  })

  it('tells a jump back from a skip ahead, and admits when it cannot', () => {
    expect(seekDirection({ from: 2481, to: 2327 })).toBe('back')
    expect(seekDirection({ from: 2481, to: 3000 })).toBe('ahead')
    // Rows recovered from old text have no starting point.
    expect(seekDirection({ to: 2327 })).toBeNull()
  })

  it('gives each friend the same hype line every time', () => {
    expect(hypeFor(7)).toEqual(hypeFor('7'))
    const lines = new Set(Array.from({ length: 40 }, (_, id) => hypeFor(id)[1]))
    expect(lines.size).toBe(5)
  })

  it('names up to two typers, then counts', () => {
    expect(typingLabel([])).toBeNull()
    expect(typingLabel(['Joyce'])).toEqual({ subject: 'Joyce', verb: 'is typing' })
    expect(typingLabel(['Joyce', 'Mira'])).toEqual({ subject: 'Joyce and Mira', verb: 'are typing' })
    expect(typingLabel(['Joyce', 'Mira', 'Leo'])).toEqual({ subject: '3 people', verb: 'are typing' })
  })
})
