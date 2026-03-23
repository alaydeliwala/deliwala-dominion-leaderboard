import { NextResponse } from 'next/server'
import { getLeaderboardStats } from '@/lib/queries/stats'

export async function GET() {
  try {
    const payload = getLeaderboardStats()
    return NextResponse.json(payload)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to compute stats' }, { status: 500 })
  }
}
