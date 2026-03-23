import { NextRequest, NextResponse } from 'next/server'
import { restoreGame } from '@/lib/queries/admin'
import { verifyPassword, extractBearerToken } from '@/lib/auth'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const token = extractBearerToken(req.headers.get('Authorization'))
  if (!token || !verifyPassword(token)) {
    return NextResponse.json({ error: 'Wrong password, knave.' }, { status: 401 })
  }

  const success = restoreGame(id)
  if (!success) return NextResponse.json({ error: 'Game not found or not deleted' }, { status: 404 })

  return NextResponse.json({ success: true })
}
