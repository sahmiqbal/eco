import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  variant?: 'default' | 'primary' | 'gold'
  className?: string
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default', className }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-2xl border p-5 flex flex-col gap-3 shadow-sm',
      variant === 'primary' ? 'bg-primary text-primary-foreground border-primary' :
      variant === 'gold' ? 'bg-gold text-gold-foreground border-gold' :
      'bg-card text-card-foreground border-border',
      className
    )}>
      <div className="flex items-start justify-between">
        <p className={cn(
          'text-xs font-medium uppercase tracking-wide',
          variant !== 'default' ? 'opacity-80' : 'text-muted-foreground'
        )}>
          {title}
        </p>
        <div className={cn(
          'w-9 h-9 rounded-xl flex items-center justify-center',
          variant !== 'default' ? 'bg-white/15' : 'bg-primary/10'
        )}>
          <Icon className={cn('size-4.5', variant !== 'default' ? 'opacity-90' : 'text-primary')} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
        {trend && (
          <p className={cn('text-xs mt-0.5', variant !== 'default' ? 'opacity-70' : 'text-muted-foreground')}>
            {trend}
          </p>
        )}
      </div>
    </div>
  )
}
