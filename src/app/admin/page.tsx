import PageHeader from '@/components/layout/PageHeader'
import PasswordGate from '@/components/admin/PasswordGate'

export default function AdminPage() {
  return (
    <div>
      <PageHeader
        title="The Royal Vault"
        subtitle="Banished games await their fate here"
      />
      <PasswordGate />
    </div>
  )
}
