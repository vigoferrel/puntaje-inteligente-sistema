import { forwardRef, HTMLAttributes } from "react"
import { cn } from "../../lib/utils"

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variants = {
      default: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border-purple-500/30",
      secondary: "bg-slate-800/60 text-slate-300 border-slate-600/30",
      destructive: "bg-red-500/20 text-red-300 border-red-500/30",
      outline: "border-white/20 text-white bg-transparent"
    }

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-elegant backdrop-blur-sm",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
