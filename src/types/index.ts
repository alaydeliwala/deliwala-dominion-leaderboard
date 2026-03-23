export interface Player {
  id: number
  name: string
  nickname: string
  slug: string
  houseWords: string
  color: string
  initials: string
}

export interface GameParticipant {
  id: number
  game_id: number
  player_id: number
  score: number
  position: number
  player?: Player
}

export interface Game {
  id: number
  played_at: string
  notes: string | null
  kingdom: string[] | null
  created_at: string
  deleted_at: string | null
  deleted_by: number | null
  participants: GameParticipant[]
}

export interface PlayerStats {
  player: Player
  wins: number
  losses: number
  games: number
  win_rate: number
  avg_score: number
  best_score: number
  worst_score: number
  total_vp: number
  current_streak: number
  streak_type: 'win' | 'loss' | 'none'
  longest_win_streak: number
  longest_loss_streak: number
}

export interface HeadToHeadEntry {
  player1_id: number
  player2_id: number
  player1_wins: number
  player2_wins: number
  games: number
}

export interface FunnyStats {
  longest_drought: string | null
  current_win_streak: string | null
  most_lopsided_game: string | null
  dominant_duo: string | null
  total_vp_leader: string | null
  highest_single_score: string | null
  longest_loss_streak_ever: string | null
}

export interface LeaderboardPayload {
  rankings: PlayerStats[]
  head_to_head: HeadToHeadEntry[]
  funny_stats: FunnyStats
  recent_games: Game[]
  total_games: number
}
