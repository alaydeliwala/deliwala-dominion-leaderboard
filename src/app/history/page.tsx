import { Suspense } from 'react'
import PageHeader from '@/components/layout/PageHeader'
import HistoryContent from './HistoryContent'

export default function HistoryPage() {
  return (
    <div>
      <PageHeader
        title="The Chronicles"
        subtitle="Every battle ever fought in the name of Dominion"
      />
      <Suspense fallback={<div className="text-center py-12 font-display text-gold-600 text-xl animate-pulse">Consulting the archives...</div>}>
        <HistoryContent />
      </Suspense>
    </div>
  )
}
