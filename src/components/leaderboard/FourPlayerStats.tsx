import { Crown } from 'lucide-react'
import type { FourPlayerStat } from '@/types'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import RankBadge from '@/components/ui/Badge'
import { formatWinRate } from '@/lib/utils'

interface FourPlayerStatsProps {
  stats: FourPlayerStat[]
}

export default function FourPlayerStats({ stats }: FourPlayerStatsProps) {
  const totalGames = stats[0]?.games ?? 0
  if (totalGames === 0) return null

  return (
    <div className="card-parchment overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <Crown size={18} className="text-gold-400" />
          <h2 className="font-display text-2xl text-ink-900">Heir to the Throne</h2>
        </div>
        <p className="text-xs font-serif text-gold-600 italic mt-0.5">
          Win rates when all four are at the table &middot; {totalGames} game{totalGames !== 1 ? 's' : ''}
        </p>
      </div>
      <hr className="divider-gold mx-4" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-serif">
          <thead>
            <tr className="text-gold-600 text-xs uppercase tracking-wider border-b border-parchment-200">
              <th className="px-4 py-2 text-left w-10">#</th>
              <th className="px-4 py-2 text-left">Heir</th>
              <th className="px-4 py-2 text-center tabular">W</th>
              <th className="px-4 py-2 text-center tabular">L</th>
              <th className="px-4 py-2 text-center tabular">Win %</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s, i) => (
              <tr
                key={s.player.id}
                className="border-b border-parchment-200 last:border-0 hover:bg-parchment-100 transition-colors"
              >
                <td className="px-4 py-3">
                  <RankBadge rank={i + 1} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <PlayerAvatar player={s.player} size="sm" />
                    <div>
                      <div className="font-semibold text-ink-900">{s.player.name.split(' ')[0]}</div>
                      <div className="text-xs text-gold-600 italic">{s.player.nickname}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center tabular font-semibold text-forest-800">{s.wins}</td>
                <td className="px-4 py-3 text-center tabular text-crimson-700">{s.games - s.wins}</td>
                <td className="px-4 py-3 text-center tabular font-semibold text-ink-900">
                  {formatWinRate(s.win_rate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
