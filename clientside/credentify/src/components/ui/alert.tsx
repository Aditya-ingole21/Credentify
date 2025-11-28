// src/components/ui/alert.tsx

import React from 'react'
import { cn } from '../../lib/utils'
export const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'success' | 'error' | 'warning' }>(
  ({ className, variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "relative w-full rounded-lg border p-4",
        {
          'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800': variant === 'default',
          'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800': variant === 'success',
          'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800': variant === 'error',
          'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  )
)
Alert.displayName = "Alert"