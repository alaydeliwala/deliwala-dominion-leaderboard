'use client'
import { useEffect, useState } from 'react'
import type { FunnyStats } from '@/types'

interface FunnyStatBannerProps {
  stats: FunnyStats
}

export default function FunnyStatBanner({ stats }: FunnyStatBannerProps) {
  const lines = Object.values(stats).filter(Boolean) as string[]
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (lines.length <= 1) return
    const timer = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % lines.length)
        setVisible(true)
      }, 400)
    }, 6000)
    return () => clearInterval(timer)
  }, [lines.length])

  if (lines.length === 0) return null

  return (
    <div className="card-parchment-gold px-6 py-5 my-6 text-center relative overflow-hidden">
      {/* Ornamental corner accents */}
      <span className="absolute top-2 left-3 text-gold-400/40 font-display text-lg leading-none select-none">❧</span>
      <span className="absolute top-2 right-3 text-gold-400/40 font-display text-lg leading-none select-none" style={{ transform: 'scaleX(-1)' }}>❧</span>

      <div className="text-gold-500 text-xs font-display uppercase tracking-widest mb-2">
        ✦ &nbsp; Royal Gazette &nbsp; ✦
      </div>
      <hr className="border-none h-px mx-auto mb-3" style={{ maxWidth: '120px', background: 'linear-gradient(to right, transparent, var(--dominion-gold), transparent)' }} />
      <p
        className={`font-display text-ink-900 text-lg italic leading-snug transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        &ldquo;{lines[idx]}&rdquo;
      </p>
      {lines.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {lines.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setVisible(true) }}
              className={`rounded-full transition-all ${i === idx ? 'w-4 h-2 bg-gold-400' : 'w-2 h-2 bg-parchment-300 hover:bg-gold-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
