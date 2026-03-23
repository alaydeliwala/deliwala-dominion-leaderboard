'use client'
import { useState } from 'react'
import type { Game } from '@/types'
import PlayerAvatar from '@/components/ui/PlayerAvatar'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

interface GameCardProps {
  game: Game
  onDelete?: (id: number, password: string) => Promise<void>
}

export default function GameCard({ game, onDelete }: GameCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!password) { triggerShake('Enter the master password first.'); return }
    setDeleting(true)
    try {
      await onDelete?.(game.id, password)
    } catch (e: unknown) {
      triggerShake(e instanceof Error ? e.message : 'Failed')
    } finally {
      setDeleting(false)
    }
  }

  function triggerShake(msg: string) {
    setError(msg); setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  return (
    <div className="card-parchment mb-4 overflow-hidden">

      {/* ── Collapsed header row ─────────────────────────────── */}
      <div
        className="flex items-center gap-6 px-6 py-5 cursor-pointer hover:bg-parchment-200/40 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Date */}
        <span className="font-display text-base shrink-0 w-36" style={{ color: '#1E2D5C' }}>
          {formatDate(game.played_at)}
        </span>

        {/* Player chips */}
        <div className="flex items-center gap-5 flex-wrap flex-1">
          {game.participants.map((p) => (
            <div key={p.player_id} className="flex items-center gap-2">
              {p.position === 1 && <span className="text-base">👑</span>}
              <PlayerAvatar player={p.player!} size="md" />
              <div>
                <div className="text-sm font-semibold text-ink-900 leading-tight">
                  {p.player!.name.split(' ')[0]}
                </div>
                <div className={`text-base font-bold tabular leading-tight ${p.position === 1 ? 'text-forest-700' : 'text-ink-900'}`}>
                  {p.score} <span className="text-xs font-normal opacity-50">VP</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <span className="text-gold-400 shrink-0">{expanded ? '▲' : '▼'}</span>
      </div>

      {/* ── Expanded detail ──────────────────────────────────── */}
      {expanded && (
        <div className="px-6 pb-6 pt-2 border-t border-parchment-200 animate-fade-in space-y-5">

          {/* Standings grid */}
          <div>
            <p className="text-xs uppercase tracking-widest font-serif mb-3" style={{ color: '#C9A227' }}>
              Final Standings
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {game.participants.map((p) => (
                <div
                  key={p.player_id}
                  className={`flex items-center gap-3 px-4 py-3 rounded border ${
                    p.position === 1
                      ? 'border-gold-400 bg-gold-400/10'
                      : 'border-parchment-200 bg-parchment-100/50'
                  }`}
                >
                  <span className="text-lg w-7 text-center shrink-0">
                    {p.position === 1 ? '👑' : `${p.position}.`}
                  </span>
                  <PlayerAvatar player={p.player!} size="md" showName />
                  <span className="ml-auto text-xl font-bold tabular text-ink-900 shrink-0">
                    {p.score}
                    <span className="text-sm font-normal opacity-50 ml-1">VP</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Kingdom cards */}
          {game.kingdom && game.kingdom.length > 0 && (
            <div>
              <p className="text-xs uppercase tracking-widest font-serif mb-2" style={{ color: '#C9A227' }}>
                Kingdom Cards
              </p>
              <div className="flex flex-wrap gap-2">
                {game.kingdom.map((card) => (
                  <span key={card} className="text-sm bg-parchment-200 border border-parchment-300 px-3 py-1 rounded-full font-serif text-ink-900">
                    {card}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {game.notes && (
            <div>
              <p className="text-xs uppercase tracking-widest font-serif mb-1" style={{ color: '#C9A227' }}>
                Notes
              </p>
              <p className="text-base italic font-serif text-ink-900">&ldquo;{game.notes}&rdquo;</p>
            </div>
          )}

          {/* Delete */}
          {onDelete && (
            <div className="pt-3 border-t border-parchment-200">
              {!showDelete ? (
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded border-2 border-crimson-700 text-crimson-700 font-serif text-sm hover:bg-crimson-700 hover:text-parchment-50 transition-all"
                  onClick={(e) => { e.stopPropagation(); setShowDelete(true) }}
                >
                  ✕ Remove from chronicles
                </button>
              ) : (
                <div className={shaking ? 'animate-shake' : ''} onClick={(e) => e.stopPropagation()}>
                  <div className="flex gap-2 items-center flex-wrap">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      placeholder="Master password..."
                      className="text-sm border border-parchment-200 rounded px-3 py-2 bg-parchment-50 font-serif flex-1 min-w-0"
                      onKeyDown={(e) => e.key === 'Enter' && handleDelete()}
                    />
                    <Button variant="danger" size="sm" onClick={handleDelete} disabled={deleting}>
                      {deleting ? 'Banishing...' : 'Banish'}
                    </Button>
                    <button className="text-sm text-ink-900 hover:underline font-serif" onClick={() => { setShowDelete(false); setPassword(''); setError('') }}>
                      Cancel
                    </button>
                  </div>
                  {error && <p className="text-sm text-crimson-700 mt-1 font-serif">{error}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
