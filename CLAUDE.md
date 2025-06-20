# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Flowy Cards Mercury Design System

## Project Overview

This is a sophisticated **Mercury OS-inspired design system** built with Next.js 15, React 19, and TypeScript. It implements Jason Yuan's Mercury OS principles focusing on contextual computing and spatial interfaces.

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **UI**: React 19, TypeScript, Tailwind CSS 4
- **Animation**: Framer Motion 12 with Wu Wei (Daoist) easing principles
- **Components**: shadcn/ui with Mercury design enhancements
- **Drag & Drop**: @dnd-kit/core, react-dnd with HTML5Backend

## Design Philosophy

### Dual Design System
1. **Flowy Design**: Glassmorphic cards with generous whitespace and organic curves
2. **Mercury OS**: Enterprise-grade contextual interface with focus management and intention-driven design

### Core Principles
- **Fluid**: Seamless interactions without jarring transitions
- **Focused**: Clear visual hierarchy with selective contrast (Kiri/Fog system)
- **Familiar**: Intuitive patterns that respect user mental models

### Three-Tier Focus System
- **Focused**: Primary attention (scale: 1.05, opacity: 100%, enhanced contrast)
- **Ambient**: Secondary attention (scale: 0.98, opacity: 85%, reduced contrast)
- **Fog**: Background context (scale: 0.96, opacity: 70%, subtle blur)

## Project Structure

### Main Applications
1. **Mercury Contextual Demo** (`/mercury-contextual-demo`) - Spatial computing interface with drag-and-drop
2. **Workflow App** (`/workflow`) - Enterprise meeting intelligence and timeline management
3. **Enterprise Demo** (`/enterprise-demo`) - Business dashboard with Mercury focus management
4. **Mercury Flow Demo** (`/mercury-flow-demo`) - Flow-based interface demonstration
5. **Canvas Workflow** (`/canvas-workflow`) - Playbook-style project canvas

### Core Components
- **FlowyCard** - Base glassmorphic card component with animation states
- **MercuryCard** - Enterprise card with focus level management
- **Timeline** - Interactive timeline with step progression
- **CommandPalette** - Universal command interface
- **DragSystem** - Spatial drag-and-drop with card creation

## Key Features

### Contextual Computing
- **AI-driven context detection** from natural language
- **Progressive disclosure** based on user intent
- **Spatial drag-and-drop** - drag contextual actions to create apartment listing cards
- **Real-time context recognition** from chat conversations

### Enterprise Features
- **Meeting intelligence** with automated insight extraction
- **Timeline-based workflow management**
- **Business metrics visualization** with status indicators
- **WCAG 2.1 AAA accessibility compliance**

### Animation System (Wu Wei Principles)
- **Natural Easing**: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- **GPU Acceleration**: transform-gpu for 60fps performance
- **Staggered Animations**: Coordinated entrance sequences
- **Layout Animations**: Framer Motion layout prop for smooth transitions

## Mercury Design Standards

### Required Component Props
```typescript
interface MercuryComponent {
  intent: string                              // REQUIRED - user's declared intention
  focusLevel?: 'focused' | 'ambient' | 'fog' // Default: 'ambient'
  'data-intent': string                       // Automatic from intent
}
```

### Design Tokens
```css
/* Focus Levels */
--mercury-focused: Enhanced visibility, scale 1.05, ring-2
--mercury-ambient: Normal state, scale 0.98, opacity 85%
--mercury-fog: De-emphasized, scale 0.96, opacity 70%, blur 0.5px

/* Status Colors */
--mercury-healthy: Emerald gradient, accent bar
--mercury-warning: Amber gradient, enhanced visibility
--mercury-critical: Red gradient, priority animation

/* Animation */
--mercury-transition: 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)
```

## Current Implementation Status

### Completed Systems (85%+)
- ✅ Wu Wei animation system with natural easing
- ✅ Mercury design compliance (intent props, focus hierarchy)
- ✅ Core component library (FlowyCard, MercuryCard, Timeline)
- ✅ Workflow app with meeting intelligence
- ✅ Enterprise dashboard with business metrics
- ✅ Drag-and-drop spatial interface

### Contextual Computing Progress (60%)
- ✅ Basic context detection from chat messages
- ✅ Progressive disclosure with popup menus
- ✅ Drag-to-create card functionality
- ✅ Spatial positioning with collision detection
- ⚠️ Limited to hardcoded scenarios ("look in Mountain View")
- ⚠️ No real-time NLP engine
- ⚠️ Static content generation

### Performance Achievements
- ✅ 60fps animations with GPU acceleration
- ✅ Perfect drag positioning (100/100 user rating)
- ✅ Smooth spatial interactions
- ✅ Transform-based movement system

## Development Commands

### Basic Commands
```bash
# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### Accessing Demos
- Main apps at `http://localhost:3000/[app-name]`:
  - `/workflow` - Timeline workflow management (most sophisticated)
  - `/mercury-contextual-demo` - Spatial computing with drag-and-drop
  - `/enterprise-demo` - Business dashboard
  - `/mercury-flow-demo` - Flow-based interface
  - `/canvas-workflow` - Playbook-style canvas

### Mercury Component Development
Every React component MUST follow Mercury compliance rules from `.cursorrules`:

```typescript
interface ComponentProps {
  intent: string  // REQUIRED - no exceptions
  focusLevel?: 'focused' | 'ambient' | 'fog'  // Default: 'ambient'
}

export function Component({ intent, focusLevel = 'ambient', ...props }: ComponentProps) {
  return (
    <div 
      data-intent={intent}  // REQUIRED
      className={cn(
        'mercury-module',
        getMercuryFocusClasses(focusLevel)
      )}
      role="region"
      aria-label={`${intent} component`}
    >
      {/* Component content */}
    </div>
  )
}
```

### Required Compliance (Non-negotiable)
- Component has `intent` prop and `data-intent` attribute
- Supports three-tier focus system (focused/ambient/fog)
- WCAG 2.1 AAA accessibility compliance
- Natural animation easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- GPU acceleration with `transform-gpu`
- Reference `/docs/mercury-design-system-standards.md`

## Documentation Structure

### Design System Docs (`/docs`)
- `mercury-design-system-standards.md` - Complete specification
- `mercury-compliance-guide.md` - Development compliance framework
- `mercury-shadcn-integration-guide.md` - Component integration
- `mercury-tailwind-guide.md` - Animation and styling system
- `liquid-glass-design.md` - Visual design principles

### Implementation Analysis
- `mercury-current-state-analysis.md` - System status assessment
- `mercury-action-plan.md` - Development roadmap
- `interaction-summary.md` - Complete development journey

## Architecture Overview

### Application Structure
This is a **monorepo containing 5 distinct demo applications** showcasing Mercury OS design principles:

1. **Workflow App** (`/app/workflow/`) - **Most sophisticated implementation**
   - Enterprise meeting intelligence with timeline management
   - Main components: `WorkflowPageWithTimeline.tsx`, `MainCard.tsx`, `EditableCard.tsx`, `InsightsPanel.tsx`
   - Features: AI insight extraction, demo automation, focus management, rich editing
   - Data source: `lib/contextMockData.ts` with realistic enterprise meeting data

2. **Mercury Contextual Demo** (`/app/mercury-contextual-demo/`)
   - Spatial computing interface with full-screen drag-and-drop
   - Chat module with contextual action detection → apartment listing cards
   - Advanced coordinate system with pixel-perfect positioning

3. **Enterprise Demo** (`/app/enterprise-demo/`)
   - Business dashboard with KPI visualization and Mercury focus hierarchy

4. **Mercury Flow Demo** (`/app/mercury-flow-demo/`)
   - Flow-based interface demonstration with progressive disclosure

5. **Canvas Workflow** (`/app/canvas-workflow/`)
   - Playbook-style project canvas with file upload and timeline integration

### Core Design System Architecture
- **Dual Philosophy**: Flowy (glassmorphic) + Mercury OS (enterprise contextual computing)
- **Three-Tier Focus System**: focused/ambient/fog with GPU-accelerated visual differentiation
- **Animation System**: Wu Wei (Daoist) principles with natural easing curves
- **Component Library**: shadcn/ui base components enhanced with Mercury compliance
- **State Management**: React hooks + Context API for timeline/workflow systems
- **Drag System**: react-dnd + @dnd-kit for spatial interactions

## Accessibility & Inclusion

### Cognitive Accessibility
- **Target Audience**: Users with ADHD, ASD, and cognitive processing differences
- **Reduced Cognitive Load**: Maximum 3 primary actions visible at once
- **Executive Function Support**: Persistent context, undo/redo, auto-save
- **Clear Progress Indicators**: Visual feedback for all user actions

### Technical Accessibility
- **WCAG 2.1 AAA**: 7:1 contrast ratio, comprehensive screen reader support
- **Keyboard Navigation**: Full keyboard support with logical tab order
- **Motion Preferences**: Respects prefers-reduced-motion
- **Focus Management**: Clear visual focus indicators

## Performance Standards

### Targets
- **First Paint**: < 1.2s
- **Interaction Ready**: < 2.0s
- **Animation Performance**: 60fps
- **Memory Usage**: < 50MB
- **Bundle Size**: < 150KB parsed

### Optimizations
- **GPU Acceleration**: transform-gpu for all animations
- **Lazy Loading**: Off-screen content loads on demand
- **Efficient Animations**: Only transform and opacity properties
- **Memory Management**: Intersection observer for blur effects

## Development Context

### Recent Achievements
1. **Perfect Drag Positioning**: Solved coordinate system conflicts for pixel-accurate card placement
2. **Performance Optimization**: Achieved smooth 60fps dragging through GPU acceleration
3. **Mercury Compliance**: Full implementation of focus hierarchy and design standards
4. **Enterprise Features**: Complete workflow app with meeting intelligence

### Node.js Requirements & Setup
- **Required Version**: >= 18.18.0 || >= 20.0.0 (Next.js 15 requirement)
- **Recommended**: Node.js v20.19.2 via Homebrew
- **PATH Configuration**: `/opt/homebrew/opt/node@20/bin:$PATH`

### Critical Implementation Patterns

#### Mercury Component Requirements (Enforced by .cursorrules)
```typescript
// EVERY component must follow this pattern
interface MercuryComponentProps {
  intent: string  // REQUIRED - no exceptions
  focusLevel?: 'focused' | 'ambient' | 'fog'
  children: React.ReactNode
}

// Example: components/mercury/mercury-dashboard-card.tsx (gold standard)
```

#### Drag-and-Drop Positioning System
- **Coordinate System**: Direct viewport coordinates (`clientOffset.x`, `clientOffset.y`)
- **Card Centering**: Offset by half card dimensions to center on drop point
- **Transform-based Movement**: Pure Framer Motion `x`/`y` props (no CSS positioning)
- **Performance**: GPU acceleration + simplified content during drag

#### Focus Hierarchy Rules
- **One Focused Element**: Only one component can be "focused" at a time
- **Visual States**: scale, opacity, blur differentiation
- **Status Override**: Warning/critical states override fog opacity for visibility

## Future Roadmap

### Phase 1: Enhanced Intelligence
- [ ] Advanced NLP context detection engine
- [ ] Real-time content generation API
- [ ] Personalization and user profiles
- [ ] Multi-scenario context recognition

### Phase 2: Spatial Computing
- [ ] Advanced collision detection
- [ ] Auto-layout algorithms
- [ ] Connection visualization
- [ ] Multi-canvas workspaces

### Phase 3: Enterprise Features
- [ ] Real meeting transcription integration
- [ ] Business intelligence dashboards
- [ ] Team collaboration features
- [ ] Advanced reporting and analytics

## Quality Assurance

### Success Metrics
- **Context Recognition Accuracy**: 90%+
- **User Task Completion**: 95%+
- **Animation Performance**: 60fps
- **Accessibility Score**: 95%+ (Lighthouse)
- **Mercury Compliance**: 100%

This project represents one of the most advanced open-source implementations of contextual computing interfaces, demonstrating enterprise-grade design system development with deep attention to cognitive accessibility and neurodivergent user needs.