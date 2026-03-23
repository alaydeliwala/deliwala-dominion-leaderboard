'use client'
import type { Game } from '@/types'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import { PLAYER_BY_ID } from '@/lib/players'
import { useState } from 'react'

interface TrashGameCardProps {
  game: Game
  onRestore: (id: number) => Promise<void>
}

export default function TrashGameCard({ game, onRestore }: TrashGameCardProps) {
  const [restoring, setRestoring] = useState(false)

  async function handleRestore() {
    setRestoring(true)
    try {
      await onRestore(game.id)
    } finally {
      setRestoring(false)
    }
  }

  const deletedByPlayer = game.deleted_by ? PLAYER_BY_ID[game.deleted_by] : null

  return (
    <div className="card-parchment border-crimson-700/30 opacity-80 hover:opacity-100 transition-opacity">
      <div className="flex items-start gap-3 flex-wrap">
        <div className="flex-1">
          <div className="text-xs text-crimson-700 font-serif mb-1">
            ⚰ Banished {game.deleted_at ? `on ${formatDate(game.deleted_at.split(' ')[0])}` : ''}
            {deletedByPlayer && ` by ${deletedByPlayer.name.split(' ')[0]}`}
          </div>
          <div className="text-sm font-serif text-gold-600 mb-2">{formatDate(game.played_at)}</div>
          <div className="flex items-center gap-2 flex-wrap">
            {game.participants.map((p) => (
              <div key={p.player_id} className="flex items-center gap-1">
                {p.position === 1 && <span className="text-xs">👑</span>}
                <PlayerAvatar player={p.player!} size="sm" />
                <span className="text-sm tabular font-serif text-ink-900">{p.score} VP</span>
              </div>
            ))}
          </div>
          {game.notes && (
            <p className="text-xs italic text-parchment-300 mt-2 font-serif">&ldquo;{game.notes}&rdquo;</p>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={handleRestore} disabled={restoring} className="border-forest-800 text-forest-800 hover:bg-forest-700/10">
          {restoring ? 'Restoring...' : '↩ Reinstate'}
        </Button>
      </div>
    </div>
  )
}
