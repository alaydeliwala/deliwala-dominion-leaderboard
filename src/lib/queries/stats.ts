import { getDb } from '@/lib/db'
import { PLAYERS, PLAYER_BY_ID } from '@/lib/players'
import { daysSince, formatDateShort } from '@/lib/utils'
import type { PlayerStats, HeadToHeadEntry, FunnyStats, LeaderboardPayload, Game } from '@/types'
import { getActiveGames } from './games'

interface RawParticipantRow {
  game_id: number
  player_id: number
  score: number
  position: number
  played_at: string
}

function computeStreaks(games: RawParticipantRow[]): {
  current: number
  type: 'win' | 'loss' | 'none'
  longestWin: number
  longestLoss: number
} {
  if (games.length === 0) return { current: 0, type: 'none', longestWin: 0, longestLoss: 0 }

  // games sorted newest-first — walk from start for current streak
  let current = 0
  let type: 'win' | 'loss' | 'none' = 'none'

  if (games[0].position === 1) {
    type = 'win'
    for (const g of games) {
      if (g.position !== 1) break
      current++
    }
  } else {
    type = 'loss'
    for (const g of games) {
      if (g.position === 1) break
      current++
    }
  }

  // Walk all games (oldest first) for longest streaks
  const reversed = [...games].reverse()
  let longestWin = 0
  let longestLoss = 0
  let curWin = 0
  let curLoss = 0

  for (const g of reversed) {
    if (g.position === 1) {
      curWin++
      curLoss = 0
      longestWin = Math.max(longestWin, curWin)
    } else {
      curLoss++
      curWin = 0
      longestLoss = Math.max(longestLoss, curLoss)
    }
  }

  return { current, type, longestWin, longestLoss }
}

export function getLeaderboardStats(): LeaderboardPayload {
  const db = getDb()

  // All participant rows for non-deleted games
  const rows = db
    .prepare(
      `SELECT gp.game_id, gp.player_id, gp.score, gp.position, g.played_at
       FROM game_participants gp
       JOIN games g ON g.id = gp.game_id
       WHERE g.deleted_at IS NULL
       ORDER BY g.played_at DESC, g.id DESC`
    )
    .all() as RawParticipantRow[]

  const totalGames = db
    .prepare('SELECT COUNT(*) as cnt FROM games WHERE deleted_at IS NULL')
    .get() as { cnt: number }

  // Group by player
  const byPlayer: Record<number, RawParticipantRow[]> = {}
  for (const p of PLAYERS) byPlayer[p.id] = []
  for (const row of rows) {
    if (byPlayer[row.player_id]) byPlayer[row.player_id].push(row)
  }

  const rankings: PlayerStats[] = PLAYERS.map((player) => {
    const pRows = byPlayer[player.id]
    const wins = pRows.filter((r) => r.position === 1).length
    const games = pRows.length
    const losses = games - wins
    const scores = pRows.map((r) => r.score)
    const avgScore = games > 0 ? scores.reduce((a, b) => a + b, 0) / games : 0
    const { current, type, longestWin, longestLoss } = computeStreaks(pRows)

    return {
      player,
      wins,
      losses,
      games,
      win_rate: games > 0 ? wins / games : 0,
      avg_score: avgScore,
      best_score: scores.length > 0 ? Math.max(...scores) : 0,
      worst_score: scores.length > 0 ? Math.min(...scores) : 0,
      total_vp: scores.reduce((a, b) => a + b, 0),
      current_streak: current,
      streak_type: type,
      longest_win_streak: longestWin,
      longest_loss_streak: longestLoss,
    }
  })

  rankings.sort((a, b) => {
    if (b.win_rate !== a.win_rate) return b.win_rate - a.win_rate
    return b.wins - a.wins
  })

  // Head-to-head
  const h2hRows = db
    .prepare(
      `SELECT a.player_id as p1, b.player_id as p2,
              SUM(CASE WHEN a.position < b.position THEN 1 ELSE 0 END) as p1_wins,
              SUM(CASE WHEN b.position < a.position THEN 1 ELSE 0 END) as p2_wins,
              COUNT(*) as games
       FROM game_participants a
       JOIN game_participants b ON a.game_id = b.game_id AND a.player_id < b.player_id
       JOIN games g ON g.id = a.game_id
       WHERE g.deleted_at IS NULL
       GROUP BY a.player_id, b.player_id`
    )
    .all() as { p1: number; p2: number; p1_wins: number; p2_wins: number; games: number }[]

  const head_to_head: HeadToHeadEntry[] = h2hRows.map((r) => ({
    player1_id: r.p1,
    player2_id: r.p2,
    player1_wins: r.p1_wins,
    player2_wins: r.p2_wins,
    games: r.games,
  }))

  const funny_stats = computeFunnyStats(rankings, rows, head_to_head)
  const recent_games = getActiveGames(5)

  return {
    rankings,
    head_to_head,
    funny_stats,
    recent_games,
    total_games: totalGames.cnt,
  }
}

function computeFunnyStats(
  rankings: PlayerStats[],
  rows: RawParticipantRow[],
  h2h: HeadToHeadEntry[]
): FunnyStats {
  // Longest drought
  let longestDrought: string | null = null
  let maxDays = -1
  for (const s of rankings) {
    if (s.wins === 0) {
      longestDrought = `${s.player.name.split(' ')[0]} has never won a game. ${s.player.houseWords}`
      break
    }
    const lastWin = byPlayer_lastWin(rows, s.player.id)
    if (lastWin) {
      const days = daysSince(lastWin)
      if (days > maxDays) {
        maxDays = days
        const firstName = s.player.name.split(' ')[0]
        const label = firstName === 'Hiren' ? 'Dad' : firstName === 'Komal' ? 'Mom' : firstName
        longestDrought =
          days === 0
            ? `${label} just won today. Enjoy it while it lasts.`
            : `${label} hasn't won since ${formatDateShort(lastWin)} — ${days} day${days !== 1 ? 's' : ''} of suffering.`
      }
    }
  }

  // Current win streak
  let currentWinStreak: string | null = null
  for (const s of rankings) {
    if (s.streak_type === 'win' && s.current_streak >= 2) {
      const firstName = s.player.name.split(' ')[0]
      currentWinStreak = `${firstName} is on a ${s.current_streak}-game winning streak. Someone stop them.`
      break
    }
  }

  // Most lopsided game
  let mostLopsided: string | null = null
  const db = getDb()
  const lopsidedRow = db
    .prepare(
      `SELECT g.id, g.played_at,
              MAX(gp.score) - MIN(gp.score) as spread,
              (SELECT player_id FROM game_participants WHERE game_id = g.id AND position = 1 LIMIT 1) as winner_id
       FROM games g
       JOIN game_participants gp ON gp.game_id = g.id
       WHERE g.deleted_at IS NULL
       GROUP BY g.id
       ORDER BY spread DESC
       LIMIT 1`
    )
    .get() as { id: number; played_at: string; spread: number; winner_id: number } | undefined

  if (lopsidedRow && lopsidedRow.spread > 0) {
    const winner = PLAYER_BY_ID[lopsidedRow.winner_id]
    const firstName = winner?.name.split(' ')[0] ?? 'Someone'
    mostLopsided = `Biggest blowout: ${firstName} won by ${lopsidedRow.spread} points on ${formatDateShort(lopsidedRow.played_at)}. Brutal.`
  }

  // Dominant duo
  let dominantDuo: string | null = null
  for (const entry of h2h) {
    if (entry.games >= 5) {
      const rate1 = entry.player1_wins / entry.games
      const rate2 = entry.player2_wins / entry.games
      if (rate1 >= 0.65 || rate2 >= 0.65) {
        const [winnerId, loserId, wins, total] =
          rate1 >= 0.65
            ? [entry.player1_id, entry.player2_id, entry.player1_wins, entry.games]
            : [entry.player2_id, entry.player1_id, entry.player2_wins, entry.games]
        const w = PLAYER_BY_ID[winnerId]
        const l = PLAYER_BY_ID[loserId]
        const wFirst = w?.name.split(' ')[0] ?? 'Player'
        const lFirst = l?.name.split(' ')[0] ?? 'Player'
        dominantDuo = `${wFirst} beats ${lFirst} ${wins} out of ${total} times. ${w?.nickname} dominates.`
        break
      }
    }
  }

  // Total VP leader
  const vpLeader = [...rankings].sort((a, b) => b.total_vp - a.total_vp)[0]
  const totalVpLeader = vpLeader?.total_vp > 0
    ? `${vpLeader.player.name.split(' ')[0]} has earned ${vpLeader.total_vp.toLocaleString()} total Victory Points. Impressive.`
    : null

  // Highest single score
  const highScoreRow = db
    .prepare(
      `SELECT gp.player_id, gp.score, g.played_at
       FROM game_participants gp
       JOIN games g ON g.id = gp.game_id
       WHERE g.deleted_at IS NULL
       ORDER BY gp.score DESC
       LIMIT 1`
    )
    .get() as { player_id: number; score: number; played_at: string } | undefined

  const highestSingleScore = highScoreRow && highScoreRow.score > 0
    ? `${PLAYER_BY_ID[highScoreRow.player_id]?.name.split(' ')[0] ?? 'Someone'}'s record: ${highScoreRow.score} Victory Points on ${formatDateShort(highScoreRow.played_at)}. Absolute dominance.`
    : null

  // Longest loss streak ever
  let longestLossStreakEver: string | null = null
  let maxLoss = 0
  let maxLossPlayer: PlayerStats | null = null
  for (const s of rankings) {
    if (s.longest_loss_streak > maxLoss) {
      maxLoss = s.longest_loss_streak
      maxLossPlayer = s
    }
  }
  if (maxLossPlayer && maxLoss >= 3) {
    const firstName = maxLossPlayer.player.name.split(' ')[0]
    longestLossStreakEver = `${firstName}'s historic ${maxLoss}-game cold streak. We don't talk about it.`
  }

  return {
    longest_drought: longestDrought,
    current_win_streak: currentWinStreak,
    most_lopsided_game: mostLopsided,
    dominant_duo: dominantDuo,
    total_vp_leader: totalVpLeader,
    highest_single_score: highestSingleScore,
    longest_loss_streak_ever: longestLossStreakEver,
  }
}

function byPlayer_lastWin(rows: RawParticipantRow[], playerId: number): string | null {
  // rows already sorted newest-first
  const win = rows.find((r) => r.player_id === playerId && r.position === 1)
  return win?.played_at ?? null
}

export function getPlayerStats(playerId: number): PlayerStats | null {
  const payload = getLeaderboardStats()
  return payload.rankings.find((r) => r.player.id === playerId) ?? null
}
