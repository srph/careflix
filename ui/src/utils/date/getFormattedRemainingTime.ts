import { differenceInSeconds } from 'date-fns'
import getRemainingTime from './getRemainingTime'

type Payload = Date | string | number

/**
 * Formats the remaining time (5h 4m 3s)
 */
export default function getFormattedRemainingTime(future: Payload, present: Payload) {
  const remaining = getRemainingTime(differenceInSeconds(future, present))
  
  if (remaining.hours >= 1) {
    return `${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`
  }

  if (remaining.minutes >= 1) {
    return `${remaining.minutes}m ${remaining.seconds}s`
  }

  return `${remaining.seconds}s`
}