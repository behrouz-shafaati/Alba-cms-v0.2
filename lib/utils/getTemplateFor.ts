export default function getTemplateFor(templateFor: string): string {
  if (!templateFor) return 'allPages'
  const parts = templateFor[0].split('-')
  return parts[0] || templateFor
}
