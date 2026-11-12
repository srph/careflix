import cx, { type Argument } from 'classnames'
import { extendTailwindMerge } from 'tailwind-merge'

/** Tells tailwind-merge about the tokens added in tailwind.css, so `text-13` replaces `text-sm` and so on. */
const merge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['10', '11', '13'],
      font: ['label'],
      tracking: ['label'],
      shadow: ['pop', 'menu', 'modal', 'glow'],
      'text-shadow': ['default', 'outline'],
      animate: [
        'skeleton',
        'sweep',
        'fill',
        'blink',
        'shake',
        'status-in',
        'typing-dot',
        'busy-dot',
        'now-playing',
        'fade-out'
      ],
      ease: ['out-soft', 'emphasized', 'out-back', 'in-circ', 'out-circ', 'in-out-expo']
    }
  }
})

/**
 * Joins class names like `classnames`, then lets a later Tailwind class win over an earlier one
 * that sets the same thing. Primitives use it so a `className` passed in can override their own classes.
 */
export function cn(...args: Argument[]): string {
  return merge(cx(...args))
}
