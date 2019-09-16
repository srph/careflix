import s2o, { OriginalTrack } from '~/lib/srt2obj'
import fromReadableTime from '~/utils/date/fromReadableTime'

export interface Track {
  index: string
  timestamp: string
  start: number
  end: number
  text: string
}

/**
 * Transforms start & end from time string to number
 *
 * { start: '00:00:03,300' } -> { start: 3 }
 * { end: '00:00:04,000' } -> { end: 4 }
 */
export function srt2obj(str: string): Track[] {
  const result: OriginalTrack[] = s2o(str)

  return result.map((track: OriginalTrack) => {
    return {
      ...track,
      start: fromReadableTime(track.start),
      end: fromReadableTime(track.end)
    }
  })
}