// src/components/ui/hero-section-light.tsx (or whatever your hero component file is named)

import * as React from "react"
import { cn } from "../../lib/utils"
import { ArrowRight } from "lucide-react" 

// Interface definition (kept for context)
interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: {
    regular: string
    highlight: string
  }
  ctaText?: string
  onCtaClick?: () => void
}

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title = "Academic Credentials, Decentralized.",
      subtitle = {
        regular: "The minimal solution that transforms paper diplomas into organized,",
        highlight: "instantly verifiable digital assets.",
      },
      ctaText = "Get Started - Connect Wallet",
      onCtaClick,
      ...props
    },
    ref,
  ) => {

    // ACCENT COLOR CHANGE: Gold/Amber Gradient for a premium, trustworthy look
    const ACCENT_CLASSES = "bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 transition-colors duration-200 shadow-lg shadow-red-500/30";

    return (
      <div 
        // Background: White canvas with a soft top padding
        className={cn("relative bg-white pt-32 pb-16", className)} 
        ref={ref} 
        {...props}
      >
        <section className="max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6">
            
            {/* Title - Large, Bold, and Dark */}
            <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 md:text-7xl">
              {title.split(',')[0]}
              {/* Highlight the key decentralized aspect using Gold */}
              <span className="text-red-600">
                {title.includes(',') ? ',' + title.split(',').slice(1).join(',') : null}
              </span>
            </h1>

            {/* Subtitle/Tagline - High readability and proper emphasis */}
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed pt-2">
              {subtitle.regular} 
              <span className="font-semibold text-gray-800">
                {subtitle.highlight}
              </span>
            </p>

            {/* CTA Button - Solid, accented, and prominent */}
            <div className="pt-8">
              <button
                onClick={onCtaClick}
                className={cn(
                    "inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium text-white rounded-lg",
                    ACCENT_CLASSES // Applying the Gold/Amber gradient
                )}
              >
                {ctaText}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>

            {/* Empty space/anchor for the Card mockup to sit on top of the border */}
            <div className="pt-20"></div>

          </div>
        </section>
      </div>
    )
  },
)

HeroSection.displayName = "HeroSection"
export { HeroSection }