import clsx from 'clsx'

export default function GridPreview({
  value,
  active = false,
}: {
  value: string
  active?: boolean
}) {
  const cols = value.split('-').map(Number)

  return (
    <div className="flex h-5 w-16 overflow-hidden rounded bg-muted">
      {cols.map((c, i) => (
        <div
          key={i}
          className={clsx(
            'h-full border-r last:border-r-0',
            active ? 'bg-primary' : 'bg-foreground/80 dark:bg-foreground/60'
          )}
          style={{ width: `${(c / 12) * 100}%` }}
        />
      ))}
    </div>
  )
}
