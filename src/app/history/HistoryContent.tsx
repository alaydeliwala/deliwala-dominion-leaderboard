'use client'
import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import type { Game } from '@/types'
import { PLAYERS } from '@/lib/players'
import GameCard from '@/components/games/GameCard'

const PAGE_SIZE = 20

export default function HistoryContent() {
  const searchParams = useSearchParams()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPlayer, setFilterPlayer] = useState<number | null>(null)
  const [toast, setToast] = useState('')
  const [page, setPage] = useState(1)

  const fetchGames = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/games')
      const data = await res.json()
      setGames(data.games ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
    if (searchParams.get('new') === '1') {
      setToast('All hail the victor! Battle recorded in the chronicles.')
      setTimeout(() => setToast(''), 4000)
    }
  }, [fetchGames, searchParams])

  async function handleDelete(id: number, password: string) {
    const res = await fetch(`/api/games/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${password}` },
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Failed')
    }
    setGames((prev) => prev.filter((g) => g.id !== id))
    setToast('Game banished to the vault.')
    setTimeout(() => setToast(''), 3000)
  }

  const filtered = filterPlayer
    ? games.filter((g) => g.participants.some((p) => p.player_id === filterPlayer))
    : games

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore = filtered.length > page * PAGE_SIZE

  return (
    <div>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-ink-900 text-gold-400 font-display px-6 py-3 rounded shadow-xl border border-gold-400 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        <button
          onClick={() => { setFilterPlayer(null); setPage(1) }}
          className={`px-3 py-1.5 rounded border text-sm font-serif transition-colors ${!filterPlayer ? 'bg-gold-400 border-gold-600 text-ink-900 font-semibold' : 'border-parchment-200 text-ink-900 hover:border-gold-400'}`}
        >
          All
        </button>
        {PLAYERS.map((p) => (
          <button
            key={p.id}
            onClick={() => { setFilterPlayer(p.id); setPage(1) }}
            className={`px-3 py-1.5 rounded border text-sm font-serif transition-colors ${filterPlayer === p.id ? 'bg-gold-400 border-gold-600 text-ink-900 font-semibold' : 'border-parchment-200 text-ink-900 hover:border-gold-400'}`}
          >
            {p.name.split(' ')[0]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 font-display text-gold-600 text-xl animate-pulse">
          Consulting the archives...
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-parchment p-8 text-center">
          <p className="font-display text-xl text-ink-900">No battles found</p>
          <p className="font-serif text-gold-600 italic mt-1">The chronicles are empty for this query.</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gold-600 font-serif mb-4 italic">
            {filtered.length} battle{filtered.length !== 1 ? 's' : ''} in the chronicles
            {filterPlayer ? ` featuring ${PLAYERS.find(p => p.id === filterPlayer)?.name.split(' ')[0]}` : ''}
          </p>
          {paginated.map((game) => (
            <GameCard key={game.id} game={game} onDelete={handleDelete} />
          ))}
          {hasMore && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full mt-4 py-2 font-serif text-gold-600 hover:text-gold-400 border border-parchment-200 rounded hover:border-gold-400 transition-colors text-sm"
            >
              Load more battles...
            </button>
          )}
        </div>
      )}
    </div>
  )
}
