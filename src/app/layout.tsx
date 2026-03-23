import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

export const metadata: Metadata = {
  title: 'The Dominion Deliwalas',
  description: 'Family Dominion leaderboard — may the best Deliwala reign',
  icons: { icon: '/vp-icon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-parchment-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 pb-16 pt-4">{children}</main>
      </body>
    </html>
  )
}
