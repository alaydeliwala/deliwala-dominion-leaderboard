'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { PlayerStats } from '@/types'
import RankBadge from '@/components/ui/Badge'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import { formatWinRate } from '@/lib/utils'

interface LeaderboardTableProps {
  rankings: PlayerStats[]
}

export default function LeaderboardTable({ rankings }: LeaderboardTableProps) {
  const [sortBy, setSortBy] = useState<'win_rate' | 'wins'>('win_rate')

  const sorted = [...rankings].sort((a, b) => {
    if (sortBy === 'wins') return b.wins - a.wins || b.win_rate - a.win_rate
    return b.win_rate - a.win_rate || b.wins - a.wins
  })

  return (
    <div className="card-parchment overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-wrap gap-2">
        <h2 className="font-display text-2xl text-ink-900">The Rankings</h2>
        <div className="flex gap-1 text-sm">
          <button
            onClick={() => setSortBy('win_rate')}
            className={`px-3 py-1 rounded border ${sortBy === 'win_rate' ? 'bg-gold-400 border-gold-600 text-ink-900 font-semibold' : 'border-parchment-200 text-ink-900 hover:border-gold-400'}`}
          >
            By Win %
          </button>
          <button
            onClick={() => setSortBy('wins')}
            className={`px-3 py-1 rounded border ${sortBy === 'wins' ? 'bg-gold-400 border-gold-600 text-ink-900 font-semibold' : 'border-parchment-200 text-ink-900 hover:border-gold-400'}`}
          >
            By Wins
          </button>
        </div>
      </div>
      <hr className="divider-gold mx-4" />
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-serif">
          <thead>
            <tr className="text-gold-600 text-xs uppercase tracking-wider border-b border-parchment-200">
              <th className="px-4 py-2 text-left w-10">#</th>
              <th className="px-4 py-2 text-left">Heir</th>
              <th className="px-4 py-2 text-center tabular">Games</th>
              <th className="px-4 py-2 text-center tabular">W</th>
              <th className="px-4 py-2 text-center tabular">L</th>
              <th className="px-4 py-2 text-center tabular">Win %</th>
              <th className="px-4 py-2 text-center tabular">Avg VP</th>
              <th className="px-4 py-2 text-center">Streak</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => (
              <tr
                key={s.player.id}
                className="border-b border-parchment-200 last:border-0 hover:bg-parchment-100 transition-colors"
              >
                <td className="px-4 py-3">
                  <RankBadge rank={i + 1} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/player/${s.player.slug}`} className="flex items-center gap-2 hover:text-gold-600 transition-colors group">
                    <PlayerAvatar player={s.player} size="sm" />
                    <div>
                      <div className="font-semibold text-ink-900 group-hover:text-gold-600">{s.player.name.split(' ')[0]}</div>
                      <div className="text-xs text-gold-600 italic">{s.player.nickname}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-center tabular text-ink-900">{s.games}</td>
                <td className="px-4 py-3 text-center tabular font-semibold text-forest-800">{s.wins}</td>
                <td className="px-4 py-3 text-center tabular text-crimson-700">{s.losses}</td>
                <td className="px-4 py-3 text-center tabular font-semibold text-ink-900">
                  {s.games === 0 ? '—' : formatWinRate(s.win_rate)}
                </td>
                <td className="px-4 py-3 text-center tabular text-ink-900">
                  {s.games === 0 ? '—' : s.avg_score.toFixed(1)}
                </td>
                <td className="px-4 py-3 text-center">
                  {s.current_streak > 0 && s.streak_type !== 'none' ? (
                    <span className={`text-sm font-semibold ${s.streak_type === 'win' ? 'text-forest-800' : 'text-crimson-700'}`}>
                      {s.streak_type === 'win' ? '🔥' : '🥶'} {s.current_streak}
                    </span>
                  ) : <span className="text-parchment-300">—</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
