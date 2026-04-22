'use client'

import { formatDate, formatDateShort } from '@/lib/utils'

export function ClientDate({ dateStr }: { dateStr: string }) {
  return <>{formatDate(dateStr)}</>
}

export function ClientDateShort({ dateStr }: { dateStr: string }) {
  return <>{formatDateShort(dateStr)}</>
}
