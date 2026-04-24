function parseDbDate(dateStr: string): Date {
  // SQLite datetime format: YYYY-MM-DD HH:MM:SS (UTC)
  if (dateStr.includes(' ')) {
    return new Date(dateStr.replace(' ', 'T') + 'Z')
  }
  // Date-only string: YYYY-MM-DD — treat as local midnight so it displays
  // as the same calendar date in the browser's local timezone.
  return new Date(dateStr + 'T00:00:00')
}

export function formatDate(dateStr: string): string {
  const date = parseDbDate(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(dateStr: string): string {
  const date = parseDbDate(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function daysSince(dateStr: string): number {
  const date = parseDbDate(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

export function formatWinRate(rate: number): string {
  return (rate * 100).toFixed(1) + '%'
}

export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max)
}
