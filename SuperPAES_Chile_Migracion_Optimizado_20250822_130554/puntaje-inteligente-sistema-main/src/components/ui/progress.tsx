import { forwardRef, HTMLAttributes } from "react"
import { cn } from "../../lib/utils"

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
}

const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, max = 100, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-slate-800/60 backdrop-blur-sm border border-white/10",
          className
        )}
        {...props}
      >
        <div
          className={`h-full w-full flex-1 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 transition-all duration-500 ease-out shadow-neural`}
          data-progress={percentage}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse" />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
