import { describe, expect, it } from 'vitest'
import { cn } from './cn'

describe('cn', () => {
  it('joins class names and skips falsy ones', () => {
    expect(cn('flex', false && 'hidden', { 'opacity-50': true, underline: false })).toBe('flex opacity-50')
  })

  it('lets a later class override an earlier one for the same property', () => {
    expect(cn('h-8 px-3', 'h-9')).toBe('px-3 h-9')
  })

  it('treats the custom font sizes as font sizes, not colours', () => {
    expect(cn('text-sm text-white', 'text-13')).toBe('text-white text-13')
  })

  it('knows the custom shadow and easing tokens', () => {
    expect(cn('shadow-pop ease-out', 'shadow-glow ease-out-soft')).toBe('shadow-glow ease-out-soft')
  })
})
