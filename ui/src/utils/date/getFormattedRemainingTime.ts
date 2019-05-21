import { differenceInSeconds } from 'date-fns'
import getRemainingTime from './getRemainingTime'

type Payload = Date | string | number

/**
 * Formats the remaining time (5h 4m 3s)
 */
export default function getFormattedRemainingTime(date1: Payload, date2: Payload) {
  const remaining = getRemainingTime(differenceInSeconds(date1, date2))
  
  if (remaining.hours >= 1) {
    return `${remaining.hours}h ${remaining.minutes}m ${remaining.seconds}s`
  }

  if (remaining.minutes >= 1) {
    return `${remaining.minutes}m ${remaining.seconds}s`
  }

  return `${remaining.seconds}s`
}