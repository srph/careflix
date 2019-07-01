/**
 * Get the number of seconds from readable time (01:03:20,200 -> 3800)
 */
function fromReadableTime(time: string): number {
  const [hour, minute, seconds] = time.split(',')[0].split(':')

  return (
    (Number(hour) * 60 * 60) +
    (Number(minute) * 60) +
    Number(seconds)
  )
}

export default fromReadableTime