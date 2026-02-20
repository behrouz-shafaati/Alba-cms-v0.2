import { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

const maskValue = (value: string = '') => {
  console.log('#23487 maskValue called with:', value)
  const input = String(value).replace(/,/g, '') // حذف کاماهای قبلی

  // فقط اعداد و یک نقطه مجاز
  if (!/^\d*\.?\d*$/.test(input)) return

  // جدا کردن قسمت صحیح و اعشاری
  let [integerPart, decimalPart] = input.split('.')

  // فرمت ۳رقم ۳رقم روی قسمت صحیح
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  const formatted =
    decimalPart !== undefined ? `${integerPart}.${decimalPart}` : integerPart
  return formatted
}

type Text = {
  title: string
  name: string
  id?: string
  defaultValue?: string
  placeholder?: string
  description?: string
  icon?: any
  state?: any
  value?: string
  display?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  onChange?: (e: any) => void
}
const NumberInput = ({
  title,
  name,
  id,
  defaultValue,
  placeholder,
  description,
  icon,
  state,
  value,
  display = true,
  disabled = false,
  readOnly = false,
  className = '',
  onChange,
}: Text) => {
  const [displayValue, setDisplayValue] = useState('') // مقدار فرمت‌شده
  const [rawValue, setRawValue] = useState(value || defaultValue || '') // مقدار واقعی (برای hidden input)
  useEffect(() => {
    setDisplayValue(maskValue(value || defaultValue))
  }, [value, defaultValue])
  if (!display) return null
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(maskValue(e.target.value))
    setRawValue(e.target.value)
    if (onChange) onChange(e)
  }

  return (
    <div className={`${className}`}>
      <input type="hidden" name={name} value={rawValue} />
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <div className="relative">
        <Input
          onChange={handleChange}
          id={id || name}
          type="text"
          value={displayValue}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          className="peer"
        />
        {icon && (
          <span className="pointer-events-none absolute end-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500">
            <InputIcon />
          </span>
        )}
      </div>
      {description && (
        <span className="text-xs text-gray-500">{description}</span>
      )}
      {hasError && (
        <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
          {errorMessages.map((error: string) => (
            <p className="mt-2 text-xs text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default NumberInput
