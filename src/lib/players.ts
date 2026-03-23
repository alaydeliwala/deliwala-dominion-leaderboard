import type { Player } from '@/types'

export const PLAYERS: Player[] = [
  {
    id: 1,
    name: 'Alay Deliwala',
    nickname: 'The Algorithm',
    slug: 'alay',
    houseWords: 'I had the optimal engine.',
    color: '#1E40AF',
    initials: 'AD',
  },
  {
    id: 2,
    name: 'Komal Deliwala',
    nickname: 'Mom-inion',
    slug: 'komal',
    houseWords: 'The hand that rocks the Duchy.',
    color: '#7C3AED',
    initials: 'KD',
  },
  {
    id: 3,
    name: 'Hiren Deliwala',
    nickname: 'The Patriarch',
    slug: 'hiren',
    houseWords: 'I was just letting you win.',
    color: '#166534',
    initials: 'HD',
  },
  {
    id: 4,
    name: 'Ishani Deliwala',
    nickname: 'Wild Card',
    slug: 'ishani',
    houseWords: 'Chaos is a ladder.',
    color: '#9F1239',
    initials: 'ID',
  },
]

export const PLAYER_BY_ID: Record<number, Player> = Object.fromEntries(
  PLAYERS.map((p) => [p.id, p])
)

export const PLAYER_BY_SLUG: Record<string, Player> = Object.fromEntries(
  PLAYERS.map((p) => [p.slug, p])
)
