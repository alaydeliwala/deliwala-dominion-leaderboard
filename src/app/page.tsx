import Image from 'next/image'
import Link from 'next/link'
import { Swords } from 'lucide-react'
import { getLeaderboardStats } from '@/lib/queries/stats'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import HeadToHeadGrid from '@/components/leaderboard/HeadToHeadGrid'
import RecentGames from '@/components/leaderboard/RecentGames'
import FunnyStatBanner from '@/components/stats/FunnyStatBanner'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const data = getLeaderboardStats()

  return (
    <div>
      {/* Hero Header */}
      <div className="text-center py-6">
        <div className="flex justify-center mb-2">
          <Image
            src="/logo.png"
            alt="Dominion Deliwalas"
            width={700}
            height={280}
            priority
            unoptimized
            className="max-w-full h-auto drop-shadow-lg"
            style={{ maxHeight: '220px', width: 'auto', mixBlendMode: 'multiply' }}
          />
        </div>
        <p className="font-display text-xl italic" style={{ color: '#1E2D5C' }}>
          Family. Cards. Absolute Chaos. Est. When Dad First Lost.
        </p>
        <hr className="divider-green mt-4 max-w-md mx-auto" />

        {data.total_games > 0 && (
          <p className="text-sm font-serif text-ink-900 mt-3">
            <span className="font-semibold text-gold-600">{data.total_games}</span> battle{data.total_games !== 1 ? 's' : ''} recorded in the chronicles
          </p>
        )}
      </div>

      {/* Funny Stats Banner */}
      <FunnyStatBanner stats={data.funny_stats} />

      {/* Empty State */}
      {data.total_games === 0 ? (
        <div className="card-parchment-gold p-10 text-center my-8">
          <div className="mb-4 flex justify-center"><Swords size={48} className="text-gold-400" /></div>
          <h2 className="font-display text-3xl text-ink-900 mb-2">No Battles Recorded Yet</h2>
          <p className="font-serif text-gold-600 italic mb-6">
            The kingdom awaits its first contest. Who shall claim the throne?
          </p>
          <Link href="/add-game">
            <Button size="lg"><Swords size={16} className="inline-block mr-2" />Record the First Battle</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Leaderboard */}
          <LeaderboardTable rankings={data.rankings} />

          {/* H2H Grid */}
          {data.head_to_head.length > 0 && (
            <HeadToHeadGrid data={data.head_to_head} />
          )}

          {/* Recent Games */}
          <RecentGames games={data.recent_games} />

          {/* CTA */}
          <div className="text-center pt-4">
            <Link href="/add-game">
              <Button size="lg"><Swords size={16} className="inline-block mr-2" />Record a New Battle</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
