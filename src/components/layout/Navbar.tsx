'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Leaderboard' },
  { href: '/history', label: 'Chronicles' },
  { href: '/add-game', label: '+ Record Battle' },
  { href: '/admin', label: '⚙ Vault' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <nav className="border-b-2 border-gold-400 shadow-lg" style={{ backgroundColor: '#1E2D5C' }}>
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={() => setOpen(false)}>
          <Image src="/vp-icon.png" alt="VP Shield" width={28} height={28} priority unoptimized className="h-7 w-auto" />
          <span className="font-display text-2xl text-gold-400">Dominion Deliwalas</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-1 ml-auto">
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto text-parchment-200 hover:text-gold-300 p-2 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-gold-400/30 px-4 py-2 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded text-sm font-serif transition-colors ${
                pathname === l.href
                  ? 'bg-gold-400 text-ink-900 font-semibold'
                  : 'text-parchment-200 hover:text-gold-300 hover:bg-white/5'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
