import { getDb } from '@/lib/db'
import { PLAYER_BY_ID } from '@/lib/players'
import type { Game, GameParticipant } from '@/types'

interface RawParticipant {
  id: number
  game_id: number
  player_id: number
  score: number
  position: number
}

interface RawGame {
  id: number
  played_at: string
  notes: string | null
  kingdom: string | null
  created_at: string
  deleted_at: string | null
  deleted_by: number | null
}

function parseGame(raw: RawGame, participants: RawParticipant[]): Game {
  return {
    ...raw,
    kingdom: raw.kingdom ? JSON.parse(raw.kingdom) : null,
    participants: participants
      .filter((p) => p.game_id === raw.id)
      .map((p) => ({ ...p, player: PLAYER_BY_ID[p.player_id] }))
      .sort((a, b) => a.position - b.position),
  }
}

export function getActiveGames(limit?: number): Game[] {
  const db = getDb()
  const games = db
    .prepare(
      `SELECT * FROM games WHERE deleted_at IS NULL ORDER BY played_at DESC, id DESC ${limit ? 'LIMIT ?' : ''}`
    )
    .all(...(limit ? [limit] : [])) as RawGame[]

  if (games.length === 0) return []

  const ids = games.map((g) => g.id)
  const participants = db
    .prepare(
      `SELECT * FROM game_participants WHERE game_id IN (${ids.map(() => '?').join(',')}) ORDER BY position ASC`
    )
    .all(...ids) as RawParticipant[]

  return games.map((g) => parseGame(g, participants))
}

export function getGameById(id: number): Game | null {
  const db = getDb()
  const game = db.prepare('SELECT * FROM games WHERE id = ?').get(id) as RawGame | undefined
  if (!game) return null

  const participants = db
    .prepare('SELECT * FROM game_participants WHERE game_id = ? ORDER BY position ASC')
    .all(id) as RawParticipant[]

  return parseGame(game, participants)
}

export interface CreateGameInput {
  played_at: string
  notes?: string
  kingdom?: string[]
  participants: { player_id: number; score: number; position: number }[]
}

export function createGame(input: CreateGameInput): Game {
  const db = getDb()

  const insertGame = db.prepare(
    'INSERT INTO games (played_at, notes, kingdom) VALUES (?, ?, ?)'
  )
  const insertParticipant = db.prepare(
    'INSERT INTO game_participants (game_id, player_id, score, position) VALUES (?, ?, ?, ?)'
  )

  const run = db.transaction(() => {
    const result = insertGame.run(
      input.played_at,
      input.notes ?? null,
      input.kingdom ? JSON.stringify(input.kingdom) : null
    )
    const gameId = result.lastInsertRowid as number
    for (const p of input.participants) {
      insertParticipant.run(gameId, p.player_id, p.score, p.position)
    }
    return gameId
  })

  const gameId = run()
  return getGameById(gameId)!
}
