import readingTime from 'reading-time'
import ms2Minutes from './ms2Minutes'

export default function calculateReadingTimeInMinutes(plainText: string) {
  const stats = readingTime(plainText)
  return ms2Minutes(stats.time)
}
