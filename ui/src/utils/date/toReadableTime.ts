import getRemainingTime from './getRemainingTime'

interface Settings {
  // This will allow us to display 00:00:32
  // i.e., toReadableTime(time, { max: duration > 3600 ? 'hh' : 'mm' })
  max?: 'hh' | 'mm'
}

/**
 * Converts seconds to colon-separated time (e.g., 03:45:24, 45:34, 34)
 */
export default function toReadableTime(seconds: number, settings: Settings = {}): string {
  const remaining = getRemainingTime(seconds)
  const hh = remaining.hours
  const mm = remaining.minutes
  const ss = remaining.seconds

  if (hh >= 1 || settings.max === 'hh') {
    return [hh, mm, ss].map(t => String(t).padStart(2, '0')).join(':')
  }

  if (mm >= 1 || settings.max === 'mm') {
    return [mm, ss].map(t => String(t).padStart(2, '0')).join(':')
  }

  return `${ss}`
}