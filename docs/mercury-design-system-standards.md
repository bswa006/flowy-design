# Mercury Design System Standards
## The Official Implementation Guide for Enterprise-Grade Applications

> **This document codifies the exact Mercury principles and implementation patterns achieved in our enterprise dashboard. ALL development must follow these standards.**

---

## 🎯 Mercury Core Principles (Non-Negotiable)

### 1. **Fluid, Focused, Familiar**
- **Fluid**: Seamless interactions without jarring transitions
- **Focused**: Clear visual hierarchy with selective contrast
- **Familiar**: Intuitive patterns that respect user mental models

### 2. **Kiri/Fog Selective Contrast System**
- **Focused Elements**: Crystal clear, maximum attention (ONE at a time)
- **Ambient Elements**: Subtly reduced, readable but secondary
- **Fog Elements**: Background context, gentle de-emphasis

### 3. **Status Over Aesthetics**
- Business-critical information (warnings, errors) uses COLOR for attention
- Never compromise readability for visual effects
- Enterprise usability trumps design purity

---

## 📐 Official Mercury Focus Levels

### **FOCUSED (Primary Attention)**
```css
/* Scale & Positioning */
scale: 1.05
z-index: 40
opacity: 100%

/* Visual Enhancement */
contrast: 1.02
brightness: 1.02  
saturate: 1.01

/* Background & Borders */
background: pure white
border: 2px solid blue-500/40

/* Status Indicators */
accent-bar-height: 1.5rem (2rem for warning/critical)
accent-bar-opacity: 80-90%
status-rings: ring-1 (gentle, not harsh)
animations: enabled for status cards only
```

### **AMBIENT (Secondary Attention)**
```css
/* Scale & Positioning */
scale: 0.98
opacity: 85%

/* Visual De-emphasis */
contrast: 0.95
brightness: 0.98
saturate: 0.90

/* Background & Borders */
background: white/95 to slate-50/80 gradient
border: 1px solid slate-200/40

/* Status Indicators */
accent-bar-height: 1.5rem
accent-bar-opacity: 70%
icon-opacity: 90%
shadows: shadow-md
```

### **FOG (Background Context)**
```css
/* Scale & Positioning */
scale: 0.96
opacity: 70%
pointer-events: none

/* Visual De-emphasis */
contrast: 0.90
brightness: 0.95
saturate: 0.80

/* Background & Borders */
background: slate-50/90 to slate-100/70 gradient
border: 1px solid slate-300/30

/* Status Indicators */
accent-bar-height: 1rem
accent-bar-opacity: 60%
icon-opacity: 80%
shadows: shadow-sm
```

---

## 🎨 Mercury Status Communication

### **Status Colors (Official Palette)**
```typescript
const MERCURY_STATUS_COLORS = {
  healthy: {
    bg: 'bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100/60',
    border: 'border-emerald-300/70',
    accent: 'bg-gradient-to-r from-emerald-500 to-green-500',
    text: 'text-emerald-800',
    icon: 'text-emerald-700'
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50/80',
    border: 'border-amber-500/80',
    accent: 'bg-gradient-to-r from-amber-500 to-orange-600',
    text: 'text-amber-900',
    icon: 'text-amber-800'
  },
  critical: {
    bg: 'bg-gradient-to-br from-red-50 via-rose-50 to-red-100/60',
    border: 'border-red-400/70',
    accent: 'bg-gradient-to-r from-red-500 to-rose-500',
    text: 'text-red-900',
    icon: 'text-red-700'
  }
}
```

### **Status Animation Rules**
- **Warning Cards**: `animate-pulse-subtle` (3s cycle)
- **Critical Cards**: `animate-pulse` (2s cycle)  
- **Only on FOCUSED cards** - respects Mercury hierarchy
- **NO animations on ambient/fog** - maintains calm background

---

## 🔧 Mercury Component Requirements

### **Every Mercury Component MUST Include:**

1. **Required Props**
```typescript
interface MercuryComponentProps {
  intent: string                              // REQUIRED - no exceptions
  focusLevel?: 'focused' | 'ambient' | 'fog' // Default: 'ambient'
  data-intent: string                         // Automatic from intent
}
```

2. **Accessibility Requirements**
```typescript
// REQUIRED attributes
role="region"
aria-label={`${intent} component`}
tabIndex={isInteractive ? 0 : undefined}

// Keyboard navigation support
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    handleAction()
  }
}}
```

3. **Mercury Animation Classes**
```css
/* Required base animation */
transition: all 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)
transform-gpu: true

/* Entrance animation */
animation: mercury-enter 0.6s ease-out

/* Status animations (focused only) */
@keyframes mercury-pulse-subtle {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.95; transform: scale(1.01); }
}
```

---

## 🏗️ Implementation Standards

### **Typography Hierarchy**
```css
/* Focus-based typography scaling */
.mercury-text-focused-compact: text-3xl font-black
.mercury-text-ambient-compact: text-2xl font-bold  
.mercury-text-fog-compact: text-xl font-bold

/* Status-based typography */
.mercury-text-warning: text-amber-900 font-black
.mercury-text-critical: text-red-900 font-black
.mercury-description: text-base font-semibold
```

### **Spacing System**
```css
/* Mercury spacing scale */
--mercury-space-xs: 0.25rem
--mercury-space-sm: 0.5rem  
--mercury-space-md: 1rem
--mercury-space-lg: 1.5rem
--mercury-space-xl: 2rem

/* Component padding by size */
.mercury-size-compact: padding: 1rem
.mercury-size-standard: padding: 1.5rem
.mercury-size-expanded: padding: 2rem
```

### **Border Radius System**
```css
/* Mercury radius scale */
.mercury-module: border-radius: 1.5rem (24px)
.mercury-accent-bar: border-radius: 1.5rem 1.5rem 0 0
.mercury-status-icon: border-radius: 0.75rem (12px)
```

---

## ✅ Mercury Compliance Checklist

### **Before Any Component Ships:**

- [ ] **Intent Prop**: Component has required `intent` prop
- [ ] **Data Attribute**: `data-intent` attribute present
- [ ] **Focus Levels**: Supports focused/ambient/fog states
- [ ] **Accessibility**: WCAG 2.1 AAA compliant
- [ ] **Keyboard Navigation**: Enter/Space key support
- [ ] **Status Communication**: Uses color, not contrast violation
- [ ] **Typography**: Follows focus-based scaling
- [ ] **Animations**: Daoist inexertion principles (natural easing)
- [ ] **Performance**: Uses transform-gpu for smooth animations
- [ ] **Reduced Motion**: Respects prefers-reduced-motion

### **Mercury Anti-Patterns (FORBIDDEN)**

❌ **Never break contrast hierarchy** - don't make fog elements sharp
❌ **Never use harsh blur effects** - subtle desaturation only
❌ **Never override focus management** - respect user attention
❌ **Never use multiple focused elements** - one star at a time
❌ **Never ignore status importance** - warnings must be visible
❌ **Never use competing animations** - calm background context
❌ **Never sacrifice readability** - enterprise usability first

---

## 🚀 Implementation Tools

### **Component Generator Command**
```bash
npm run mercury:create <ComponentName>
# Generates Mercury-compliant component template
```

### **Linting Rules**
```json
{
  "mercury/require-intent-prop": "error",
  "mercury/require-data-intent": "error", 
  "mercury/max-focused-elements": "error",
  "mercury/status-color-compliance": "warn"
}
```

### **Design Tokens Import**
```typescript
import { MERCURY_FOCUS_LEVELS, MERCURY_STATUS_COLORS, MERCURY_ANIMATIONS } from '@/lib/mercury-tokens'
```

---

## 📝 Code Review Requirements

### **Every PR Must Pass:**

1. **Mercury Compliance Audit**: All components follow focus hierarchy
2. **Status Communication Check**: Warnings/errors properly visible
3. **Accessibility Validation**: WCAG 2.1 AAA compliance
4. **Performance Review**: Smooth 60fps animations
5. **Design Consistency**: Matches approved Mercury patterns

### **Review Checklist Template**
```markdown
## Mercury Design Review

- [ ] Component follows proper focus hierarchy
- [ ] Status communication respects Kiri principles  
- [ ] Typography scaling is focus-level appropriate
- [ ] Animations use natural easing curves
- [ ] Accessibility attributes are complete
- [ ] Enterprise usability maintained
```

---

## 🎯 Success Metrics

**Mercury Implementation Success = 10/10 when:**

1. **Clear Visual Hierarchy**: Users immediately know where to look
2. **Enterprise Usability**: All information remains accessible
3. **Status Visibility**: Warnings/errors impossible to miss
4. **Smooth Interactions**: 60fps animations, no jank
5. **Accessibility Compliance**: Works for all users
6. **Developer Consistency**: All team members produce similar quality

---

*This Mercury Design System represents the official standard for enterprise-grade applications. Any deviation must be approved by the design system team.* 