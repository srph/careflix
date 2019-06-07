import { format } from 'date-fns'

/**
 * Gives you a mysql standard formatted datetime
 * e.g., 2018-08-08 23:00:00
 */
function getStandardFormattedDateTime(date: Date = new Date()) {
  return format(date, 'YYYY-MM-DD HH-mm-ss')
}

export default getStandardFormattedDateTime