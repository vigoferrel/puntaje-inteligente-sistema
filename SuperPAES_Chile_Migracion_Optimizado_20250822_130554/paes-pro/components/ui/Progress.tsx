import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow'
  size?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, color = 'blue', size = 'md', showPercentage = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500'
    }
    
    const sizes = {
      sm: 'h-1.5',
      md: 'h-2',
      lg: 'h-3'
    }

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showPercentage && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700">Progreso</span>
            <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
          </div>
        )}
        <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizes[size])}>
          <div
            className={cn(
              'h-full transition-all duration-500 ease-out rounded-full',
              colors[color]
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = 'Progress'

export { Progress }
