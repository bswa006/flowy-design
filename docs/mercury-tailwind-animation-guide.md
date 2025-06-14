# Mercury Design System
## Tailwind CSS & Animation Implementation Guide

*Implementing fluid, focused, and humane design principles with Tailwind CSS*

---

## Table of Contents

1. [Tailwind Configuration](#tailwind-configuration)
2. [Design Tokens & CSS Variables](#design-tokens--css-variables)
3. [Typography System](#typography-system)
4. [Color & Contrast System](#color--contrast-system)
5. [Spacing & Layout](#spacing--layout)
6. [Animation Principles](#animation-principles)
7. [Component Utilities](#component-utilities)
8. [Focus Management](#focus-management)
9. [Responsive Design](#responsive-design)
10. [Implementation Examples](#implementation-examples)

---

## Tailwind Configuration

### Enhanced tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Mercury Design System Extensions
      fontFamily: {
        'mercury': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Extreme contrast scale inspired by Mercury
        'mercury-hero': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1' }],
        'mercury-title': ['clamp(1.5rem, 3vw, 2rem)', { lineHeight: '1.2' }],
        'mercury-body': ['1rem', { lineHeight: '1.6' }],
        'mercury-caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      colors: {
        // Mercury color system
        mercury: {
          // Primary colors
          primary: 'hsl(var(--mercury-primary))',
          secondary: 'hsl(var(--mercury-secondary))',
          accent: 'hsl(var(--mercury-accent))',
          
          // Focus states
          focused: 'hsl(var(--mercury-focused))',
          ambient: 'hsl(var(--mercury-ambient))',
          fog: 'hsl(var(--mercury-fog))',
          
          // Surface colors
          surface: {
            primary: 'hsl(var(--mercury-surface-primary))',
            secondary: 'hsl(var(--mercury-surface-secondary))',
            elevated: 'hsl(var(--mercury-surface-elevated))',
          },
          
          // Text colors
          text: {
            primary: 'hsl(var(--mercury-text-primary))',
            secondary: 'hsl(var(--mercury-text-secondary))',
            muted: 'hsl(var(--mercury-text-muted))',
            inverse: 'hsl(var(--mercury-text-inverse))',
          }
        }
      },
      spacing: {
        // Mercury spatial system
        'mercury-xs': 'var(--mercury-space-xs)',
        'mercury-sm': 'var(--mercury-space-sm)',
        'mercury-md': 'var(--mercury-space-md)',
        'mercury-lg': 'var(--mercury-space-lg)',
        'mercury-xl': 'var(--mercury-space-xl)',
        'mercury-2xl': 'var(--mercury-space-2xl)',
      },
      borderRadius: {
        'mercury': 'var(--mercury-radius)',
        'mercury-sm': 'var(--mercury-radius-sm)',
        'mercury-lg': 'var(--mercury-radius-lg)',
      },
      backdropBlur: {
        'mercury': '20px',
        'mercury-sm': '10px',
        'mercury-lg': '40px',
      },
      animation: {
        // Mercury animation system
        'mercury-enter': 'mercury-enter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'mercury-exit': 'mercury-exit 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'mercury-scale': 'mercury-scale 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        'mercury-slide-up': 'mercury-slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'mercury-slide-down': 'mercury-slide-down 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'mercury-fade': 'mercury-fade 0.3s ease-out',
        'mercury-blur-in': 'mercury-blur-in 0.5s ease-out',
        'mercury-float': 'mercury-float 6s ease-in-out infinite',
      },
      keyframes: {
        'mercury-enter': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(20px) scale(0.95)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
        },
        'mercury-exit': {
          '0%': { 
            opacity: '1', 
            transform: 'translateY(0) scale(1)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateY(-20px) scale(0.95)' 
          },
        },
        'mercury-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
        'mercury-slide-up': {
          '0%': { 
            opacity: '0', 
            transform: 'translateY(100%)' 
          },
          '100%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
        },
        'mercury-slide-down': {
          '0%': { 
            opacity: '1', 
            transform: 'translateY(0)' 
          },
          '100%': { 
            opacity: '0', 
            transform: 'translateY(100%)' 
          },
        },
        'mercury-fade': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'mercury-blur-in': {
          '0%': { 
            opacity: '0', 
            filter: 'blur(10px)' 
          },
          '100%': { 
            opacity: '1', 
            filter: 'blur(0px)' 
          },
        },
        'mercury-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      transitionTimingFunction: {
        'mercury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'mercury-bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'mercury-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        'mercury-fast': '150ms',
        'mercury-normal': '300ms',
        'mercury-slow': '500ms',
      },
      boxShadow: {
        'mercury-focused': 'var(--mercury-shadow-focused)',
        'mercury-ambient': 'var(--mercury-shadow-ambient)',
        'mercury-elevated': 'var(--mercury-shadow-elevated)',
        'mercury-fog': 'var(--mercury-shadow-fog)',
      },
    },
  },
  plugins: [
    // Custom Mercury plugins
    function({ addUtilities, addComponents, theme }) {
      // Add Mercury-specific utilities
      addUtilities({
        '.mercury-fog-effect': {
          'backdrop-filter': 'blur(20px)',
          'background': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        },
        '.mercury-glass': {
          'backdrop-filter': 'blur(10px) saturate(180%)',
          'background': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.mercury-surface-blur': {
          'backdrop-filter': 'blur(40px)',
          'background': 'rgba(0, 0, 0, 0.05)',
        },
      });

      // Add Mercury component classes
      addComponents({
        '.mercury-module': {
          'background': theme('colors.mercury.surface.primary'),
          'border-radius': theme('borderRadius.mercury'),
          'padding': theme('spacing.mercury-md'),
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'box-shadow': theme('boxShadow.mercury-ambient'),
        },
        '.mercury-module-focused': {
          'box-shadow': theme('boxShadow.mercury-focused'),
          'transform': 'scale(1.01)',
          'z-index': '10',
        },
        '.mercury-module-ambient': {
          'opacity': '0.7',
          'filter': 'blur(0.5px)',
          'transform': 'scale(0.98)',
        },
        '.mercury-command-palette': {
          'backdrop-filter': 'blur(20px)',
          'background': 'rgba(255, 255, 255, 0.95)',
          'border': '1px solid rgba(0, 0, 0, 0.1)',
          'border-radius': theme('borderRadius.mercury-lg'),
          'box-shadow': '0 20px 40px rgba(0, 0, 0, 0.1)',
        },
      });
    },
  ],
}
```

---

## Design Tokens & CSS Variables

### CSS Custom Properties

```css
/* Mercury Design System Variables */
:root {
  /* Primary Colors */
  --mercury-primary: 220 100% 50%;
  --mercury-secondary: 210 40% 60%;
  --mercury-accent: 280 100% 60%;
  
  /* Focus States */
  --mercury-focused: 220 100% 50%;
  --mercury-ambient: 210 20% 70%;
  --mercury-fog: 210 10% 90%;
  
  /* Surface Colors */
  --mercury-surface-primary: 0 0% 100%;
  --mercury-surface-secondary: 210 20% 98%;
  --mercury-surface-elevated: 0 0% 100%;
  
  /* Text Colors */
  --mercury-text-primary: 220 20% 10%;
  --mercury-text-secondary: 220 10% 40%;
  --mercury-text-muted: 220 5% 60%;
  --mercury-text-inverse: 0 0% 100%;
  
  /* Spacing Scale */
  --mercury-space-xs: 0.25rem;    /* 4px */
  --mercury-space-sm: 0.5rem;     /* 8px */
  --mercury-space-md: 1rem;       /* 16px */
  --mercury-space-lg: 1.5rem;     /* 24px */
  --mercury-space-xl: 2rem;       /* 32px */
  --mercury-space-2xl: 3rem;      /* 48px */
  
  /* Border Radius */
  --mercury-radius: 0.75rem;      /* 12px */
  --mercury-radius-sm: 0.5rem;    /* 8px */
  --mercury-radius-lg: 1rem;      /* 16px */
  
  /* Shadows */
  --mercury-shadow-focused: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1);
  --mercury-shadow-ambient: 0 1px 3px rgba(0, 0, 0, 0.05);
  --mercury-shadow-elevated: 0 10px 25px rgba(0, 0, 0, 0.1);
  --mercury-shadow-fog: 0 8px 32px rgba(0, 0, 0, 0.08);
}

/* Dark Mode Variables */
@media (prefers-color-scheme: dark) {
  :root {
    /* Surface Colors */
    --mercury-surface-primary: 220 20% 8%;
    --mercury-surface-secondary: 220 20% 10%;
    --mercury-surface-elevated: 220 20% 12%;
    
    /* Text Colors */
    --mercury-text-primary: 0 0% 95%;
    --mercury-text-secondary: 220 10% 70%;
    --mercury-text-muted: 220 5% 50%;
    
    /* Fog adjustments for dark mode */
    --mercury-fog: 220 20% 15%;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --mercury-transition-duration: 0ms;
  }
  
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Typography System

### Mercury Typography Classes

```css
/* Typography Utilities */
.text-mercury-hero {
  @apply text-mercury-hero font-mercury font-bold tracking-tight;
}

.text-mercury-title {
  @apply text-mercury-title font-mercury font-semibold tracking-tight;
}

.text-mercury-body {
  @apply text-mercury-body font-mercury leading-relaxed;
}

.text-mercury-caption {
  @apply text-mercury-caption font-mercury text-mercury-text-secondary;
}

/* Responsive Typography */
.mercury-text-responsive {
  @apply text-sm md:text-base lg:text-lg;
}

.mercury-heading-responsive {
  @apply text-xl md:text-2xl lg:text-3xl xl:text-4xl;
}
```

### Usage Examples

```jsx
{/* Hero Text */}
<h1 className="text-mercury-hero text-mercury-text-primary">
  Introducing Mercury
</h1>

{/* Module Title */}
<h2 className="text-mercury-title text-mercury-text-primary mb-mercury-sm">
  Review Inbox
</h2>

{/* Body Text */}
<p className="text-mercury-body text-mercury-text-secondary">
  A fluid experience driven by human intent
</p>

{/* Caption */}
<span className="text-mercury-caption">
  Last updated 2 hours ago
</span>
```

---

## Color & Contrast System

### Focus State Management

```css
/* Focus State Utilities */
.mercury-focused {
  @apply bg-mercury-surface-elevated shadow-mercury-focused scale-101 z-10;
}

.mercury-ambient {
  @apply opacity-70 scale-98;
  filter: blur(0.5px);
}

.mercury-fog {
  @apply opacity-40 scale-95;
  filter: blur(1px);
}

/* Interactive States */
.mercury-interactive {
  @apply transition-all duration-mercury-normal ease-mercury cursor-pointer;
}

.mercury-interactive:hover {
  @apply mercury-focused;
}

.mercury-interactive:active {
  @apply scale-95;
}
```

### Color Combinations

```jsx
{/* Primary Module */}
<div className="bg-mercury-surface-primary text-mercury-text-primary">
  Primary content
</div>

{/* Secondary Module */}
<div className="bg-mercury-surface-secondary text-mercury-text-secondary">
  Secondary content
</div>

{/* Focused Module */}
<div className="mercury-focused">
  Focused content
</div>

{/* Ambient Module */}
<div className="mercury-ambient">
  Ambient content
</div>
```

---

## Spacing & Layout

### Mercury Grid System

```css
/* Grid Utilities */
.mercury-grid {
  @apply grid gap-mercury-md p-mercury-lg;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.mercury-flow {
  @apply flex gap-mercury-sm overflow-x-auto;
}

.mercury-stack {
  @apply flex flex-col gap-mercury-sm;
}

/* Module Sizing */
.mercury-module-sm {
  @apply min-h-[200px] max-w-sm;
}

.mercury-module-md {
  @apply min-h-[300px] max-w-md;
}

.mercury-module-lg {
  @apply min-h-[400px] max-w-lg;
}

.mercury-module-full {
  @apply min-h-screen w-full;
}
```

### Layout Components

```jsx
{/* Mercury Workspace */}
<div className="mercury-grid">
  <div className="mercury-module mercury-module-md">
    <ModuleContent />
  </div>
  <div className="mercury-module mercury-module-sm mercury-ambient">
    <AmbientContent />
  </div>
</div>

{/* Mercury Flow */}
<div className="mercury-flow">
  <div className="mercury-module mercury-module-sm flex-shrink-0">
    <FlowItem />
  </div>
  <div className="mercury-module mercury-module-sm flex-shrink-0">
    <FlowItem />
  </div>
</div>
```

---

## Animation Principles

### Daoist Inexertion Animation System

```css
/* Core Animation Classes */
.mercury-enter {
  @apply animate-mercury-enter;
}

.mercury-exit {
  @apply animate-mercury-exit;
}

.mercury-scale-gentle {
  @apply animate-mercury-scale;
}

.mercury-float-subtle {
  @apply animate-mercury-float;
}

/* State Transitions */
.mercury-transition-all {
  @apply transition-all duration-mercury-normal ease-mercury;
}

.mercury-transition-fast {
  @apply transition-all duration-mercury-fast ease-mercury;
}

.mercury-transition-slow {
  @apply transition-all duration-mercury-slow ease-mercury;
}

/* Focus Transitions */
.mercury-focus-transition {
  @apply mercury-transition-all;
}

.mercury-focus-transition:focus-within {
  @apply mercury-focused;
}

.mercury-focus-transition:not(:focus-within) {
  @apply mercury-ambient;
}
```

### Animation Combinations

```jsx
{/* Entering Module */}
<div className="mercury-module mercury-enter">
  <Content />
</div>

{/* Interactive Module */}
<div className="mercury-module mercury-interactive mercury-transition-all hover:mercury-focused">
  <InteractiveContent />
</div>

{/* Floating Element */}
<div className="mercury-float-subtle">
  <FloatingButton />
</div>

{/* Staggered Animation */}
<div className="space-y-mercury-sm">
  {items.map((item, index) => (
    <div 
      key={item.id}
      className="mercury-enter"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <ModuleItem />
    </div>
  ))}
</div>
```

---

## Component Utilities

### Mercury Module Components

```jsx
// Base Module Component
function MercuryModule({ 
  children, 
  focusLevel = 'ambient', 
  className = '',
  ...props 
}) {
  const focusClasses = {
    focused: 'mercury-focused',
    ambient: 'mercury-ambient',
    fog: 'mercury-fog'
  };

  return (
    <div 
      className={`
        mercury-module 
        mercury-transition-all 
        ${focusClasses[focusLevel]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

// Command Palette Component
function CommandPalette({ isOpen, onClose }) {
  return (
    <div className={`
      fixed inset-0 z-50 
      ${isOpen ? 'mercury-enter' : 'mercury-exit'}
    `}>
      <div className="mercury-fog-effect absolute inset-0" onClick={onClose} />
      <div className="
        mercury-command-palette 
        absolute top-20 left-1/2 transform -translate-x-1/2 
        w-full max-w-lg mx-auto
        mercury-enter
      ">
        <input 
          className="w-full p-mercury-md bg-transparent outline-none"
          placeholder="What would you like to do?"
        />
      </div>
    </div>
  );
}

// Focus Manager Component
function FocusManager({ children, mode = 'single' }) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  return (
    <div className="mercury-grid">
      {React.Children.map(children, (child, index) => {
        const focusLevel = mode === 'single' 
          ? (index === focusedIndex ? 'focused' : 'ambient')
          : 'focused';
        
        return React.cloneElement(child, {
          focusLevel,
          onClick: () => setFocusedIndex(index)
        });
      })}
    </div>
  );
}
```

---

## Focus Management

### Focus State System

```css
/* Focus Management Utilities */
.mercury-focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-mercury-focused focus:ring-offset-2;
}

.mercury-focus-visible {
  @apply focus-visible:mercury-focused;
}

/* Focus Within */
.mercury-focus-within {
  @apply focus-within:mercury-focused;
}

/* Keyboard Navigation */
.mercury-keyboard-nav {
  @apply focus:mercury-focused focus:z-20;
}
```

### Interactive Focus Examples

```jsx
{/* Focus-aware Button */}
<button className="
  mercury-module 
  mercury-interactive 
  mercury-focus-ring 
  mercury-keyboard-nav
">
  Primary Action
</button>

{/* Focus-aware Input */}
<input className="
  w-full p-mercury-sm 
  bg-mercury-surface-secondary 
  rounded-mercury 
  mercury-focus-ring
  mercury-transition-all
" />

{/* Focus-aware Module */}
<div className="
  mercury-module 
  mercury-focus-within 
  mercury-transition-all
">
  <input type="text" />
  <button>Submit</button>
</div>
```

---

## Responsive Design

### Mercury Responsive System

```css
/* Responsive Utilities */
.mercury-responsive-grid {
  @apply grid gap-mercury-sm;
  grid-template-columns: 1fr;
}

@screen md {
  .mercury-responsive-grid {
    grid-template-columns: repeat(2, 1fr);
    @apply gap-mercury-md;
  }
}

@screen lg {
  .mercury-responsive-grid {
    grid-template-columns: repeat(3, 1fr);
    @apply gap-mercury-lg;
  }
}

/* Responsive Modules */
.mercury-module-responsive {
  @apply mercury-module-sm md:mercury-module-md lg:mercury-module-lg;
}

/* Responsive Typography */
.mercury-text-responsive {
  @apply text-mercury-body md:text-lg lg:text-xl;
}
```

### Responsive Layout Examples

```jsx
{/* Responsive Workspace */}
<div className="mercury-responsive-grid">
  {modules.map(module => (
    <MercuryModule 
      key={module.id}
      className="mercury-module-responsive"
    >
      {module.content}
    </MercuryModule>
  ))}
</div>

{/* Mobile-first Command Palette */}
<div className="
  mercury-command-palette 
  w-full mx-4 
  md:w-96 md:mx-auto 
  lg:w-[32rem]
">
  <CommandInput />
</div>
```

---

## Implementation Examples

### Complete Mercury Interface

```jsx
function MercuryInterface() {
  const [currentIntent, setCurrentIntent] = useState('');
  const [focusedModule, setFocusedModule] = useState(0);

  return (
    <div className="min-h-screen bg-mercury-surface-secondary">
      {/* Command Palette */}
      <CommandPalette 
        intent={currentIntent}
        onIntentChange={setCurrentIntent}
      />
      
      {/* Main Workspace */}
      <main className="mercury-responsive-grid p-mercury-lg">
        <MercuryModule 
          focusLevel={focusedModule === 0 ? 'focused' : 'ambient'}
          className="mercury-enter"
          style={{ animationDelay: '0ms' }}
        >
          <h2 className="text-mercury-title mb-mercury-sm">
            Primary Task
          </h2>
          <p className="text-mercury-body text-mercury-text-secondary">
            Main content area
          </p>
        </MercuryModule>
        
        <MercuryModule 
          focusLevel={focusedModule === 1 ? 'focused' : 'ambient'}
          className="mercury-enter"
          style={{ animationDelay: '100ms' }}
        >
          <h3 className="text-mercury-title mb-mercury-sm">
            Secondary Task
          </h3>
          <p className="text-mercury-body text-mercury-text-secondary">
            Supporting content
          </p>
        </MercuryModule>
        
        <MercuryModule 
          focusLevel="fog"
          className="mercury-enter"
          style={{ animationDelay: '200ms' }}
        >
          <h4 className="text-mercury-caption text-mercury-text-muted mb-mercury-xs">
            Background Context
          </h4>
          <div className="mercury-fog-effect p-mercury-sm rounded-mercury-sm">
            <p className="text-mercury-caption">
              Ambient information
            </p>
          </div>
        </MercuryModule>
      </main>
    </div>
  );
}
```

### Mercury Form Component

```jsx
function MercuryForm({ onSubmit }) {
  return (
    <MercuryModule className="mercury-focus-within">
      <form onSubmit={onSubmit} className="mercury-stack">
        <h2 className="text-mercury-title">Create New Task</h2>
        
        <input 
          type="text" 
          placeholder="Task title"
          className="
            w-full p-mercury-sm 
            bg-mercury-surface-secondary 
            rounded-mercury 
            mercury-focus-ring
            mercury-transition-all
            text-mercury-body
          "
        />
        
        <textarea 
          placeholder="Description"
          className="
            w-full p-mercury-sm 
            bg-mercury-surface-secondary 
            rounded-mercury 
            mercury-focus-ring
            mercury-transition-all
            text-mercury-body
            resize-none
            min-h-[100px]
          "
        />
        
        <button 
          type="submit"
          className="
            mercury-interactive
            mercury-focus-ring
            bg-mercury-primary 
            text-mercury-text-inverse
            px-mercury-lg py-mercury-sm
            rounded-mercury
            font-medium
          "
        >
          Create Task
        </button>
      </form>
    </MercuryModule>
  );
}
```

### Mercury Card Component

```jsx
function MercuryCard({ title, content, actions, focusLevel = 'ambient' }) {
  return (
    <MercuryModule 
      focusLevel={focusLevel}
      className="mercury-interactive mercury-focus-visible"
    >
      <div className="mercury-stack">
        <header className="flex justify-between items-start">
          <h3 className="text-mercury-title">{title}</h3>
          <div className="mercury-fog opacity-0 group-hover:opacity-100 mercury-transition-all">
            {actions}
          </div>
        </header>
        
        <div className="text-mercury-body text-mercury-text-secondary">
          {content}
        </div>
        
        <footer className="text-mercury-caption text-mercury-text-muted">
          <time>2 hours ago</time>
        </footer>
      </div>
    </MercuryModule>
  );
}
```

---

## Performance Considerations

### Animation Performance

```css
/* GPU Acceleration */
.mercury-gpu-accelerated {
  transform: translateZ(0);
  will-change: transform, opacity;
}

/* Optimize for 60fps */
.mercury-smooth-animation {
  animation-fill-mode: both;
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Disable animations on low-performance devices */
@media (prefers-reduced-motion: reduce) {
  .mercury-enter,
  .mercury-exit,
  .mercury-float-subtle {
    animation: none !important;
  }
}
```

### CSS Custom Properties for Dynamic Theming

```javascript
// Dynamic theme switching
function updateMercuryTheme(theme) {
  const root = document.documentElement;
  
  Object.entries(theme).forEach(([key, value]) => {
    root.style.setProperty(`--mercury-${key}`, value);
  });
}

// Usage
updateMercuryTheme({
  'primary': '280 100% 60%',
  'surface-primary': '280 20% 95%'
});
```

---

## Conclusion

This Tailwind CSS implementation of Mercury design principles provides:

1. **Fluid Interactions**: Smooth transitions and natural animations
2. **Focused Attention**: Selective contrast and focus management
3. **Familiar Patterns**: Enhanced versions of standard web interactions
4. **Cognitive Accessibility**: Reduced motion support and clear hierarchies
5. **Responsive Design**: Mobile-first, intention-driven layouts

**Quick Start:**
1. Copy the Tailwind configuration
2. Add CSS custom properties to your base styles
3. Use Mercury components and utilities
4. Test with users who have cognitive differences

**Next Steps:**
- Implement user testing with neurodivergent users
- Create animation performance monitoring
- Build a component library based on these patterns
- Develop accessibility testing protocols

---

*"Design systems should reduce cognitive load, not create it."*

**Version**: 1.0  
**Framework**: Tailwind CSS 3.4+  
**Last Updated**: December 2024 