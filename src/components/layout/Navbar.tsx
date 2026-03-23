'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const links = [
  { href: '/', label: 'Leaderboard' },
  { href: '/history', label: 'Chronicles' },
  { href: '/add-game', label: '+ Record Battle' },
  { href: '/admin', label: '⚙ Vault' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <nav className="border-b-2 border-gold-400 shadow-lg" style={{ backgroundColor: '#1E2D5C' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-6 flex-wrap">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <Image src="/vp-icon.png" alt="VP Shield" width={28} height={28} priority unoptimized className="h-7 w-auto" />
          <span className="font-display text-2xl text-gold-400">Dominion Deliwalas</span>
        </Link>
        <div className="flex gap-1 flex-wrap ml-auto">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`px-3 py-1.5 rounded text-sm font-serif transition-colors ${
                pathname === l.href
                  ? 'bg-gold-400 text-ink-900 font-semibold'
                  : 'text-parchment-200 hover:text-gold-300 hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
