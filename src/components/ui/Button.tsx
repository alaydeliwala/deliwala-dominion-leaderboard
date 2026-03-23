import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'gold' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({ variant = 'gold', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-serif font-semibold rounded border-2 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    gold: 'bg-gold-400 border-gold-600 text-ink-900 hover:bg-gold-300 hover:shadow-[0_0_12px_rgba(212,160,23,0.4)]',
    ghost: 'bg-transparent border-parchment-200 text-ink-900 hover:border-gold-400 hover:bg-parchment-100',
    danger: 'bg-crimson-700 border-crimson-800 text-parchment-50 hover:bg-crimson-800',
  }
  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
