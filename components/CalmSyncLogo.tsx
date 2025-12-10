"use client"

import type { SVGProps } from "react"
import { cn } from "@/lib/utils"

interface CalmSyncLogoProps extends SVGProps<SVGSVGElement> {
  className?: string
  animated?: boolean
}

/**
 * CalmSync Logo Component
 * Custom SVG logo with optional breathing animation
 */
export function CalmSyncLogo({ className, animated = true, ...props }: CalmSyncLogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-[64px] w-[64px] text-primary", animated && "animate-breathe", className)}
      {...props}
    >
      {/* Outer ring - lighter sage */}
      <circle
        cx="32"
        cy="32"
        r="28"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
        className="text-sage-400"
      />
      {/* Middle ring - medium sage */}
      <circle
        cx="32"
        cy="32"
        r="20"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
        className="text-sage-500"
      />
      {/* Inner circle - solid sage */}
      <circle cx="32" cy="32" r="12" fill="currentColor" className="text-sage-600" />
      {/* Subtle highlight on inner circle */}
      <circle cx="32" cy="32" r="8" fill="white" opacity="0.2" />
    </svg>
  )
}
