import { NextRequest, NextResponse } from 'next/server'
import { getActiveGames, createGame } from '@/lib/queries/games'
import { PLAYERS } from '@/lib/players'

export async function GET() {
  try {
    const games = getActiveGames()
    return NextResponse.json({ games })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch games' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { played_at, notes, kingdom, participants } = body

    if (!played_at || typeof played_at !== 'string') {
      return NextResponse.json({ error: 'played_at is required' }, { status: 400 })
    }
    if (!Array.isArray(participants) || participants.length < 2) {
      return NextResponse.json({ error: 'At least 2 participants required' }, { status: 400 })
    }

    const validIds = new Set(PLAYERS.map((p) => p.id))
    for (const p of participants) {
      if (!validIds.has(p.player_id)) {
        return NextResponse.json({ error: `Invalid player_id: ${p.player_id}` }, { status: 400 })
      }
      if (typeof p.score !== 'number') {
        return NextResponse.json({ error: 'Each participant needs a numeric score' }, { status: 400 })
      }
      if (typeof p.position !== 'number' || p.position < 1) {
        return NextResponse.json({ error: 'Each participant needs a valid position' }, { status: 400 })
      }
    }

    const winners = participants.filter((p: { position: number }) => p.position === 1)
    if (winners.length !== 1) {
      return NextResponse.json({ error: 'Exactly one participant must have position 1' }, { status: 400 })
    }

    const game = createGame({ played_at, notes, kingdom, participants })
    return NextResponse.json({ game }, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create game' }, { status: 500 })
  }
}
