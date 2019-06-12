interface RemainingTimeValue {
  hours: number
  minutes: number
  seconds: number
}

/**
 * Get remaining time from seconds
 * 
 * Used by `toReadableTime` and `distanceInWordsAbbreivated`
 * 
 * @TODO Rename to `getDuration`, maybe?
 */
export default function getRemainingTime(seconds: number): RemainingTimeValue {
  const hh = Math.floor(seconds / 3600)
  const mm = Math.floor((seconds % 3600 / 60))
  const ss = Math.floor(seconds % 60)

  return {
    hours: hh,
    minutes: mm,
    seconds: ss
  }
}