import { NextRequest, NextResponse } from 'next/server'
import { getPlayerStats } from '@/lib/queries/stats'
import { PLAYER_BY_SLUG } from '@/lib/players'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  // id can be numeric id or slug
  const player = PLAYER_BY_SLUG[params.id]
  const playerId = player?.id ?? parseInt(params.id)

  if (!playerId || isNaN(playerId)) {
    return NextResponse.json({ error: 'Player not found' }, { status: 404 })
  }

  const stats = getPlayerStats(playerId)
  if (!stats) return NextResponse.json({ error: 'Player not found' }, { status: 404 })

  return NextResponse.json(stats)
}
