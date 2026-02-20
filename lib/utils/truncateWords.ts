export default function truncateWords(text: string, limit = 15) {
  if (!text) return ''
  const words = text.split(' ')
  return words.length > limit ? words.slice(0, limit).join(' ') + '…' : text
}
