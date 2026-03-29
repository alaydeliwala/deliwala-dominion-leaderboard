import { Crown } from 'lucide-react'

interface BadgeProps {
  rank: number
}

export default function RankBadge({ rank }: BadgeProps) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-400 border-2 border-gold-600 text-ink-900 font-display font-bold text-sm shadow-[0_0_8px_rgba(212,160,23,0.5)]">
        <Crown size={15} />
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 text-ink-900 font-display font-bold text-sm shadow-sm"
        style={{ background: 'linear-gradient(135deg, #C8C8D0, #A0A0B0)', borderColor: '#8A8A9A' }}
      >
        {rank}
      </span>
    )
  }
  if (rank === 3) {
    return (
      <span
        className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 text-white font-display font-bold text-sm shadow-sm"
        style={{ background: 'linear-gradient(135deg, #CD8B3A, #A0651A)', borderColor: '#7A4A10' }}
      >
        {rank}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-parchment-100 border border-parchment-200 text-ink-900 font-display font-bold text-sm opacity-70">
      {rank}
    </span>
  )
}
