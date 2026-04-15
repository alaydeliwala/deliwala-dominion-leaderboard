import type { Metadata } from 'next'
import { Inter, Fraunces } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-display',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Dominion Deliwalas',
  description: 'Family Dominion leaderboard — may the best Deliwala reign',
  icons: { icon: '/vp-icon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-parchment-50">
        <Navbar />
        <main className="max-w-5xl mx-auto px-4 pb-16 pt-4">{children}</main>
      </body>
    </html>
  )
}
