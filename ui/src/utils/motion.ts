/**
 * Easing curves for Motion, which can't read the --ease-* tokens in tailwind.css.
 * Each one mirrors the token of the same name; change both together.
 */
type CubicBezier = [number, number, number, number]

/** --ease-out-soft: the house curve. */
export const easeOutSoft: CubicBezier = [0.2, 0.8, 0.2, 1]
