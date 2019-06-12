import getFormattedDuration from './getFormattedDuration'

// In a string like 2h 35m 31s, we'll match "31s".
const SECONDS_REGEX = /[0-9]{1,2}s$/

/**
 * Unlike `getFormattedRemainingTime`, this simply asks for the duration.
 *
 * @NOTE BEWARE! This function assumes that the duration will be over 60 seconds.
 * Otherwise we'll get a blank string!
 */
export default function getFormattedDurationWithoutSeconds(seconds: number): string {
  return getFormattedDuration(seconds)
    .replace(SECONDS_REGEX, '')
    .trimRight()
}
