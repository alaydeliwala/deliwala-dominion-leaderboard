import PageHeader from '@/components/layout/PageHeader'
import AddGameForm from '@/components/games/AddGameForm'

export default function AddGamePage() {
  return (
    <div>
      <PageHeader
        title="Record a Battle"
        subtitle="Inscribe this contest into the eternal chronicles"
      />
      <AddGameForm />
    </div>
  )
}
