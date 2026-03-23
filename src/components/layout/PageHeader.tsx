interface PageHeaderProps {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center py-6">
      <h1 className="font-display text-4xl text-ink-900 mb-2">{title}</h1>
      {subtitle && <p className="italic font-serif text-lg" style={{ color: '#1E2D5C' }}>{subtitle}</p>}
      <hr className="divider-gold mt-4" />
    </div>
  )
}
