// src/components/ui/card.tsx
import React from 'react'
import { cn } from '../../lib/utils'

// Card Component
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // FeedWall Style: White background, soft border, very subtle shadow
      "rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow duration-200",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

// CardHeader (No changes to padding/logic, just color consistency)
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pb-4", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

// CardTitle (Dark, high-contrast text)
export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // FeedWall Style: Dark text, medium weight
      "text-xl font-semibold text-gray-900",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// CardContent (Light gray text for body copy)
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // FeedWall Style: Subtler text color
      "p-6 pt-0 text-gray-600",
      className
    )}
    {...props}
  />
))
CardContent.displayName = "CardContent"