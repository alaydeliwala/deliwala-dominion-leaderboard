import type { Player } from '@/types'

interface PlayerAvatarProps {
  player: Player
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-14 h-14 text-xl',
}

export default function PlayerAvatar({ player, size = 'md', showName }: PlayerAvatarProps) {
  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center rounded-full font-display font-bold text-white border-2 border-white/30 shadow-sm ${sizes[size]}`}
        style={{ backgroundColor: player.color }}
      >
        {player.initials}
      </span>
      {showName && <span className="font-serif text-ink-900">{player.name.split(' ')[0]}</span>}
    </div>
  )
}
