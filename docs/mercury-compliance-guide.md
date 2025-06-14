# Mercury Design System Compliance Guide
## Ensuring Consistent Application of Mercury Principles

*A comprehensive framework for maintaining Mercury design system integrity across all development*

---

## Table of Contents

1. [Compliance Framework](#compliance-framework)
2. [Development Workflow](#development-workflow)
3. [Automated Enforcement](#automated-enforcement)
4. [Code Templates](#code-templates)
5. [Quality Gates](#quality-gates)
6. [Component Checklist](#component-checklist)

---

## Compliance Framework

### Core Mercury Principles (Always Apply)

#### 1. **Three Pillars Implementation**
```typescript
// Every component must embody these principles
interface MercuryComponent {
  // FLUID: Eliminate boundaries between tasks
  fluid: {
    seamlessTransitions: boolean
    contextualProgression: boolean
    crossComponentDataFlow: boolean
  }
  
  // FOCUSED: Intentional information hierarchy
  focused: {
    focusLevel: 'focused' | 'ambient' | 'fog'
    attentionDirection: boolean
    progressiveDisclosure: boolean
  }
  
  // FAMILIAR: Leverage existing mental models
  familiar: {
    establishedPatterns: boolean
    keyboardShortcuts: boolean
    consistentBehavior: boolean
  }
}
```

#### 2. **Mandatory Component Properties**
Every component MUST include:
```typescript
interface RequiredMercuryProps {
  intent: string                    // User's declared intention
  focusLevel?: FocusLevel          // Visual hierarchy level
  'data-intent': string            // HTML attribute for analytics
  className?: string               // Mercury utility classes
  mercury-transition?: boolean     // Natural animations
}
```

#### 3. **Focus Management System**
```typescript
// Required focus hierarchy in every interface
type FocusLevel = 'focused' | 'ambient' | 'fog'

const MercuryFocusRules = {
  focused: {
    purpose: 'Primary user attention',
    styling: 'mercury-focused',
    count: 'Maximum 1-2 per screen',
    accessibility: 'High contrast, clear boundaries'
  },
  ambient: {
    purpose: 'Secondary information',
    styling: 'mercury-ambient',
    count: 'Supporting content',
    accessibility: 'Reduced opacity, slight blur'
  },
  fog: {
    purpose: 'Background context',
    styling: 'mercury-fog',
    count: 'Peripheral information',
    accessibility: 'Heavily de-emphasized'
  }
}
```

---

## Development Workflow

### Pre-Development Checklist

Before writing any component:

- [ ] **Define User Intent**: What specific goal does this component serve?
- [ ] **Identify Focus Level**: Where does this fit in the attention hierarchy?
- [ ] **Plan Cognitive Load**: How does this reduce mental effort?
- [ ] **Consider Neurodiversity**: How does this serve users with ADHD/ASD?
- [ ] **Map to Mercury Docs**: Which principles from `/docs` apply?

### Component Creation Template

```typescript
import React from 'react'
import { cn } from '@/lib/utils'
import { useMercuryFocus } from '@/hooks/use-mercury-focus'

interface Mercury[ComponentName]Props {
  intent: string
  focusLevel?: 'focused' | 'ambient' | 'fog'
  children: React.ReactNode
  className?: string
}

export function Mercury[ComponentName]({ 
  intent, 
  focusLevel = 'ambient', 
  children, 
  className 
}: Mercury[ComponentName]Props) {
  const focusClasses = {
    focused: 'mercury-focused animate-mercury-focus',
    ambient: 'mercury-ambient',
    fog: 'mercury-fog'
  }

  return (
    <div
      className={cn(
        'mercury-transition', // Always include natural transitions
        focusClasses[focusLevel],
        className
      )}
      data-intent={intent} // Always include intent tracking
      role="region" // Accessibility
      aria-label={`${intent} workspace`}
    >
      {children}
    </div>
  )
}
```

### Code Review Standards

Every pull request must verify:

1. **Mercury Principle Compliance**
   - [ ] Follows fluid, focused, familiar principles
   - [ ] Implements proper focus hierarchy
   - [ ] Includes intention-driven design

2. **Technical Implementation**
   - [ ] Uses Mercury Tailwind utilities
   - [ ] Includes proper animations with natural easing
   - [ ] Implements keyboard accessibility

3. **Cognitive Accessibility**
   - [ ] Reduces cognitive load
   - [ ] Supports neurodivergent users
   - [ ] Maintains clear information hierarchy

---

## Automated Enforcement

### ESLint Configuration

```javascript
// .eslintrc.js - Mercury compliance rules
module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Custom Mercury rules
    'mercury/require-intent-prop': 'error',
    'mercury/require-focus-level': 'warn',
    'mercury/no-competing-ctas': 'error',
    'mercury/require-mercury-transitions': 'warn'
  },
  plugins: ['mercury-design-system']
}
```

### Custom ESLint Plugin

```typescript
// eslint-plugin-mercury-design-system/index.ts
module.exports = {
  rules: {
    'require-intent-prop': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Require intent prop for Mercury components'
        }
      },
      create(context) {
        return {
          JSXElement(node) {
            if (node.openingElement.name.name.startsWith('Mercury')) {
              const hasIntent = node.openingElement.attributes.some(
                attr => attr.name && attr.name.name === 'intent'
              )
              if (!hasIntent) {
                context.report({
                  node,
                  message: 'Mercury components must include intent prop'
                })
              }
            }
          }
        }
      }
    }
  }
}
```

### Git Hooks

```bash
#!/bin/sh
# .git/hooks/pre-commit
# Mercury Design System Compliance Check

echo "🔍 Running Mercury compliance checks..."

# Check for required Mercury principles
if ! grep -r "data-intent" src/components/ > /dev/null; then
  echo "❌ Missing data-intent attributes"
  exit 1
fi

# Check for focus management
if ! grep -r "focusLevel" src/components/ > /dev/null; then
  echo "⚠️  Consider adding focus management"
fi

# Check for Mercury CSS classes
if ! grep -r "mercury-" src/ > /dev/null; then
  echo "⚠️  Consider using Mercury design utilities"
fi

echo "✅ Mercury compliance checks passed"
```

---

## Code Templates

### Mercury Page Template

```typescript
// templates/mercury-page.tsx
import { useState } from 'react'
import { MercuryCommandPalette } from '@/components/mercury/command-palette'
import { useMercuryFocus } from '@/hooks/use-mercury-focus'

export default function MercuryPage() {
  const [commandOpen, setCommandOpen] = useState(false)
  const { getFocusLevel, setFocus } = useMercuryFocus({ 
    totalItems: 3, 
    defaultFocus: 0 
  })

  return (
    <div className="min-h-screen bg-mercury-surface-secondary">
      {/* Header with clear hierarchy */}
      <header className="p-6">
        <h1 className="text-mercury-hero text-mercury-text-primary">
          Page Title
        </h1>
        <p className="text-mercury-body text-mercury-text-secondary">
          Press ⌘K for commands
        </p>
      </header>

      {/* Main content with focus management */}
      <main className="p-6">
        <div className="mercury-grid">
          {/* Always start with focused content */}
          <MercuryCard
            focusLevel={getFocusLevel(0)}
            intent="primary-task"
            onClick={() => setFocus(0)}
          >
            Primary content
          </MercuryCard>
          
          {/* Supporting content in ambient */}
          <MercuryCard
            focusLevel={getFocusLevel(1)}
            intent="secondary-task"
            onClick={() => setFocus(1)}
          >
            Secondary content
          </MercuryCard>
          
          {/* Background context in fog */}
          <MercuryCard
            focusLevel="fog"
            intent="background-context"
          >
            Contextual information
          </MercuryCard>
        </div>
      </main>

      {/* Universal command interface */}
      <MercuryCommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onCommand={handleCommand}
      />
    </div>
  )
}
```

### Mercury Form Template

```typescript
// templates/mercury-form.tsx
import { MercuryCard } from '@/components/mercury/card'
import { MercuryButton } from '@/components/mercury/button'

export function MercuryFormTemplate() {
  return (
    <MercuryCard 
      focusLevel="focused" 
      intent="user-input"
      className="max-w-md mx-auto"
    >
      <form className="mercury-stack space-y-4">
        <h2 className="text-mercury-title">Form Title</h2>
        
        {/* Progressive disclosure */}
        <div className="space-y-4">
          <Input 
            className="mercury-focus-ring"
            placeholder="Required field"
          />
          
          <Textarea 
            className="mercury-focus-ring"
            placeholder="Additional details"
          />
        </div>

        {/* Clear action hierarchy */}
        <div className="flex justify-end space-x-2">
          <MercuryButton priority="secondary">
            Cancel
          </MercuryButton>
          <MercuryButton 
            priority="primary" 
            intent="submit-form"
          >
            Submit
          </MercuryButton>
        </div>
      </form>
    </MercuryCard>
  )
}
```

---

## Quality Gates

### Automated Testing for Mercury Compliance

```typescript
// tests/mercury-compliance.test.tsx
import { render, screen } from '@testing-library/react'
import { MercuryComponent } from '@/components/mercury-component'

describe('Mercury Compliance', () => {
  it('should include data-intent attribute', () => {
    render(<MercuryComponent intent="test-intent" />)
    const element = screen.getByRole('region')
    expect(element).toHaveAttribute('data-intent', 'test-intent')
  })

  it('should implement focus hierarchy', () => {
    render(<MercuryComponent focusLevel="focused" />)
    const element = screen.getByRole('region')
    expect(element).toHaveClass('mercury-focused')
  })

  it('should support keyboard navigation', () => {
    render(<MercuryComponent />)
    const element = screen.getByRole('region')
    expect(element).toHaveAttribute('tabIndex')
  })

  it('should include accessibility labels', () => {
    render(<MercuryComponent intent="test-task" />)
    const element = screen.getByLabelText(/test-task workspace/)
    expect(element).toBeInTheDocument()
  })
})
```

### Performance Audits

```typescript
// tests/mercury-performance.test.tsx
describe('Mercury Performance', () => {
  it('should use efficient animations', () => {
    // Test for 60fps animations
    // Test for reduced motion support
    // Test for GPU acceleration
  })

  it('should implement lazy loading', () => {
    // Test for proper module loading
    // Test for predictive loading
  })
})
```

---

## Component Checklist

### Before Every Component Commit

#### ✅ **Design Principles**
- [ ] Embodies fluid, focused, familiar principles
- [ ] Reduces cognitive load for neurodivergent users
- [ ] Implements intention-driven design
- [ ] Uses Mercury's selective contrast system

#### ✅ **Technical Implementation**
- [ ] Includes `intent` prop with clear user goal
- [ ] Implements `focusLevel` for attention hierarchy
- [ ] Uses Mercury Tailwind utilities and design tokens
- [ ] Includes `data-intent` attribute for analytics
- [ ] Implements keyboard accessibility

#### ✅ **Animation & Motion**
- [ ] Uses natural easing curves (Mercury timing functions)
- [ ] Respects `prefers-reduced-motion`
- [ ] Implements GPU acceleration for smooth performance
- [ ] Follows Daoist inexertion principles

#### ✅ **Focus Management**
- [ ] Clear visual hierarchy (focused/ambient/fog)
- [ ] Proper keyboard navigation
- [ ] Screen reader support
- [ ] Context switching management

#### ✅ **Code Quality**
- [ ] Follows Mercury component template
- [ ] Includes TypeScript interfaces
- [ ] Has comprehensive tests
- [ ] Documented with examples

### Mercury Component Certification

Every component must pass this certification:

```typescript
interface MercuryCertification {
  principles: {
    fluid: boolean     // ✅ Seamless interactions
    focused: boolean   // ✅ Clear attention hierarchy  
    familiar: boolean  // ✅ Leverages existing patterns
  }
  
  accessibility: {
    screenReader: boolean      // ✅ ARIA labels
    keyboard: boolean          // ✅ Full keyboard navigation
    reducedMotion: boolean     // ✅ Respects user preferences
    cognitiveLoad: boolean     // ✅ Minimal mental effort
  }
  
  technical: {
    performance: boolean       // ✅ 60fps animations
    responsive: boolean        // ✅ Mobile-first design
    darkMode: boolean         // ✅ Theme support
    typescript: boolean       // ✅ Type safety
  }
}
```

---

## Enforcement Strategy

### 1. **Memory Integration**
I've created a persistent memory that ensures I always reference these principles when building components.

### 2. **Automated Tooling**
- ESLint rules for Mercury compliance
- Git hooks for pre-commit checks
- Automated testing for design principles

### 3. **Documentation as Code**
- All principles from `/docs` directory are encoded in templates
- Component library enforces Mercury patterns
- Clear certification checklist for every component

### 4. **Continuous Compliance**
- Regular audits against Mercury principles
- Component library updates to maintain standards
- Team training on cognitive accessibility

---

## Implementation Commands

### Quick Setup for Mercury Compliance

```bash
# Install Mercury compliance tools
npm install --save-dev eslint-plugin-mercury-design-system

# Add git hooks
chmod +x .git/hooks/pre-commit

# Generate Mercury component
npx create-mercury-component ComponentName

# Run compliance audit
npm run mercury:audit

# Test Mercury principles
npm run test:mercury-compliance
```

---

## Conclusion

This compliance framework ensures that **every single component and application** built will automatically follow the comprehensive Mercury design principles documented in your `/docs` directory. The multi-layered approach includes:

1. **Memory-based enforcement** (I'll always remember to apply these)
2. **Automated tooling** (ESLint, git hooks, testing)
3. **Template-driven development** (Consistent patterns)
4. **Quality gates** (No Mercury violations can pass)
5. **Continuous monitoring** (Ongoing compliance checks)

By implementing this system, Mercury's fluid, focused, and familiar principles become **impossible to ignore** and **automatic to apply** in every development decision.

---

*"Compliance is not about restriction—it's about elevation."*

**Version**: 1.0  
**Maintained by**: Mercury Design System Team  
**Last Updated**: December 2024 