import { getDb } from '@/lib/db'
import { PLAYER_BY_ID } from '@/lib/players'
import type { Game, GameParticipant } from '@/types'

interface RawGame {
  id: number
  played_at: string
  notes: string | null
  kingdom: string | null
  created_at: string
  deleted_at: string | null
  deleted_by: number | null
}

interface RawParticipant {
  id: number
  game_id: number
  player_id: number
  score: number
  position: number
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

export function getDeletedGames(): Game[] {
  const db = getDb()
  const games = db
    .prepare('SELECT * FROM games WHERE deleted_at IS NOT NULL ORDER BY deleted_at DESC')
    .all() as RawGame[]

  if (games.length === 0) return []

  const ids = games.map((g) => g.id)
  const participants = db
    .prepare(
      `SELECT * FROM game_participants WHERE game_id IN (${ids.map(() => '?').join(',')}) ORDER BY position ASC`
    )
    .all(...ids) as RawParticipant[]

  return games.map((g) => parseGame(g, participants))
}

export function softDeleteGame(id: number, deletedBy?: number): boolean {
  const db = getDb()
  const result = db
    .prepare(
      "UPDATE games SET deleted_at = datetime('now'), deleted_by = ? WHERE id = ? AND deleted_at IS NULL"
    )
    .run(deletedBy ?? null, id)
  return result.changes > 0
}

export function restoreGame(id: number): boolean {
  const db = getDb()
  const result = db
    .prepare('UPDATE games SET deleted_at = NULL, deleted_by = NULL WHERE id = ? AND deleted_at IS NOT NULL')
    .run(id)
  return result.changes > 0
}
