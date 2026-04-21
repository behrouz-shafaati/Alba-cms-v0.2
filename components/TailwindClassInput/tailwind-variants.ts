// components/ui/TailwindClassInput/tailwind-variants.ts

export const TAILWIND_VARIANTS = [
  // Responsive
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
  // Pseudo-class
  'hover',
  'focus',
  'focus-within',
  'focus-visible',
  'active',
  'visited',
  'checked',
  'disabled',
  'enabled',
  'required',
  'optional',
  'read-only',
  'placeholder',
  'first',
  'last',
  'odd',
  'even',
  'first-of-type',
  'last-of-type',
  'only-child',
  'empty',
  // Group / Peer
  'group-hover',
  'group-focus',
  'group-active',
  'group-disabled',
  'peer-hover',
  'peer-focus',
  'peer-checked',
  'peer-disabled',
  // Pseudo-element
  'before',
  'after',
  'placeholder',
  'file',
  'marker',
  'selection',
  'first-line',
  'first-letter',
  // State
  'open',
  'not-sr-only',
  // Dark mode
  'dark',
  // Print
  'print',
  // Motion
  'motion-safe',
  'motion-reduce',
  // Contrast
  'contrast-more',
  'contrast-less',
  // RTL / LTR
  'rtl',
  'ltr',
  // Arbitrary variants (نشانه)
  'portrait',
  'landscape',
  // Combine responsive + state (multi-level)
  'sm:hover',
  'md:hover',
  'lg:hover',
  'sm:focus',
  'md:focus',
  'lg:focus',
  'dark:hover',
  'dark:focus',
] as const

export type TailwindVariant = (typeof TAILWIND_VARIANTS)[number]
