import { NextRequest, NextResponse } from 'next/server'
import { getDeletedGames } from '@/lib/queries/admin'
import { verifyPassword, extractBearerToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const token = extractBearerToken(req.headers.get('Authorization'))
  if (!token || !verifyPassword(token)) {
    return NextResponse.json({ error: 'Wrong password, knave.' }, { status: 401 })
  }

  const games = getDeletedGames()
  return NextResponse.json({ games })
}
