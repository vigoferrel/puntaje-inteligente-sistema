import { cn } from "../../lib/utils"
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

(...args: unknown[]) => unknown Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }

