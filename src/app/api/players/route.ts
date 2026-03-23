import { NextResponse } from 'next/server'
import { PLAYERS } from '@/lib/players'

export async function GET() {
  return NextResponse.json({ players: PLAYERS })
}
