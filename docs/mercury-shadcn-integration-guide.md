# Mercury + shadcn/ui Integration Guide
## Seamless Integration of shadcn/ui with Mercury Design Principles

*Transforming shadcn/ui components to embody fluid, focused, and humane design*

---

## Table of Contents

1. [Overview](#overview)
2. [Initial Setup](#initial-setup)
3. [Mercury Theme Configuration](#mercury-theme-configuration)
4. [Component Adaptations](#component-adaptations)
5. [Focus Management Integration](#focus-management-integration)
6. [Mercury-Enhanced Components](#mercury-enhanced-components)
7. [Animation Integration](#animation-integration)
8. [Practical Examples](#practical-examples)

---

## Overview

[shadcn/ui](https://ui.shadcn.com/) provides a excellent foundation of "beautifully-designed, accessible components" that aligns well with Mercury's inclusive design philosophy. However, to truly embody Mercury's principles, we need to adapt these components to be more **intention-driven**, **cognitively inclusive**, and **focus-aware**.

### Why This Integration Works

- **Shared Values**: Both prioritize accessibility and beautiful design
- **Flexible Architecture**: shadcn/ui's copy-paste approach allows for Mercury customizations
- **Component Quality**: High-quality components reduce cognitive load
- **Framework Agnostic**: Works with React, our target framework

---

## Initial Setup

### 1. Install shadcn/ui with Mercury Configuration

```bash
npx shadcn-ui@latest init
```

When prompted, configure for Mercury:

```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  }
}
```

### 2. Enhanced Tailwind Configuration

Extend your existing Mercury Tailwind config to include shadcn/ui compatibility:

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
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Existing Mercury configuration
      fontFamily: {
        'mercury': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'mercury-hero': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1' }],
        'mercury-title': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2' }],
        'mercury-body': ['1rem', { lineHeight: '1.6' }],
        'mercury-caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      colors: {
        // shadcn/ui color system adapted for Mercury
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        // Mercury-specific colors
        mercury: {
          primary: 'hsl(var(--mercury-primary))',
          focused: 'hsl(var(--mercury-focused))',
          ambient: 'hsl(var(--mercury-ambient))',
          fog: 'hsl(var(--mercury-fog))',
          surface: {
            primary: 'hsl(var(--mercury-surface-primary))',
            secondary: 'hsl(var(--mercury-surface-secondary))',
            elevated: 'hsl(var(--mercury-surface-elevated))',
          },
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        // Mercury radius
        'mercury': 'var(--mercury-radius)',
      },
      // Mercury animations
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

---

## Mercury Theme Configuration

### Enhanced CSS Variables

Update your `globals.css` to include both shadcn/ui and Mercury variables:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* shadcn/ui variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 47.4% 11.2%;
    --radius: 0.75rem;

    /* Mercury-specific variables */
    --mercury-primary: 220 100% 50%;
    --mercury-focused: 220 100% 50%;
    --mercury-ambient: 210 20% 70%;
    --mercury-fog: 210 10% 90%;
    --mercury-surface-primary: 0 0% 100%;
    --mercury-surface-secondary: 210 20% 98%;
    --mercury-surface-elevated: 0 0% 100%;
    --mercury-text-primary: 220 20% 10%;
    --mercury-text-secondary: 220 10% 40%;
    --mercury-radius: 0.75rem;
  }

  .dark {
    /* Dark mode shadcn/ui variables */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;

    /* Mercury dark mode */
    --mercury-surface-primary: 220 20% 8%;
    --mercury-surface-secondary: 220 20% 10%;
    --mercury-surface-elevated: 220 20% 12%;
    --mercury-text-primary: 0 0% 95%;
    --mercury-text-secondary: 220 10% 70%;
  }
}

/* Mercury utility classes */
@layer components {
  .mercury-module {
    @apply bg-mercury-surface-primary rounded-mercury p-4 transition-all duration-300 ease-out;
  }
  
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

---

## Component Adaptations

### 1. Mercury Card Component

Enhance shadcn/ui's Card with Mercury focus states:

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
        "mercury-module",
        focusClasses[focusLevel],
        "transition-all duration-300 ease-out",
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

// Usage Example
function ProjectCard({ project, focusLevel }) {
  return (
    <MercuryCard 
      focusLevel={focusLevel}
      intent="review-project"
      className="cursor-pointer hover:mercury-focused"
    >
      <CardHeader>
        <CardTitle className="text-mercury-title">{project.name}</CardTitle>
        <CardDescription className="text-mercury-caption">
          {project.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-mercury-body">{project.status}</p>
      </CardContent>
    </MercuryCard>
  )
}
```

### 2. Mercury Button Component

Adapt shadcn/ui Button with Mercury interaction principles:

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
    secondary: 'bg-mercury-surface-elevated hover:mercury-focused',
    ambient: 'mercury-ambient hover:mercury-focused text-mercury-text-secondary'
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
MercuryButton.displayName = "MercuryButton"
```

### 3. Mercury Command Palette

Transform shadcn/ui's Command into Mercury's natural language interface:

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
      className="mercury-module border-0 shadow-2xl"
    >
      <div className="mercury-fog-effect absolute inset-0 -z-10" />
      <Command className="bg-transparent">
        <CommandInput 
          placeholder="What would you like to do?"
          className="text-mercury-body placeholder:text-mercury-text-secondary border-0"
        />
        <CommandList>
          <CommandEmpty className="text-mercury-caption text-mercury-text-muted">
            No results found.
          </CommandEmpty>
          <CommandGroup heading="Suggested Actions">
            <CommandItem onSelect={() => onCommand("create new task")}>
              <span className="text-mercury-body">Create new task</span>
            </CommandItem>
            <CommandItem onSelect={() => onCommand("review inbox")}>
              <span className="text-mercury-body">Review inbox</span>
            </CommandItem>
            <CommandItem onSelect={() => onCommand("switch to focus mode")}>
              <span className="text-mercury-body">Switch to focus mode</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
```

---

## Focus Management Integration

### Mercury Focus Manager Hook

```tsx
import { useState, useCallback, useEffect } from 'react'

interface UseMercuryFocusProps {
  totalItems: number
  defaultFocus?: number
  mode?: 'single' | 'multiple' | 'progressive'
}

export function useMercuryFocus({ 
  totalItems, 
  defaultFocus = 0, 
  mode = 'single' 
}: UseMercuryFocusProps) {
  const [focusedItems, setFocusedItems] = useState<Set<number>>(
    new Set(mode === 'single' ? [defaultFocus] : [])
  )

  const getFocusLevel = useCallback((index: number) => {
    if (focusedItems.has(index)) return 'focused'
    if (mode === 'progressive' && index < Math.max(...focusedItems)) return 'ambient'
    return 'fog'
  }, [focusedItems, mode])

  const setFocus = useCallback((index: number) => {
    setFocusedItems(prev => {
      const newSet = new Set<number>()
      if (mode === 'single') {
        newSet.add(index)
      } else {
        newSet.add(...prev)
        if (prev.has(index)) {
          newSet.delete(index)
        } else {
          newSet.add(index)
        }
      }
      return newSet
    })
  }, [mode])

  return {
    focusedItems,
    getFocusLevel,
    setFocus,
    clearFocus: () => setFocusedItems(new Set()),
  }
}
```

### Usage in Components

```tsx
function MercuryDashboard() {
  const { getFocusLevel, setFocus } = useMercuryFocus({ 
    totalItems: 6, 
    defaultFocus: 0,
    mode: 'single'
  })

  const modules = [
    { title: "Revenue Overview", component: RevenueChart },
    { title: "Recent Tasks", component: TaskList },
    { title: "Team Activity", component: TeamActivity },
    { title: "Calendar", component: Calendar },
    { title: "Settings", component: Settings },
    { title: "Analytics", component: Analytics },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {modules.map((module, index) => (
        <MercuryCard
          key={module.title}
          focusLevel={getFocusLevel(index)}
          intent={`review-${module.title.toLowerCase().replace(' ', '-')}`}
          onClick={() => setFocus(index)}
          className="animate-mercury-enter"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardHeader>
            <CardTitle className="text-mercury-title">{module.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <module.component />
          </CardContent>
        </MercuryCard>
      ))}
    </div>
  )
}
```

---

## Mercury-Enhanced Components

### 1. Mercury Form with Progressive Disclosure

```tsx
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MercuryForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({})

  const steps = [
    {
      title: "Basic Information",
      fields: [
        { name: "title", label: "Task Title", type: "input" },
        { name: "description", label: "Description", type: "textarea" }
      ]
    },
    {
      title: "Details",
      fields: [
        { name: "priority", label: "Priority", type: "select" },
        { name: "dueDate", label: "Due Date", type: "date" }
      ]
    },
    {
      title: "Assignment",
      fields: [
        { name: "assignee", label: "Assignee", type: "select" },
        { name: "tags", label: "Tags", type: "input" }
      ]
    }
  ]

  return (
    <MercuryCard 
      focusLevel="focused" 
      intent="create-task"
      className="max-w-md mx-auto"
    >
      <CardHeader>
        <CardTitle className="text-mercury-title">
          {steps[currentStep].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps[currentStep].fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label className="text-mercury-body">{field.label}</Label>
            {field.type === 'input' && (
              <Input 
                className="focus:mercury-focused transition-all duration-300"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
            {field.type === 'textarea' && (
              <Textarea 
                className="focus:mercury-focused transition-all duration-300 resize-none"
                placeholder={`Enter ${field.label.toLowerCase()}`}
              />
            )}
          </div>
        ))}
        
        <div className="flex justify-between pt-4">
          {currentStep > 0 && (
            <MercuryButton
              priority="secondary"
              onClick={() => setCurrentStep(prev => prev - 1)}
            >
              Previous
            </MercuryButton>
          )}
          
          <MercuryButton
            priority="primary"
            onClick={() => {
              if (currentStep < steps.length - 1) {
                setCurrentStep(prev => prev + 1)
              } else {
                // Submit form
                console.log('Form submitted')
              }
            }}
            className="ml-auto"
          >
            {currentStep < steps.length - 1 ? 'Next' : 'Create Task'}
          </MercuryButton>
        </div>
      </CardContent>
    </MercuryCard>
  )
}
```

### 2. Mercury Data Table with Contextual Actions

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface MercuryTableProps {
  data: any[]
  columns: any[]
  focusedRow?: number
  onRowFocus?: (index: number) => void
}

export function MercuryTable({ 
  data, 
  columns, 
  focusedRow, 
  onRowFocus 
}: MercuryTableProps) {
  return (
    <MercuryCard intent="review-data" className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className="text-mercury-caption">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={row.id}
              className={`
                cursor-pointer transition-all duration-300
                ${index === focusedRow 
                  ? 'mercury-focused bg-mercury-surface-elevated' 
                  : 'hover:mercury-ambient'
                }
              `}
              onClick={() => onRowFocus?.(index)}
            >
              {columns.map((column) => (
                <TableCell key={column.key} className="text-mercury-body">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </MercuryCard>
  )
}
```

---

## Animation Integration

### Mercury Transition Components

```tsx
import { Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface MercuryTransitionProps {
  show: boolean
  children: React.ReactNode
  type?: 'enter' | 'slide' | 'fade' | 'scale'
}

export function MercuryTransition({ 
  show, 
  children, 
  type = 'enter' 
}: MercuryTransitionProps) {
  const transitions = {
    enter: {
      enter: "transition-all duration-400 ease-mercury",
      enterFrom: "opacity-0 translate-y-5 scale-95",
      enterTo: "opacity-100 translate-y-0 scale-100",
      leave: "transition-all duration-300 ease-mercury",
      leaveFrom: "opacity-100 translate-y-0 scale-100",
      leaveTo: "opacity-0 translate-y-2 scale-95",
    },
    fade: {
      enter: "transition-opacity duration-300",
      enterFrom: "opacity-0",
      enterTo: "opacity-100",
      leave: "transition-opacity duration-200",
      leaveFrom: "opacity-100",
      leaveTo: "opacity-0",
    },
    scale: {
      enter: "transition-transform duration-300 ease-mercury",
      enterFrom: "scale-95",
      enterTo: "scale-100",
      leave: "transition-transform duration-200 ease-mercury",
      leaveFrom: "scale-100",
      leaveTo: "scale-95",
    }
  }

  return (
    <Transition
      as={Fragment}
      show={show}
      {...transitions[type]}
    >
      {children}
    </Transition>
  )
}
```

---

## Practical Examples

### Complete Mercury Dashboard

```tsx
import { useState } from 'react'
import { MercuryCard } from './mercury-card'
import { MercuryCommandPalette } from './mercury-command-palette'
import { useMercuryFocus } from './use-mercury-focus'

export function MercuryDashboard() {
  const [commandOpen, setCommandOpen] = useState(false)
  const { getFocusLevel, setFocus } = useMercuryFocus({ 
    totalItems: 6, 
    defaultFocus: 0 
  })

  // Keyboard shortcut to open command palette
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
    console.log('Executing command:', command)
    setCommandOpen(false)
    // Implement command logic here
  }

  return (
    <div className="min-h-screen bg-mercury-surface-secondary p-6">
      <header className="mb-8">
        <h1 className="text-mercury-hero text-mercury-text-primary mb-2">
          Your Workspace
        </h1>
        <p className="text-mercury-body text-mercury-text-secondary">
          Press ⌘K to open command palette
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Revenue Card - Based on shadcn/ui dashboard example */}
        <MercuryCard
          focusLevel={getFocusLevel(0)}
          intent="review-revenue"
          onClick={() => setFocus(0)}
          className="animate-mercury-enter"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$15,231.89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </MercuryCard>

        {/* Tasks Card */}
        <MercuryCard
          focusLevel={getFocusLevel(1)}
          intent="review-tasks"
          onClick={() => setFocus(1)}
          className="animate-mercury-enter"
          style={{ animationDelay: '100ms' }}
        >
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Badge variant="outline">High</Badge>
                <span className="text-sm">Design system update</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Medium</Badge>
                <span className="text-sm">Code review</span>
              </div>
            </div>
          </CardContent>
        </MercuryCard>

        {/* Calendar Card */}
        <MercuryCard
          focusLevel={getFocusLevel(2)}
          intent="review-calendar"
          onClick={() => setFocus(2)}
          className="animate-mercury-enter"
          style={{ animationDelay: '200ms' }}
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

### Mercury Form with shadcn/ui Components

```tsx
export function MercuryProjectForm() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <MercuryCard focusLevel="focused" intent="create-project">
        <CardHeader>
          <CardTitle className="text-mercury-title">Create New Project</CardTitle>
          <CardDescription className="text-mercury-caption">
            Set up your project with Mercury's intention-driven approach
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input 
                id="name" 
                placeholder="Enter project name"
                className="focus:mercury-focused"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Project Type</Label>
              <Select>
                <SelectTrigger className="focus:mercury-focused">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="web">Web Application</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                  <SelectItem value="design">Design System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the project goals and intentions"
              className="focus:mercury-focused resize-none"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <MercuryButton priority="secondary">Cancel</MercuryButton>
            <MercuryButton priority="primary" intent="create-project">
              Create Project
            </MercuryButton>
          </div>
        </CardContent>
      </MercuryCard>
    </div>
  )
}
```

---

## Best Practices

### 1. **Maintain Component Hierarchy**
- Use Mercury focus levels to guide user attention
- Implement progressive disclosure in forms and complex interfaces
- Always provide clear intention context with `data-intent` attributes

### 2. **Animation Consistency**
- Use Mercury's natural easing curves for all transitions
- Implement staggered animations for lists and grids
- Respect `prefers-reduced-motion` for accessibility

### 3. **Color and Contrast**
- Map shadcn/ui semantic colors to Mercury's intention-driven palette
- Maintain high contrast ratios for accessibility
- Use Mercury's fog effect for ambient information

### 4. **Keyboard Navigation**
- Implement universal shortcuts (⌘K for command palette)
- Ensure all interactive elements are keyboard accessible
- Use Mercury's focus management for complex interfaces

---

## Conclusion

This integration approach transforms [shadcn/ui](https://ui.shadcn.com/)'s excellent component foundation into Mercury's intention-driven, cognitively inclusive interface system. By combining shadcn/ui's accessibility and quality with Mercury's focus management and humane design principles, we create interfaces that truly serve users rather than requiring adaptation.

**Key Benefits:**
- **Reduced Cognitive Load**: Clear focus hierarchy and progressive disclosure
- **Intention-Driven Design**: Components respond to user goals, not technical constraints  
- **Accessibility First**: Built-in support for neurodivergent users
- **Developer Experience**: Familiar shadcn/ui patterns enhanced with Mercury principles
- **Performance**: Optimized animations and efficient state management

**Next Steps:**
1. Implement Mercury components in your existing shadcn/ui project
2. Create intention-specific variants for your use cases
3. Test with neurodivergent users for cognitive accessibility
4. Build a comprehensive Mercury + shadcn/ui component library

---

*"The best design systems enhance human capability without adding complexity."*

**Version**: 1.0  
**Compatible with**: shadcn/ui latest, React 18+, Tailwind CSS 3.4+  
**Last Updated**: December 2024

---

**References:**
- [shadcn/ui Official Documentation](https://ui.shadcn.com/)
- Mercury OS Design Principles (Jason Yuan)
- WCAG 2.1 Accessibility Guidelines 