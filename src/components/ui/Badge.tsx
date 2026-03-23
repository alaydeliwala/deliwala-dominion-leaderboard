interface BadgeProps {
  rank: number
}

export default function RankBadge({ rank }: BadgeProps) {
  if (rank === 1) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gold-400 border-2 border-gold-600 text-ink-900 font-display font-bold text-sm shadow-[0_0_8px_rgba(212,160,23,0.5)]">
        👑
      </span>
    )
  }
  if (rank === 2) {
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-parchment-200 border-2 border-parchment-300 text-ink-900 font-display font-bold text-sm">
        {rank}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-parchment-100 border border-parchment-200 text-ink-900 font-display font-bold text-sm opacity-80">
      {rank}
    </span>
  )
}
