# Mercury + shadcn/ui Integration Guide

*Seamless integration of shadcn/ui components with Mercury design principles*

## Overview

[shadcn/ui](https://ui.shadcn.com/) provides "beautifully-designed, accessible components" that align perfectly with Mercury's inclusive design philosophy. This guide shows how to adapt these high-quality components to embody Mercury's fluid, focused, and humane principles.

## Initial Setup

### 1. Install shadcn/ui

```bash
npx shadcn-ui@latest init
```

### 2. Enhanced Tailwind Configuration

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Mercury + shadcn/ui integration
      fontFamily: {
        'mercury': ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // shadcn/ui colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // Mercury colors
        mercury: {
          primary: 'hsl(var(--mercury-primary))',
          focused: 'hsl(var(--mercury-focused))',
          ambient: 'hsl(var(--mercury-ambient))',
          fog: 'hsl(var(--mercury-fog))',
        }
      },
      animation: {
        'mercury-enter': 'mercury-enter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'mercury-focus': 'mercury-focus 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'mercury-enter': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'mercury-focus': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.01)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

## CSS Variables Setup

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* shadcn/ui variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 47.4% 11.2%;
    --radius: 0.75rem;

    /* Mercury variables */
    --mercury-primary: 220 100% 50%;
    --mercury-focused: 220 100% 50%;
    --mercury-ambient: 210 20% 70%;
    --mercury-fog: 210 10% 90%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}

@layer components {
  .mercury-focused {
    @apply ring-2 ring-mercury-focused ring-offset-2 scale-[1.01] z-10;
  }
  
  .mercury-ambient {
    @apply opacity-70 scale-[0.98];
    filter: blur(0.5px);
  }
  
  .mercury-fog {
    @apply opacity-40 scale-95;
    filter: blur(1px);
  }
}
```

## Mercury-Enhanced Components

### Mercury Card Component

```tsx
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MercuryCardProps extends React.ComponentProps<typeof Card> {
  focusLevel?: 'focused' | 'ambient' | 'fog'
  intent?: string
}

const MercuryCard = React.forwardRef<
  React.ElementRef<typeof Card>,
  MercuryCardProps
>(({ className, focusLevel = 'ambient', intent, children, ...props }, ref) => {
  const focusClasses = {
    focused: 'mercury-focused animate-mercury-focus',
    ambient: 'mercury-ambient',
    fog: 'mercury-fog'
  }

  return (
    <Card
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-out",
        focusClasses[focusLevel],
        className
      )}
      data-intent={intent}
      {...props}
    >
      {children}
    </Card>
  )
})
MercuryCard.displayName = "MercuryCard"
```

### Mercury Button Component

```tsx
import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MercuryButtonProps extends ButtonProps {
  intent?: string
  priority?: 'primary' | 'secondary' | 'ambient'
}

const MercuryButton = React.forwardRef<
  React.ElementRef<typeof Button>,
  MercuryButtonProps
>(({ className, intent, priority = 'primary', ...props }, ref) => {
  const priorityClasses = {
    primary: 'bg-mercury-primary hover:bg-mercury-focused text-white',
    secondary: 'bg-secondary hover:mercury-focused',
    ambient: 'mercury-ambient hover:mercury-focused'
  }

  return (
    <Button
      ref={ref}
      className={cn(
        "transition-all duration-300 ease-out",
        "focus:mercury-focused focus:outline-none",
        "active:scale-95",
        priorityClasses[priority],
        className
      )}
      data-intent={intent}
      {...props}
    />
  )
})
```

### Mercury Command Palette

```tsx
import * as React from "react"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

interface MercuryCommandProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCommand: (command: string) => void
}

export function MercuryCommandPalette({ 
  open, 
  onOpenChange, 
  onCommand 
}: MercuryCommandProps) {
  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
      className="border-0 shadow-2xl backdrop-blur-xl bg-white/95"
    >
      <Command>
        <CommandInput 
          placeholder="What would you like to do?"
          className="border-0"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggested Actions">
            <CommandItem onSelect={() => onCommand("create new task")}>
              Create new task
            </CommandItem>
            <CommandItem onSelect={() => onCommand("review inbox")}>
              Review inbox
            </CommandItem>
            <CommandItem onSelect={() => onCommand("switch to focus mode")}>
              Switch to focus mode
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
```

## Focus Management Hook

```tsx
import { useState, useCallback } from 'react'

interface UseMercuryFocusProps {
  totalItems: number
  defaultFocus?: number
  mode?: 'single' | 'multiple'
}

export function useMercuryFocus({ 
  totalItems, 
  defaultFocus = 0, 
  mode = 'single' 
}: UseMercuryFocusProps) {
  const [focusedItems, setFocusedItems] = useState<Set<number>>(
    new Set([defaultFocus])
  )

  const getFocusLevel = useCallback((index: number) => {
    if (focusedItems.has(index)) return 'focused'
    return 'ambient'
  }, [focusedItems])

  const setFocus = useCallback((index: number) => {
    setFocusedItems(prev => {
      if (mode === 'single') {
        return new Set([index])
      } else {
        const newSet = new Set(prev)
        if (newSet.has(index)) {
          newSet.delete(index)
        } else {
          newSet.add(index)
        }
        return newSet
      }
    })
  }, [mode])

  return {
    focusedItems,
    getFocusLevel,
    setFocus,
  }
}
```

## Complete Example: Mercury Dashboard

```tsx
import { useState, useEffect } from 'react'
import { MercuryCard } from './mercury-card'
import { MercuryCommandPalette } from './mercury-command-palette'
import { useMercuryFocus } from './use-mercury-focus'
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MercuryDashboard() {
  const [commandOpen, setCommandOpen] = useState(false)
  const { getFocusLevel, setFocus } = useMercuryFocus({ 
    totalItems: 4, 
    defaultFocus: 0 
  })

  // Command palette shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCommand = (command: string) => {
    console.log('Executing:', command)
    setCommandOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Your Workspace</h1>
        <p className="text-gray-600">Press ⌘K to open command palette</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <MercuryCard
          focusLevel={getFocusLevel(0)}
          intent="review-revenue"
          onClick={() => setFocus(0)}
          className="cursor-pointer animate-mercury-enter"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,231.89</div>
            <p className="text-xs text-gray-500">+20.1% from last month</p>
          </CardContent>
        </MercuryCard>

        {/* Subscriptions Card */}
        <MercuryCard
          focusLevel={getFocusLevel(1)}
          intent="review-subscriptions"
          onClick={() => setFocus(1)}
          className="cursor-pointer animate-mercury-enter"
          style={{ animationDelay: '100ms' }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2,350</div>
            <p className="text-xs text-gray-500">+180.1% from last month</p>
          </CardContent>
        </MercuryCard>

        {/* Tasks Card */}
        <MercuryCard
          focusLevel={getFocusLevel(2)}
          intent="review-tasks"
          onClick={() => setFocus(2)}
          className="cursor-pointer animate-mercury-enter"
          style={{ animationDelay: '200ms' }}
        >
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">Design system update</div>
              <div className="text-sm">Code review</div>
              <div className="text-sm">Team meeting prep</div>
            </div>
          </CardContent>
        </MercuryCard>

        {/* Calendar Card */}
        <MercuryCard
          focusLevel={getFocusLevel(3)}
          intent="review-calendar"
          onClick={() => setFocus(3)}
          className="cursor-pointer animate-mercury-enter"
          style={{ animationDelay: '300ms' }}
        >
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-1">
              <div>Team meeting - 2:00 PM</div>
              <div>Design review - 4:00 PM</div>
            </div>
          </CardContent>
        </MercuryCard>
      </div>

      <MercuryCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onCommand={handleCommand}
      />
    </div>
  )
}
```

## Mercury Form Example

```tsx
import { MercuryCard } from './mercury-card'
import { MercuryButton } from './mercury-button'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MercuryForm() {
  return (
    <div className="max-w-md mx-auto p-6">
      <MercuryCard focusLevel="focused" intent="create-task">
        <CardHeader>
          <CardTitle>Create New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input 
              id="title" 
              placeholder="Enter task title"
              className="focus:mercury-focused transition-all duration-300"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Enter description"
              className="focus:mercury-focused transition-all duration-300 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <MercuryButton priority="secondary">Cancel</MercuryButton>
            <MercuryButton priority="primary" intent="create-task">
              Create Task
            </MercuryButton>
          </div>
        </CardContent>
      </MercuryCard>
    </div>
  )
}
```

## Best Practices

### 1. Focus Management
- Use Mercury focus levels to guide attention
- Implement clear intention context with `data-intent`
- Provide keyboard navigation shortcuts

### 2. Animation Guidelines
- Use Mercury's natural easing curves
- Implement staggered animations for lists
- Respect `prefers-reduced-motion`

### 3. Color Integration
- Map shadcn/ui colors to Mercury intentions
- Maintain accessibility contrast ratios
- Use Mercury focus states consistently

### 4. Component Enhancement
- Extend shadcn/ui components with Mercury props
- Maintain original accessibility features
- Add intention-driven behaviors

## Conclusion

This integration combines shadcn/ui's excellent component foundation with Mercury's intention-driven, cognitively inclusive design principles. The result is a design system that reduces cognitive load while maintaining the high quality and accessibility that both systems prioritize.

**Key Benefits:**
- Reduced cognitive load through clear focus hierarchy
- Intention-driven design that responds to user goals
- Accessibility-first approach for neurodivergent users
- Familiar shadcn/ui patterns enhanced with Mercury principles

**References:**
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- Mercury OS Design Principles by Jason Yuan 