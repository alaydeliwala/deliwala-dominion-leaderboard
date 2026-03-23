import { NextRequest, NextResponse } from 'next/server'
import { getGameById } from '@/lib/queries/games'
import { softDeleteGame } from '@/lib/queries/admin'
import { verifyPassword, extractBearerToken } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const game = getGameById(id)
  if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 })

  return NextResponse.json({ game })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const token = extractBearerToken(req.headers.get('Authorization'))
  if (!token || !verifyPassword(token)) {
    return NextResponse.json({ error: 'Wrong password, knave.' }, { status: 401 })
  }

  const success = softDeleteGame(id)
  if (!success) return NextResponse.json({ error: 'Game not found or already deleted' }, { status: 404 })

  return NextResponse.json({ success: true })
}
