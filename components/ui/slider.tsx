"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, disabled, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    disabled={disabled}
    style={{ 
      cursor: disabled ? 'not-allowed' : 'pointer',
      pointerEvents: 'auto',
      userSelect: 'none',
      minHeight: '24px',
      height: '24px'
    }}
    {...props}
  >
    <SliderPrimitive.Track 
      className="relative h-3 w-full grow overflow-hidden rounded-full"
      style={{ 
        backgroundColor: 'rgb(229, 231, 235)', 
        cursor: disabled ? 'not-allowed' : 'pointer',
        pointerEvents: 'auto'
      }}
    >
      <SliderPrimitive.Range 
        className="absolute h-full"
        style={{ backgroundColor: 'rgb(147, 51, 234)' }}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className={cn(
        "block h-6 w-6 rounded-full border-2 shadow-lg transition-all hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-500",
        disabled && "pointer-events-none opacity-50 cursor-not-allowed"
      )}
      style={{ 
        backgroundColor: 'white',
        borderColor: 'rgb(147, 51, 234)',
        boxShadow: '0 2px 8px rgba(147, 51, 234, 0.3)',
        zIndex: 20,
        cursor: disabled ? 'not-allowed' : 'grab',
        pointerEvents: 'auto',
        touchAction: 'none'
      }}
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
