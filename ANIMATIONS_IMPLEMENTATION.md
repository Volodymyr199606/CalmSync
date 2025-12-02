# Calming Animations Implementation Guide

## Overview
Adding subtle, calming animations to CalmSync will enhance the peaceful atmosphere and create a more immersive, therapeutic user experience. This guide covers various animation strategies that align with the app's wellness focus.

---

## 🎨 Animation Principles for CalmSync

### Core Guidelines
1. **Subtle & Smooth** - Animations should be calming, not distracting
2. **Purpose-Driven** - Each animation should enhance the experience
3. **Performance-First** - Use CSS transforms/opacity for smooth 60fps
4. **Accessibility-Aware** - Respect `prefers-reduced-motion`
5. **Therapeutic Intent** - Animations should promote relaxation

### Animation Types to Avoid
- ❌ Fast, jarring movements
- ❌ Excessive bouncing or shaking
- ❌ Strobing or flashing effects
- ❌ Overly complex particle systems
- ❌ Distracting parallax effects

---

## 🎯 Animation Categories

### 1. Background Animations (Subtle & Ambient)

#### A. Floating Particles/Leaves
**Purpose**: Create gentle, organic movement  
**Use Cases**: Dashboard background, landing page

```tsx
// components/animations/FloatingParticles.tsx
'use client';

import { useEffect, useRef } from 'react';

export function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
    }> = [];

    // Create gentle floating particles (leaves, petals)
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.3 + 0.1,
      });
    }

    let animationId: number;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Gentle floating motion
        particle.y += particle.speed;
        particle.x += Math.sin(particle.y * 0.01) * 0.5;

        // Reset when off screen
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }

        // Draw particle (leaf/petal shape)
        ctx.beginPath();
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
        ctx.ellipse(particle.x, particle.y, particle.size, particle.size * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10"
      style={{ opacity: 0.3 }}
    />
  );
}
```

#### B. Gentle Wave Animation
**Purpose**: Mimic ocean or water movement  
**Use Cases**: Dashboard background, experience view

```tsx
// components/animations/GentleWaves.tsx
'use client';

import { useEffect, useRef } from 'react';

export function GentleWaves() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    // Smooth wave animation via CSS
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <svg
        ref={svgRef}
        className="absolute bottom-0 w-full h-1/3"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        <path
          d="M0,150 Q300,100 600,150 T1200,150 L1200,300 L0,300 Z"
          fill="rgba(147, 51, 234, 0.1)"
        >
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values="0 0; -50 0; 0 0"
            dur="20s"
            repeatCount="indefinite"
          />
        </path>
        <path
          d="M0,200 Q400,150 800,200 T1600,200 L1600,300 L0,300 Z"
          fill="rgba(99, 102, 241, 0.08)"
        >
          <animateTransform
            attributeName="transform"
            type="translate"
            values="0 0; 50 0; 0 0"
            dur="25s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
```

#### C. Soft Gradient Shift
**Purpose**: Subtle color transitions  
**Use Cases**: Background overlays

```css
/* app/globals.css */
@keyframes gentle-gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.gradient-animated {
  background: linear-gradient(-45deg, 
    rgba(147, 51, 234, 0.1),
    rgba(99, 102, 241, 0.1),
    rgba(236, 72, 153, 0.1),
    rgba(147, 51, 234, 0.1)
  );
  background-size: 400% 400%;
  animation: gentle-gradient-shift 15s ease infinite;
}
```

### 2. UI Micro-Interactions

#### A. Smooth Button Hovers
```css
/* Enhanced button interactions */
.btn-calming {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-calming:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(147, 51, 234, 0.2);
}

.btn-calming:active {
  transform: translateY(0);
  transition: transform 0.1s;
}
```

#### B. Card Lift on Hover
```css
.card-hover {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-hover:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

#### C. Smooth Form Focus Transitions
```tsx
// Enhanced input focus with gentle glow
<input
  className="transition-all duration-300 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 focus:shadow-lg"
/>
```

### 3. Page Transitions

#### A. Fade-In Animations
```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.fade-in-up-delay-1 {
  animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.1s forwards;
  opacity: 0;
}

.fade-in-up-delay-2 {
  animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
  opacity: 0;
}
```

#### B. Smooth Page Load Sequence
```tsx
// Staggered fade-in for dashboard elements
<div className="space-y-6">
  <div className="fade-in-up">Welcome message</div>
  <div className="fade-in-up-delay-1">Mood form</div>
  <div className="fade-in-up-delay-2">Experience view</div>
</div>
```

### 4. Breathing & Meditation Animations

#### A. Enhanced Breathing Circle
**Current**: Basic expand/contract  
**Enhanced**: More organic, smooth breathing

```tsx
// components/animations/EnhancedBreathing.tsx
'use client';

export function EnhancedBreathingCircle({
  inhaleSeconds = 4,
  holdSeconds = 2,
  exhaleSeconds = 6,
}: {
  inhaleSeconds?: number;
  holdSeconds?: number;
  exhaleSeconds?: number;
}) {
  const cycleDuration = (inhaleSeconds + holdSeconds + exhaleSeconds) * 1000;

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
        {/* Outer breathing circle with smooth animation */}
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-60"
          style={{
            animation: `breathe ${cycleDuration}ms ease-in-out infinite`,
          }}
        />
        
        {/* Inner pulse */}
        <div
          className="absolute inset-4 rounded-full bg-white/30"
          style={{
            animation: `pulse-inner ${cycleDuration}ms ease-in-out infinite`,
          }}
        />
        
        {/* Center text */}
        <span className="relative z-10 text-sm font-medium text-white sm:text-base">
          Breathe In
        </span>
      </div>
    </div>
  );
}
```

```css
@keyframes breathe {
  0% {
    transform: scale(0.8);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 0.6;
  }
  60% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(0.8);
    opacity: 0.4;
  }
}

@keyframes pulse-inner {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
}
```

#### B. Guided Breathing Counter
```tsx
// components/animations/GuidedBreathing.tsx
'use client';

import { useState, useEffect } from 'react';

export function GuidedBreathing({
  cycles = 5,
  inhale = 4,
  hold = 2,
  exhale = 6,
}: {
  cycles?: number;
  inhale?: number;
  hold?: number;
  exhale?: number;
}) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [count, setCount] = useState(inhale);
  const [cycle, setCycle] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) return prev - 1;

        // Phase transition
        if (phase === 'inhale') {
          setPhase('hold');
          return hold;
        } else if (phase === 'hold') {
          setPhase('exhale');
          return exhale;
        } else {
          if (cycle < cycles) {
            setCycle((c) => c + 1);
            setPhase('inhale');
            return inhale;
          }
          return 0; // Complete
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, cycle, cycles, inhale, hold, exhale]);

  return (
    <div className="text-center space-y-4">
      <div className="text-4xl font-bold text-purple-600">{count}</div>
      <div className="text-lg capitalize">{phase}</div>
      <div className="text-sm text-gray-600">
        Cycle {cycle} of {cycles}
      </div>
    </div>
  );
}
```

### 5. Loading States (Calming Alternatives)

#### A. Breathing Loader
```tsx
// components/animations/BreathingLoader.tsx
export function BreathingLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-purple-200 animate-ping opacity-75" />
        <div className="relative rounded-full bg-purple-400 h-12 w-12" />
      </div>
    </div>
  );
}
```

#### B. Gentle Pulse Loader
```css
@keyframes gentle-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

.loader-pulse {
  animation: gentle-pulse 2s ease-in-out infinite;
}
```

#### C. Wave Loader
```tsx
// components/animations/WaveLoader.tsx
export function WaveLoader() {
  return (
    <div className="flex items-center justify-center gap-1 py-12">
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="w-1 h-8 bg-purple-400 rounded-full"
          style={{
            animation: `wave 1.5s ease-in-out infinite ${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  );
}
```

```css
@keyframes wave {
  0%, 100% {
    transform: scaleY(0.5);
    opacity: 0.7;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}
```

### 6. Nature-Themed Animations

#### A. Falling Leaves/Petals
```tsx
// components/animations/FallingLeaves.tsx
'use client';

export function FallingLeaves() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute text-purple-300 opacity-30"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `fall ${10 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            fontSize: `${10 + Math.random() * 20}px`,
          }}
        >
          🍃
        </div>
      ))}
    </div>
  );
}
```

```css
@keyframes fall {
  0% {
    transform: translateY(-100px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(calc(100vh + 100px)) rotate(360deg);
    opacity: 0;
  }
}
```

#### B. Gentle Cloud Movement
```tsx
// components/animations/MovingClouds.tsx
export function MovingClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div
        className="absolute top-20 left-0 text-6xl opacity-20"
        style={{
          animation: 'float 30s linear infinite',
        }}
      >
        ☁️
      </div>
      <div
        className="absolute top-40 right-0 text-5xl opacity-15"
        style={{
          animation: 'float-reverse 40s linear infinite',
        }}
      >
        ☁️
      </div>
    </div>
  );
}
```

```css
@keyframes float {
  from {
    transform: translateX(-100px);
  }
  to {
    transform: translateX(calc(100vw + 100px));
  }
}

@keyframes float-reverse {
  from {
    transform: translateX(calc(100vw + 100px));
  }
  to {
    transform: translateX(-100px);
  }
}
```

### 7. Success & Feedback Animations

#### A. Gentle Success Confetti
```tsx
// components/animations/CalmConfetti.tsx
'use client';

export function CalmConfetti({ show }: { show: boolean }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: '50%',
            top: '50%',
            backgroundColor: ['#9333EA', '#6366F1', '#EC4899'][i % 3],
            animation: `confetti-fall ${2 + Math.random()}s ease-out forwards`,
            transform: `translate(${(Math.random() - 0.5) * 400}px, 0)`,
          }}
        />
      ))}
    </div>
  );
}
```

```css
@keyframes confetti-fall {
  to {
    transform: translateY(100vh) rotate(360deg);
    opacity: 0;
  }
}
```

#### B. Smooth Notification Slide-In
```css
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification-enter {
  animation: slide-in-right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 8. Interactive Animations

#### A. Mood Button Selection
```tsx
// Enhanced mood button with selection animation
<button
  className={cn(
    'transition-all duration-300 transform',
    selected && 'scale-105 ring-4 ring-purple-300 ring-opacity-50'
  )}
  onClick={handleSelect}
>
  {/* Button content */}
</button>
```

#### B. Smooth Slider Interactions
```css
/* Enhanced slider with smooth thumb movement */
input[type="range"] {
  transition: all 0.2s ease;
}

input[type="range"]:active {
  transform: scale(1.05);
}
```

---

## 🎯 Implementation Locations

### Priority 1: Dashboard
- [ ] Background: Floating particles or gentle waves
- [ ] Page load: Staggered fade-in for elements
- [ ] Cards: Hover lift effect
- [ ] Forms: Smooth focus transitions
- [ ] Buttons: Enhanced hover states

### Priority 2: Landing Page
- [ ] Hero: Gentle fade-in animations
- [ ] Background: Moving clouds or particles
- [ ] CTA buttons: Attractive hover effects
- [ ] Form: Smooth validation animations

### Priority 3: Experience View
- [ ] Enhanced breathing animation
- [ ] Smooth content transitions
- [ ] Media player: Gentle controls
- [ ] Text prompts: Fade-in sequence

### Priority 4: Global
- [ ] Page transitions
- [ ] Loading states (breathing loader)
- [ ] Notification animations
- [ ] Success feedback

---

## ⚡ Performance Optimization

### Best Practices

1. **Use CSS Animations** (preferred over JS)
   ```css
   /* ✅ Good - GPU accelerated */
   transform: translateY(0);
   
   /* ❌ Bad - causes repaint */
   top: 0;
   ```

2. **Use `will-change` Sparingly**
   ```css
   .animated-element {
     will-change: transform;
   }
   /* Remove after animation completes */
   ```

3. **Respect `prefers-reduced-motion`**
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       animation-iteration-count: 1 !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

4. **Limit Concurrent Animations**
   - Max 2-3 background animations
   - Debounce rapid interactions

5. **Use `requestAnimationFrame` for JS Animations**
   ```tsx
   useEffect(() => {
     let animationId: number;
     function animate() {
       // Animation logic
       animationId = requestAnimationFrame(animate);
     }
     animate();
     return () => cancelAnimationFrame(animationId);
   }, []);
   ```

---

## ♿ Accessibility Considerations

### Reduced Motion Support

```tsx
// hooks/useReducedMotion.ts
'use client';

import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}
```

```tsx
// Usage
const reducedMotion = useReducedMotion();

<div
  style={{
    animation: reducedMotion ? 'none' : 'fade-in 0.6s ease',
  }}
>
  Content
</div>
```

---

## 📋 Implementation Checklist

### Phase 1: Foundation (Quick Wins)
- [ ] Add fade-in animations to dashboard elements
- [ ] Enhance button hover states
- [ ] Add smooth card hover effects
- [ ] Implement breathing loader for loading states
- [ ] Add `prefers-reduced-motion` support

### Phase 2: Background Animations
- [ ] Add floating particles to dashboard
- [ ] Implement gentle wave animation
- [ ] Add soft gradient shifts
- [ ] Test performance impact

### Phase 3: Enhanced Interactions
- [ ] Improve breathing animation in experience view
- [ ] Add smooth form transitions
- [ ] Enhance mood selection animations
- [ ] Add page transition effects

### Phase 4: Advanced Features
- [ ] Implement guided breathing counter
- [ ] Add success feedback animations
- [ ] Create nature-themed particle effects
- [ ] Add notification slide-ins

---

## 🎨 Animation Library Recommendations

### CSS Libraries
- **Animate.css** - Simple, lightweight
- **Motion One** - Modern, performant
- **Framer Motion** - React-specific, powerful (might be overkill)

### React Animation Libraries
- **react-spring** - Physics-based, smooth
- **framer-motion** - Feature-rich, declarative
- **react-transition-group** - Simple transitions

**Recommendation**: Start with pure CSS animations for best performance, add libraries only if needed for complex animations.

---

## 🚀 Quick Start Examples

### 1. Add Fade-In to Dashboard
```tsx
// app/dashboard/DashboardClient.tsx
<div className="space-y-4 sm:space-y-6">
  <div className="fade-in-up">
    {/* Welcome header */}
  </div>
  <div className="fade-in-up-delay-1">
    {/* Mood form */}
  </div>
  <div className="fade-in-up-delay-2">
    {/* Experience view */}
  </div>
</div>
```

### 2. Add Floating Particles
```tsx
// components/layout/AppShell.tsx
import { FloatingParticles } from '@/components/animations/FloatingParticles';

export function AppShell({ children }) {
  return (
    <div>
      <FloatingParticles />
      {/* Rest of content */}
    </div>
  );
}
```

### 3. Enhance Breathing Animation
```tsx
// Replace existing breathing animation with enhanced version
import { EnhancedBreathingCircle } from '@/components/animations/EnhancedBreathing';

<EnhancedBreathingCircle
  inhaleSeconds={4}
  holdSeconds={2}
  exhaleSeconds={6}
/>
```

---

## 📝 Notes

- **Start Simple**: Begin with fade-ins and hover effects
- **Test Performance**: Monitor FPS, especially on mobile
- **User Feedback**: Some users may prefer fewer animations
- **Balance**: Animations should enhance, not distract
- **Mobile First**: Test on slower devices

---

*Last Updated: 2025-11-26*  
*Focus: Calming, Therapeutic, Performance-Optimized Animations*

