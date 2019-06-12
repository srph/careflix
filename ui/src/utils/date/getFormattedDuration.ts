import getRemainingTime from './getRemainingTime'

/**
 * Unlike `getFormattedRemainingTime`, this simply asks for the duration.
 */
export default function getFormattedDuration(seconds: number): string {
  const remaining = getRemainingTime(seconds)
  
  if (remaining.hours >= 1) {
    return `${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`
  }

  if (remaining.minutes >= 1) {
    return `${remaining.minutes}m ${remaining.seconds}s`
  }

  return `${remaining.seconds}s`
}