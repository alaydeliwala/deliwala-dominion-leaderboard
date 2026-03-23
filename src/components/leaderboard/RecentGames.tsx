import Link from 'next/link'
import { Crown } from 'lucide-react'
import type { Game } from '@/types'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import { formatDateShort } from '@/lib/utils'

interface RecentGamesProps {
  games: Game[]
}

export default function RecentGames({ games }: RecentGamesProps) {
  return (
    <div className="card-parchment">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <h2 className="font-display text-2xl text-ink-900">Recent Battles</h2>
        <Link href="/history" className="text-gold-600 hover:text-gold-400 text-sm italic transition-colors">
          View all chronicles →
        </Link>
      </div>
      <hr className="divider-gold mx-4" />
      {games.length === 0 ? (
        <p className="px-4 pb-4 text-parchment-300 italic text-center py-6 font-serif">
          No battles recorded yet. The kingdom awaits its first contest.
        </p>
      ) : (
        <div className="divide-y divide-parchment-200">
          {games.map((game) => {
            const winner = game.participants[0]
            return (
              <div key={game.id} className="px-4 py-3 flex items-center gap-3 flex-wrap hover:bg-parchment-100 transition-colors">
                <span className="text-xs text-gold-600 font-serif w-24 shrink-0">{formatDateShort(game.played_at)}</span>
                <div className="flex items-center gap-1 flex-wrap flex-1">
                  {game.participants.map((p) => (
                    <div key={p.player_id} className="flex items-center gap-1">
                      {p.position === 1 && <Crown size={13} className="text-gold-400" />}
                      <PlayerAvatar player={p.player!} size="sm" />
                      <span className={`text-sm tabular ${p.position === 1 ? 'font-semibold text-forest-800' : 'text-ink-900'}`}>
                        {p.score}
                      </span>
                    </div>
                  ))}
                </div>
                {game.notes && (
                  <span className="text-xs text-gold-600 italic truncate max-w-xs">&ldquo;{game.notes}&rdquo;</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
