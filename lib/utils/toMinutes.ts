export default function toMinutes(seconds: number): string {
  const m = Math.floor(seconds / 60) // دقیقه
  const s = seconds % 60 // باقی‌مانده ثانیه
  return ` ${m} دقیقه و  ${s} ثانیه `
}
