import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { useDebouncedCallback } from 'use-debounce'
import ComboboxInput from '@/components/ui/combobox-input'
import CheckboxInput from '@/components/input/checkbox'
import { useUrlFilter } from '@/hooks/use-url-filter'
import { DashboardLocaleSchema } from '@/lib/i18n/dashboard'

interface FiltersProps<T> {
  table: Table<T>
  dictianory: DashboardLocaleSchema
}

export function Filters<T>({ table, dictianory }: FiltersProps<T>) {
  const { setFilter, searchParams, isPending } = useUrlFilter()

  const handleChange = useDebouncedCallback((name: string, value: string) => {
    setFilter(name, value ?? null)
  }, 500)
  return (
    <div className="flex gap-4 flex-wrap">
      {table.getAllColumns().map((column) => {
        const config = column.columnDef.meta?.filterConfig
        if (!config) return null

        const key = (column.columnDef?.accessorKey as string) ?? column.id
        const title = (column.columnDef?.header as string) ?? column.id
        const filterValue = searchParams.get(key)?.toString() ?? ''

        switch (config.type) {
          case 'text':
            return (
              <Input
                key={column.id}
                placeholder={`${dictianory.shared.filter} ${title}...`}
                value={filterValue ?? ''}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-40"
              />
            )
          case 'select':
            return (
              <ComboboxInput
                key={column.id}
                name="templateFor"
                defaultValue={filterValue ?? ''}
                {...(config.options ? { options: config.options } : {})}
                {...(config.fetchOptions
                  ? { fetchOptions: config.fetchOptions }
                  : {})}
                placeholder={`${dictianory.shared.filter} ${title}`}
                onChange={({ target }) => handleChange(key, target.value)}
                showClean={true}
              />
            )

          case 'boolean':
            return (
              <div key={column.id} className="flex items-center space-x-2">
                <CheckboxInput
                  checked={filterValue === 'true'}
                  onCheckedChange={(checked) =>
                    handleChange(key, checked ? 'true' : undefined)
                  }
                />
                <span>{column.id}</span>
              </div>
            )
        }
      })}
    </div>
  )
}
