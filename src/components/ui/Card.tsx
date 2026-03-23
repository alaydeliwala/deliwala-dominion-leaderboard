interface CardProps {
  children: React.ReactNode
  className?: string
  gold?: boolean
}

export default function Card({ children, className = '', gold = false }: CardProps) {
  return (
    <div className={`${gold ? 'card-parchment-gold' : 'card-parchment'} p-4 ${className}`}>
      {children}
    </div>
  )
}
