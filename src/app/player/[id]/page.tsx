import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PLAYER_BY_SLUG, PLAYERS } from '@/lib/players'
import { getLeaderboardStats } from '@/lib/queries/stats'
import { getActiveGames } from '@/lib/queries/games'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import Card from '@/components/ui/Card'
import { formatWinRate, formatDateShort } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return PLAYERS.map((p) => ({ id: p.slug }))
}

export default function PlayerPage({ params }: { params: { id: string } }) {
  const player = PLAYER_BY_SLUG[params.id]
  if (!player) notFound()

  const stats = getLeaderboardStats()
  const playerStats = stats.rankings.find((r) => r.player.id === player.id)
  const allGames = getActiveGames()
  const myGames = allGames.filter((g) => g.participants.some((p) => p.player_id === player.id))

  const rank = stats.rankings.findIndex((r) => r.player.id === player.id) + 1

  const h2hVsOthers = PLAYERS.filter((p) => p.id !== player.id).map((opponent) => {
    const entry = stats.head_to_head.find(
      (e) =>
        (e.player1_id === player.id && e.player2_id === opponent.id) ||
        (e.player1_id === opponent.id && e.player2_id === player.id)
    )
    if (!entry) return { opponent, wins: 0, losses: 0, games: 0 }
    if (entry.player1_id === player.id) {
      return { opponent, wins: entry.player1_wins, losses: entry.player2_wins, games: entry.games }
    }
    return { opponent, wins: entry.player2_wins, losses: entry.player1_wins, games: entry.games }
  })

  if (!playerStats) {
    return (
      <div className="text-center py-12">
        <PlayerAvatar player={player} size="lg" />
        <h1 className="font-display text-4xl text-ink-900 mt-4">{player.name}</h1>
        <p className="font-display text-gold-600 text-xl italic mt-1">&ldquo;{player.nickname}&rdquo;</p>
        <p className="font-serif text-ink-900 mt-4">No battles recorded yet. The throne awaits.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <Card gold className="text-center py-6">
        <div className="flex justify-center mb-3">
          <PlayerAvatar player={player} size="lg" />
        </div>
        <h1 className="font-display text-4xl text-ink-900">{player.name}</h1>
        <p className="font-display text-gold-600 text-xl italic mt-1">&ldquo;{player.nickname}&rdquo;</p>
        <p className="font-serif text-ink-900/60 text-sm italic mt-2">&ldquo;{player.houseWords}&rdquo;</p>
        {rank > 0 && (
          <div className="mt-3 inline-block bg-gold-400/20 border border-gold-400 px-4 py-1 rounded-full">
            <span className="font-display text-ink-900">
              {rank === 1 ? '👑 Reigning Champion' : `Rank #${rank} in the Kingdom`}
            </span>
          </div>
        )}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Games Played', value: playerStats.games, icon: '⚔️' },
          { label: 'Victories', value: playerStats.wins, icon: '🏆', color: 'text-forest-800' },
          { label: 'Win Rate', value: playerStats.games > 0 ? formatWinRate(playerStats.win_rate) : '—', icon: '📊', color: 'text-gold-600' },
          { label: 'Avg Score', value: playerStats.games > 0 ? playerStats.avg_score.toFixed(1) + ' VP' : '—', icon: '🎯' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`font-display text-2xl tabular ${stat.color ?? 'text-ink-900'}`}>{stat.value}</div>
            <div className="text-xs text-gold-600 uppercase tracking-wider font-serif mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* More Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Best Score', value: playerStats.best_score > 0 ? playerStats.best_score + ' VP' : '—', icon: '⭐' },
          { label: 'Total VP Earned', value: playerStats.total_vp.toLocaleString(), icon: '💎', color: 'text-gold-600' },
          { label: 'Longest Win Streak', value: playerStats.longest_win_streak || '—', icon: '🔥', color: 'text-forest-800' },
          { label: 'Longest Loss Streak', value: playerStats.longest_loss_streak || '—', icon: '🥶', color: 'text-crimson-700' },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`font-display text-2xl tabular ${stat.color ?? 'text-ink-900'}`}>{stat.value}</div>
            <div className="text-xs text-gold-600 uppercase tracking-wider font-serif mt-1">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Current Streak */}
      {playerStats.current_streak > 0 && (
        <Card gold className="text-center py-4">
          <p className="font-display text-xl text-ink-900">
            {playerStats.streak_type === 'win'
              ? `🔥 On a ${playerStats.current_streak}-game winning streak!`
              : `🥶 On a ${playerStats.current_streak}-game losing streak.`}
          </p>
          <p className="text-gold-600 italic font-serif text-sm mt-1">
            {playerStats.streak_type === 'win' ? player.houseWords : 'The tide will turn... probably.'}
          </p>
        </Card>
      )}

      {/* Head-to-Head */}
      <Card>
        <h2 className="font-display text-2xl text-ink-900 mb-3">Head-to-Head</h2>
        <hr className="divider-gold" />
        <div className="space-y-3 mt-3">
          {h2hVsOthers.map(({ opponent, wins, losses, games: g }) => {
            const winRate = g > 0 ? wins / g : 0
            const barWidth = g > 0 ? Math.round(winRate * 100) : 50
            return (
              <div key={opponent.id}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <PlayerAvatar player={opponent} size="sm" showName />
                  </div>
                  <span className={`text-sm font-semibold tabular font-serif ${wins > losses ? 'text-forest-800' : wins < losses ? 'text-crimson-700' : 'text-ink-900'}`}>
                    {wins}–{losses}
                    {g > 0 && <span className="text-xs text-gold-600 ml-1">({formatWinRate(winRate)})</span>}
                  </span>
                </div>
                {g > 0 && (
                  <div className="h-2 bg-parchment-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${wins > losses ? 'bg-forest-800' : wins < losses ? 'bg-crimson-700' : 'bg-parchment-300'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent Games */}
      {myGames.length > 0 && (
        <Card>
          <h2 className="font-display text-2xl text-ink-900 mb-3">{player.name.split(' ')[0]}'s Battles</h2>
          <hr className="divider-gold" />
          <div className="divide-y divide-parchment-200 mt-2">
            {myGames.slice(0, 10).map((game) => {
              const myParticipant = game.participants.find((p) => p.player_id === player.id)!
              return (
                <div key={game.id} className="py-2 flex items-center gap-3 flex-wrap text-sm font-serif">
                  <span className="text-gold-600 w-24 shrink-0">{formatDateShort(game.played_at)}</span>
                  <span className={`font-semibold ${myParticipant.position === 1 ? 'text-forest-800' : 'text-crimson-700'}`}>
                    {myParticipant.position === 1 ? '👑 Won' : `${myParticipant.position}${myParticipant.position === 2 ? 'nd' : myParticipant.position === 3 ? 'rd' : 'th'}`}
                  </span>
                  <span className="tabular text-ink-900">{myParticipant.score} VP</span>
                  <div className="flex gap-1 ml-auto">
                    {game.participants.filter(p => p.player_id !== player.id).map((p) => (
                      <PlayerAvatar key={p.player_id} player={p.player!} size="sm" />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Navigation to other players */}
      <div className="flex gap-2 flex-wrap justify-center pt-4">
        <Link href="/" className="text-gold-600 hover:text-gold-400 text-sm italic font-serif transition-colors">
          ← Back to Leaderboard
        </Link>
        <span className="text-parchment-300">|</span>
        {PLAYERS.filter((p) => p.id !== player.id).map((p) => (
          <Link key={p.id} href={`/player/${p.slug}`} className="text-gold-600 hover:text-gold-400 text-sm italic font-serif transition-colors">
            {p.name.split(' ')[0]} →
          </Link>
        ))}
      </div>
    </div>
  )
}
