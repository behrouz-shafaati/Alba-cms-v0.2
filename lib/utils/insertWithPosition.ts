export default function insertWithPosition<T>(
  list: T[],
  item: T,
  position: 'start' | 'end' | number = 'end'
): T[] {
  let _p = position === null || position === undefined ? 'end' : position
  if (typeof position === 'number') {
    if (position < 0) _p = 'end'
  }
  if (_p === 'start') return [item, ...list]
  if (_p === 'end') return [...list, item]

  const index = Math.max(0, Math.min(_p, list.length))
  return [...list.slice(0, index), item, ...list.slice(index)]
}
