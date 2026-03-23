'use client'
import { useState } from 'react'
import type { Game } from '@/types'
import Button from '@/components/ui/Button'
import TrashGameCard from './TrashGameCard'

export default function PasswordGate() {
  const [password, setPassword] = useState('')
  const [games, setGames] = useState<Game[] | null>(null)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/trash', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (!res.ok) {
        triggerShake('Wrong password, knave.')
        return
      }
      const data = await res.json()
      setGames(data.games)
    } catch {
      triggerShake('Failed to connect to the vault.')
    } finally {
      setLoading(false)
    }
  }

  function triggerShake(msg: string) {
    setError(msg)
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  async function handleRestore(id: number) {
    const res = await fetch(`/api/games/${id}/restore`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${password}` },
    })
    if (!res.ok) throw new Error('Failed to restore')
    setGames((prev) => prev?.filter((g) => g.id !== id) ?? null)
  }

  if (games !== null) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-gold-600 italic font-serif text-sm">
            {games.length === 0
              ? 'The vault is empty. No games have been banished.'
              : `${games.length} banished game${games.length !== 1 ? 's' : ''} found in the vault.`}
          </p>
          <button
            className="text-xs text-crimson-700 hover:underline font-serif"
            onClick={() => { setGames(null); setPassword('') }}
          >
            Lock vault
          </button>
        </div>
        {games.length === 0 ? (
          <div className="card-parchment p-8 text-center">
            <div className="text-4xl mb-3">🏛</div>
            <p className="font-display text-xl text-ink-900">The Vault is Empty</p>
            <p className="text-gold-600 italic font-serif mt-1">No games have been banished from the chronicles.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {games.map((game) => (
              <TrashGameCard key={game.id} game={game} onRestore={handleRestore} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto">
      <div className="card-parchment-gold p-8 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="font-display text-2xl text-ink-900 mb-2">The Royal Vault</h2>
        <p className="text-gold-600 italic font-serif text-sm mb-6">
          Only the master of the realm may enter. Speak the password.
        </p>
        <form onSubmit={handleSubmit} className={`${shaking ? 'animate-shake' : ''}`}>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            placeholder="Master password..."
            className="w-full border-2 border-parchment-200 rounded px-3 py-2 bg-parchment-50 font-serif text-ink-900 focus:border-gold-400 focus:outline-none text-center mb-3"
            autoFocus
          />
          {error && <p className="text-crimson-700 text-sm font-serif mb-3">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Checking...' : 'Enter the Vault'}
          </Button>
        </form>
      </div>
    </div>
  )
}
