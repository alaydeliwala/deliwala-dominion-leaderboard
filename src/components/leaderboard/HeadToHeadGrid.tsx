import type { HeadToHeadEntry } from '@/types'
import { PLAYERS } from '@/lib/players'
import PlayerAvatar from '@/components/ui/PlayerAvatar'

interface HeadToHeadGridProps {
  data: HeadToHeadEntry[]
}

export default function HeadToHeadGrid({ data }: HeadToHeadGridProps) {
  function getH2H(p1Id: number, p2Id: number) {
    const entry = data.find(
      (e) =>
        (e.player1_id === p1Id && e.player2_id === p2Id) ||
        (e.player1_id === p2Id && e.player2_id === p1Id)
    )
    if (!entry) return null
    if (entry.player1_id === p1Id) {
      return { wins: entry.player1_wins, losses: entry.player2_wins, games: entry.games }
    }
    return { wins: entry.player2_wins, losses: entry.player1_wins, games: entry.games }
  }

  return (
    <div className="card-parchment overflow-hidden">
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-display text-2xl text-ink-900">Head-to-Head</h2>
        <p className="text-sm text-gold-600 italic">Row player vs. column player (wins)</p>
      </div>
      <hr className="divider-gold mx-4" />
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm font-serif border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-gold-600 text-xs uppercase tracking-wider"></th>
              {PLAYERS.map((p) => (
                <th key={p.id} className="p-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <PlayerAvatar player={p} size="sm" />
                    <span className="text-xs text-ink-900">{p.name.split(' ')[0]}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PLAYERS.map((rowPlayer) => (
              <tr key={rowPlayer.id} className="border-t border-parchment-200">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <PlayerAvatar player={rowPlayer} size="sm" />
                    <span className="text-sm font-semibold text-ink-900">{rowPlayer.name.split(' ')[0]}</span>
                  </div>
                </td>
                {PLAYERS.map((colPlayer) => {
                  if (rowPlayer.id === colPlayer.id) {
                    return (
                      <td key={colPlayer.id} className="p-2 text-center bg-parchment-200">
                        <span className="text-parchment-300 text-lg">—</span>
                      </td>
                    )
                  }
                  const h2h = getH2H(rowPlayer.id, colPlayer.id)
                  if (!h2h) {
                    return (
                      <td key={colPlayer.id} className="p-2 text-center text-parchment-300 text-xs">
                        0 games
                      </td>
                    )
                  }
                  const isLeading = h2h.wins > h2h.losses
                  const isTied = h2h.wins === h2h.losses
                  return (
                    <td
                      key={colPlayer.id}
                      className={`p-2 text-center rounded transition-colors ${
                        isLeading
                          ? 'bg-forest-700/10 text-forest-800'
                          : isTied
                          ? 'text-ink-900'
                          : 'bg-crimson-700/10 text-crimson-700'
                      }`}
                    >
                      <div className="font-semibold text-base tabular">{h2h.wins}–{h2h.losses}</div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
