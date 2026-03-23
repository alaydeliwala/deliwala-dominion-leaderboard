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
    <div className="card-parchment-gold p-4 my-6 text-center">
      <div className="text-gold-600 text-xs font-display uppercase tracking-widest mb-1">
        ✦ Royal Gazette ✦
      </div>
      <p
        className={`font-display text-ink-900 text-lg italic transition-opacity duration-400 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        &ldquo;{lines[idx]}&rdquo;
      </p>
      {lines.length > 1 && (
        <div className="flex justify-center gap-1 mt-2">
          {lines.map((_, i) => (
            <button
              key={i}
              onClick={() => { setIdx(i); setVisible(true) }}
              className={`w-2 h-2 rounded-full transition-colors ${i === idx ? 'bg-gold-400' : 'bg-parchment-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
