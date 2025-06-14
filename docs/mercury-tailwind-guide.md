# Mercury Design System: Tailwind CSS & Animation Guide

*Implementing fluid, focused, and humane design principles with Tailwind CSS*

## Table of Contents

1. [Tailwind Configuration](#tailwind-configuration)
2. [Design Tokens](#design-tokens)
3. [Animation System](#animation-system)
4. [Component Utilities](#component-utilities)
5. [Implementation Examples](#implementation-examples)

## Tailwind Configuration

### Enhanced tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
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
        mercury: {
          primary: 'hsl(var(--mercury-primary))',
          secondary: 'hsl(var(--mercury-secondary))',
          focused: 'hsl(var(--mercury-focused))',
          ambient: 'hsl(var(--mercury-ambient))',
          fog: 'hsl(var(--mercury-fog))',
          surface: {
            primary: 'hsl(var(--mercury-surface-primary))',
            secondary: 'hsl(var(--mercury-surface-secondary))',
            elevated: 'hsl(var(--mercury-surface-elevated))',
          },
          text: {
            primary: 'hsl(var(--mercury-text-primary))',
            secondary: 'hsl(var(--mercury-text-secondary))',
            muted: 'hsl(var(--mercury-text-muted))',
          }
        }
      },
      animation: {
        'mercury-enter': 'mercury-enter 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'mercury-exit': 'mercury-exit 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'mercury-float': 'mercury-float 6s ease-in-out infinite',
        'mercury-blur-in': 'mercury-blur-in 0.5s ease-out',
      },
      keyframes: {
        'mercury-enter': {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'mercury-exit': {
          '0%': { opacity: '1', transform: 'translateY(0) scale(1)' },
          '100%': { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
        },
        'mercury-float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'mercury-blur-in': {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0px)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities, addComponents }) {
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
      });

      addComponents({
        '.mercury-module': {
          'background': 'hsl(var(--mercury-surface-primary))',
          'border-radius': '0.75rem',
          'padding': '1rem',
          'transition': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          'box-shadow': '0 1px 3px rgba(0, 0, 0, 0.05)',
        },
        '.mercury-module-focused': {
          'box-shadow': '0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)',
          'transform': 'scale(1.01)',
          'z-index': '10',
        },
        '.mercury-module-ambient': {
          'opacity': '0.7',
          'filter': 'blur(0.5px)',
          'transform': 'scale(0.98)',
        },
      });
    },
  ],
}
```

## Design Tokens

### CSS Custom Properties

```css
:root {
  /* Colors */
  --mercury-primary: 220 100% 50%;
  --mercury-secondary: 210 40% 60%;
  --mercury-focused: 220 100% 50%;
  --mercury-ambient: 210 20% 70%;
  --mercury-fog: 210 10% 90%;
  
  /* Surfaces */
  --mercury-surface-primary: 0 0% 100%;
  --mercury-surface-secondary: 210 20% 98%;
  --mercury-surface-elevated: 0 0% 100%;
  
  /* Text */
  --mercury-text-primary: 220 20% 10%;
  --mercury-text-secondary: 220 10% 40%;
  --mercury-text-muted: 220 5% 60%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --mercury-surface-primary: 220 20% 8%;
    --mercury-surface-secondary: 220 20% 10%;
    --mercury-surface-elevated: 220 20% 12%;
    --mercury-text-primary: 0 0% 95%;
    --mercury-text-secondary: 220 10% 70%;
    --mercury-text-muted: 220 5% 50%;
  }
}
```

## Animation System

### Core Animation Classes

```css
.mercury-enter {
  @apply animate-mercury-enter;
}

.mercury-exit {
  @apply animate-mercury-exit;
}

.mercury-transition {
  @apply transition-all duration-300 ease-out;
}

.mercury-focus-transition {
  @apply mercury-transition;
}

.mercury-focus-transition:focus-within {
  @apply mercury-module-focused;
}

.mercury-interactive {
  @apply cursor-pointer mercury-transition;
}

.mercury-interactive:hover {
  @apply mercury-module-focused;
}
```

## Component Utilities

### Mercury Modules

```jsx
function MercuryModule({ 
  children, 
  focusLevel = 'ambient', 
  className = '',
  ...props 
}) {
  const focusClasses = {
    focused: 'mercury-module-focused',
    ambient: 'mercury-module-ambient',
    fog: 'opacity-40 scale-95'
  };

  return (
    <div 
      className={`
        mercury-module 
        mercury-transition 
        ${focusClasses[focusLevel]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Command Palette

```jsx
function CommandPalette({ isOpen, onClose }) {
  return (
    <div className={`
      fixed inset-0 z-50 
      ${isOpen ? 'mercury-enter' : 'mercury-exit'}
    `}>
      <div className="mercury-fog-effect absolute inset-0" onClick={onClose} />
      <div className="
        mercury-glass
        absolute top-20 left-1/2 transform -translate-x-1/2 
        w-full max-w-lg mx-auto
        rounded-xl p-4
      ">
        <input 
          className="w-full p-3 bg-transparent outline-none text-mercury-body"
          placeholder="What would you like to do?"
        />
      </div>
    </div>
  );
}
```

## Implementation Examples

### Mercury Interface

```jsx
function MercuryInterface() {
  const [focusedModule, setFocusedModule] = useState(0);

  return (
    <div className="min-h-screen bg-mercury-surface-secondary p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MercuryModule 
          focusLevel={focusedModule === 0 ? 'focused' : 'ambient'}
          className="mercury-enter"
          onClick={() => setFocusedModule(0)}
        >
          <h2 className="text-mercury-title mb-4 text-mercury-text-primary">
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
          onClick={() => setFocusedModule(1)}
        >
          <h3 className="text-mercury-title mb-4 text-mercury-text-primary">
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
          <h4 className="text-mercury-caption text-mercury-text-muted mb-2">
            Background Context
          </h4>
          <div className="mercury-fog-effect p-3 rounded-lg">
            <p className="text-mercury-caption text-mercury-text-muted">
              Ambient information
            </p>
          </div>
        </MercuryModule>
      </div>
    </div>
  );
}
```

### Mercury Form

```jsx
function MercuryForm() {
  return (
    <MercuryModule className="max-w-md mx-auto">
      <form className="space-y-4">
        <h2 className="text-mercury-title text-mercury-text-primary">
          Create New Task
        </h2>
        
        <input 
          type="text" 
          placeholder="Task title"
          className="
            w-full p-3 
            bg-mercury-surface-secondary 
            rounded-lg 
            focus:mercury-module-focused
            mercury-transition
            text-mercury-body
            outline-none
          "
        />
        
        <textarea 
          placeholder="Description"
          className="
            w-full p-3 
            bg-mercury-surface-secondary 
            rounded-lg 
            focus:mercury-module-focused
            mercury-transition
            text-mercury-body
            outline-none
            resize-none
            min-h-[100px]
          "
        />
        
        <button 
          type="submit"
          className="
            w-full
            mercury-interactive
            bg-mercury-primary 
            text-white
            px-6 py-3
            rounded-lg
            font-medium
            mercury-transition
          "
        >
          Create Task
        </button>
      </form>
    </MercuryModule>
  );
}
```

### Mercury Card Grid

```jsx
function MercuryCardGrid({ items }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {items.map((item, index) => (
        <MercuryModule
          key={item.id}
          className="mercury-interactive mercury-enter"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="space-y-3">
            <h3 className="text-mercury-title text-mercury-text-primary">
              {item.title}
            </h3>
            <p className="text-mercury-body text-mercury-text-secondary">
              {item.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="text-mercury-caption text-mercury-text-muted">
                {item.timestamp}
              </span>
              <button className="mercury-interactive px-3 py-1 rounded-md bg-mercury-surface-elevated">
                View
              </button>
            </div>
          </div>
        </MercuryModule>
      ))}
    </div>
  );
}
```

## Performance Considerations

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .mercury-enter,
  .mercury-exit,
  .mercury-float {
    animation: none !important;
  }
  
  .mercury-transition {
    transition: none !important;
  }
}
```

### GPU Acceleration

```css
.mercury-optimized {
  transform: translateZ(0);
  will-change: transform, opacity;
  backface-visibility: hidden;
}
```

## Conclusion

This Tailwind implementation provides:

1. **Fluid animations** with natural easing curves
2. **Selective focus** through the three-tier system
3. **Cognitive accessibility** with reduced motion support
4. **Modular components** for consistent implementation
5. **Performance optimization** for smooth interactions

The system prioritizes human cognitive patterns over technical constraints, creating interfaces that truly serve users rather than requiring adaptation to arbitrary software limitations. 