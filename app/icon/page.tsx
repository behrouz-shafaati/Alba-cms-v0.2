'use client'
import { useState, useMemo } from 'react'
import { icons } from 'lucide-react' // توجه: این بار *as Icons نیست

type IconName = keyof typeof icons

function LucideIconGallery() {
  const [search, setSearch] = useState('')

  const iconEntries = useMemo(() => {
    const entries = Object.entries(icons) as [
      IconName,
      React.ComponentType<any>,
    ][]
    return entries.filter(([name]) =>
      name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

  return (
    <div style={{ padding: 20 }}>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search icons..."
        style={{
          padding: 8,
          marginBottom: 20,
          width: '100%',
          borderRadius: 8,
          border: '1px solid #ccc',
        }}
      />

      <div style={{ marginBottom: 10, fontSize: 12, color: '#666' }}>
        Found {iconEntries.length} icons
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 16,
        }}
      >
        {iconEntries.map(([name, Icon]) => (
          <div
            key={name}
            style={{
              textAlign: 'center',
              padding: 10,
              border: '1px solid #eee',
              borderRadius: 8,
            }}
          >
            <Icon size={64} strokeWidth={1.75} />
            <div style={{ marginTop: 6, fontSize: 11 }}>{name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <html>
      <body>
        <LucideIconGallery />
      </body>
    </html>
  )
}
