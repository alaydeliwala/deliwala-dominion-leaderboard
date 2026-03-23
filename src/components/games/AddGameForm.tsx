'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PLAYERS } from '@/lib/players'
import Button from '@/components/ui/Button'
import PlayerAvatar from '@/components/ui/PlayerAvatar'

const COMMON_CARDS = [
  'Village', 'Smithy', 'Market', 'Festival', 'Laboratory', 'Mine', 'Witch',
  'Moat', 'Gardens', 'Council Room', 'Cellar', 'Chapel', 'Workshop',
  'Bureaucrat', 'Militia', 'Moneylender', 'Remodel', 'Spy', 'Thief', 'Throne Room',
  'Library', 'Merchant', 'Artisan', 'Bandit', 'Harbinger', 'Vassal',
  'Poacher', 'Sentry', 'Duke', 'Duchy', 'Province', 'Gold', 'Silver',
]

interface Participant {
  player_id: number
  score: string
}

export default function AddGameForm() {
  const router = useRouter()
  const today = new Date().toISOString().split('T')[0]

  const [playedAt, setPlayedAt] = useState(today)
  const [selectedPlayers, setSelectedPlayers] = useState<number[]>([1, 2, 3, 4])
  const [scores, setScores] = useState<Record<number, string>>({})
  const [notes, setNotes] = useState('')
  const [kingdomInput, setKingdomInput] = useState('')
  const [kingdom, setKingdom] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function togglePlayer(id: number) {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  function handleScoreChange(playerId: number, value: string) {
    setScores((prev) => ({ ...prev, [playerId]: value }))
  }

  function handleKingdomInput(val: string) {
    setKingdomInput(val)
    if (val.length >= 2) {
      const lower = val.toLowerCase()
      setSuggestions(COMMON_CARDS.filter((c) => c.toLowerCase().includes(lower) && !kingdom.includes(c)))
    } else {
      setSuggestions([])
    }
  }

  function addCard(card: string) {
    if (!kingdom.includes(card)) setKingdom((prev) => [...prev, card])
    setKingdomInput('')
    setSuggestions([])
  }

  function removeCard(card: string) {
    setKingdom((prev) => prev.filter((c) => c !== card))
  }

  function getPositions(): { player_id: number; score: number; position: number }[] {
    const participants = selectedPlayers
      .filter((id) => scores[id] !== undefined && scores[id] !== '')
      .map((id) => ({ player_id: id, score: parseInt(scores[id]) || 0 }))
      .sort((a, b) => b.score - a.score)

    let pos = 1
    return participants.map((p, i) => {
      if (i > 0 && participants[i].score < participants[i - 1].score) pos = i + 1
      return { ...p, position: pos }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (selectedPlayers.length < 2) {
      setError('Select at least 2 players.')
      return
    }

    const missing = selectedPlayers.filter((id) => !scores[id] || scores[id] === '')
    if (missing.length > 0) {
      setError('Enter scores for all selected players.')
      return
    }

    const participants = getPositions()

    setSubmitting(true)
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          played_at: playedAt,
          notes: notes || undefined,
          kingdom: kingdom.length > 0 ? kingdom : undefined,
          participants,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to record game')
      }

      router.push('/history?new=1')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const preview = selectedPlayers.length >= 2
    ? [...selectedPlayers]
        .filter((id) => scores[id])
        .sort((a, b) => parseInt(scores[b] || '0') - parseInt(scores[a] || '0'))
    : []

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      {/* Date */}
      <div className="card-parchment p-4">
        <label className="block text-gold-600 text-xs uppercase tracking-wider font-serif mb-2">
          Date of Battle
        </label>
        <input
          type="date"
          value={playedAt}
          onChange={(e) => setPlayedAt(e.target.value)}
          className="w-full border-2 border-parchment-200 rounded px-3 py-2 bg-parchment-50 font-serif text-ink-900 focus:border-gold-400 focus:outline-none"
          required
        />
      </div>

      {/* Players */}
      <div className="card-parchment p-4">
        <label className="block text-gold-600 text-xs uppercase tracking-wider font-serif mb-3">
          Combatants (select 2–4)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PLAYERS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => togglePlayer(p.id)}
              className={`flex items-center gap-2 p-2 rounded border-2 transition-all text-left ${
                selectedPlayers.includes(p.id)
                  ? 'border-gold-400 bg-parchment-100 shadow-[0_0_8px_rgba(212,160,23,0.2)]'
                  : 'border-parchment-200 hover:border-parchment-300'
              }`}
            >
              <PlayerAvatar player={p} size="sm" />
              <div>
                <div className="text-sm font-semibold text-ink-900">{p.name.split(' ')[0]}</div>
                <div className="text-xs text-gold-600 italic">{p.nickname}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Scores */}
      {selectedPlayers.length >= 2 && (
        <div className="card-parchment p-4">
          <label className="block text-gold-600 text-xs uppercase tracking-wider font-serif mb-3">
            Victory Points
          </label>
          <div className="space-y-2">
            {selectedPlayers.map((id) => {
              const player = PLAYERS.find((p) => p.id === id)!
              return (
                <div key={id} className="flex items-center gap-3">
                  <PlayerAvatar player={player} size="sm" showName />
                  <input
                    type="number"
                    min="0"
                    max="999"
                    placeholder="0"
                    value={scores[id] ?? ''}
                    onChange={(e) => handleScoreChange(id, e.target.value)}
                    className="ml-auto w-20 border-2 border-parchment-200 rounded px-2 py-1 text-right bg-parchment-50 font-serif text-ink-900 tabular focus:border-gold-400 focus:outline-none"
                  />
                  <span className="text-xs text-gold-600">VP</span>
                </div>
              )
            })}
          </div>

          {/* Auto-rank preview */}
          {preview.length >= 2 && (
            <div className="mt-3 pt-3 border-t border-parchment-200">
              <div className="text-xs text-gold-600 uppercase tracking-wider mb-2">Auto-ranked</div>
              {preview.map((id, i) => {
                const p = PLAYERS.find((pl) => pl.id === id)!
                return (
                  <div key={id} className="flex items-center gap-2 text-xs mb-1">
                    <span className="w-4">{i === 0 ? '👑' : `${i + 1}.`}</span>
                    <PlayerAvatar player={p} size="sm" showName />
                    <span className="ml-auto tabular font-semibold">{scores[id]} VP</span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Kingdom Cards */}
      <div className="card-parchment p-4">
        <label className="block text-gold-600 text-xs uppercase tracking-wider font-serif mb-2">
          Kingdom Cards <span className="normal-case text-parchment-300">(optional)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={kingdomInput}
            onChange={(e) => handleKingdomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { e.preventDefault(); if (kingdomInput.trim()) addCard(kingdomInput.trim()) }
            }}
            placeholder="Type a card name..."
            className="w-full border-2 border-parchment-200 rounded px-3 py-2 bg-parchment-50 font-serif text-ink-900 focus:border-gold-400 focus:outline-none"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-parchment-50 border-2 border-gold-400 rounded mt-1 shadow-lg">
              {suggestions.slice(0, 6).map((s) => (
                <button
                  key={s}
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-parchment-100 font-serif text-ink-900 border-b border-parchment-200 last:border-0"
                  onClick={() => addCard(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        {kingdom.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {kingdom.map((card) => (
              <span key={card} className="inline-flex items-center gap-1 text-xs bg-parchment-200 border border-parchment-300 px-2 py-0.5 rounded-full font-serif text-ink-900">
                {card}
                <button type="button" onClick={() => removeCard(card)} className="text-crimson-700 hover:text-crimson-800 ml-0.5">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="card-parchment p-4">
        <label className="block text-gold-600 text-xs uppercase tracking-wider font-serif mb-2">
          Notes <span className="normal-case text-parchment-300">(optional)</span>
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Dad finally won one. The kingdom rejoiced."
          rows={2}
          className="w-full border-2 border-parchment-200 rounded px-3 py-2 bg-parchment-50 font-serif text-ink-900 focus:border-gold-400 focus:outline-none resize-none"
        />
      </div>

      {error && (
        <p className="text-crimson-700 text-sm font-serif text-center">{error}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? '⚔ Recording...' : '⚔ Record This Battle'}
      </Button>
    </form>
  )
}
