# Flowy Card Design System

A beautiful implementation of weightless, glass-morphic UI cards built with Next.js, Tailwind CSS, and Framer Motion. Following modern design principles inspired by Apple's Vision Pro, Microsoft's Fluent Design, and contemporary glassmorphism trends.

## ✨ Features

- **Glassmorphic Design**: Translucent cards with backdrop blur effects
- **Smooth Animations**: Framer Motion powered interactions with spring physics
- **Accessibility First**: WCAG compliant with keyboard navigation and screen reader support
- **Responsive Design**: Adapts beautifully across all screen sizes
- **Interactive Components**: Expandable cards with functional interactions
- **TypeScript**: Full type safety throughout
- **Design System**: Comprehensive design tokens and principles

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ (recommended: 18.18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd flowy-cards

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the flowy cards in action.

## 🎨 Design Principles

Our flowy cards follow these core principles:

### Visual Foundations
- **Corner Radius**: 20-40px for soft, flowing edges
- **Backdrop Blur**: 8-20px for glassmorphic effect
- **Transparency**: 40% opacity with proper contrast
- **Shadows**: Soft, layered shadows with hover enhancement

### Interaction & Motion
- **Hover Effects**: 2-4px lift with enhanced shadows
- **Spring Physics**: Natural, bouncy animations
- **One Animation Rule**: Single primary animation per card
- **Accessibility**: Reduced motion support

### Information Architecture
- **Three-tier Hierarchy**: Title → Supporting text → Actions
- **Content Density**: Maximum 3-4 content blocks per card
- **Semantic Structure**: Proper HTML5 and ARIA

## 🧩 Components

### Base Components

#### `FlowyCard`
The foundation component with glassmorphic styling and animations.

```tsx
import { FlowyCard } from "@/components/ui/flowy-card"

<FlowyCard variant="default" size="md" interactive expandable>
  <FlowyCardHeader>
    <FlowyCardTitle>Card Title</FlowyCardTitle>
    <FlowyCardSubtitle>Supporting text</FlowyCardSubtitle>
  </FlowyCardHeader>
  <FlowyCardContent>
    Card content goes here
  </FlowyCardContent>
  <FlowyCardFooter>
    Action buttons
  </FlowyCardFooter>
</FlowyCard>
```

#### Props
- `variant`: `"default" | "elevated" | "transparent" | "glass"`
- `size`: `"sm" | "md" | "lg"`
- `interactive`: Boolean for hover effects
- `expandable`: Boolean for expansion functionality
- `expanded`: Boolean for expanded state

### Example Components

#### `EmailCard`
A functional email interface with reply, forward, and delete actions.

#### `CalendarCard`
An interactive calendar widget with event management.

#### `ConversationCard`
A real-time messaging interface with send functionality.

## 🎯 Usage Examples

### Basic Card
```tsx
<FlowyCard variant="default" size="md">
  <FlowyCardHeader>
    <FlowyCardTitle>Simple Card</FlowyCardTitle>
  </FlowyCardHeader>
  <FlowyCardContent>
    This is a basic flowy card with glassmorphic styling.
  </FlowyCardContent>
</FlowyCard>
```

### Interactive Card with Actions
```tsx
<FlowyCard 
  variant="glass" 
  expandable 
  onExpand={() => console.log('Card expanded')}
>
  <FlowyCardHeader>
    <FlowyCardTitle>Interactive Card</FlowyCardTitle>
  </FlowyCardHeader>
  <FlowyCardContent>
    Click to expand this card!
  </FlowyCardContent>
  <FlowyCardFooter>
    <button>Action</button>
  </FlowyCardFooter>
</FlowyCard>
```

## 🎨 Design Tokens

### Colors
```css
--flowy-glass: rgba(255, 255, 255, 0.4)
--flowy-glass-dark: rgba(24, 24, 24, 0.35)
--flowy-border: rgba(255, 255, 255, 0.25)
--flowy-border-dark: rgba(255, 255, 255, 0.1)
```

### Shadows
```css
--shadow-flowy: 0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)
--shadow-flowy-md: 0 8px 24px rgba(0, 0, 0, 0.08), 0 4px 8px rgba(0, 0, 0, 0.06)
--shadow-flowy-lg: 0 16px 32px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.08)
```

### Border Radius
```css
--radius-flowy-sm: 20px
--radius-flowy-md: 28px
--radius-flowy-lg: 40px
```

## 📱 Responsive Behavior

- **Mobile (< 640px)**: Full-width cards, reduced shadows
- **Tablet (640px - 1024px)**: 2-column grid
- **Desktop (> 1024px)**: 3-column masonry layout
- **Expandable**: Cards can span 2 columns when expanded

## ♿ Accessibility Features

- **WCAG AA Compliant**: 4.5:1 contrast ratio maintained
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Friendly**: Proper ARIA labels and roles
- **Reduced Motion**: Respects `prefers-reduced-motion`
- **Focus Management**: Clear focus indicators

## 🔧 Customization

### Creating Custom Variants

```tsx
// Add to tailwind.config.ts
extend: {
  colors: {
    flowy: {
      custom: "rgba(59, 130, 246, 0.3)", // Custom blue glass
    }
  }
}

// Use in component
<FlowyCard className="bg-flowy-custom">
  Custom styled card
</FlowyCard>
```

### Custom Animations

```tsx
const customVariants = {
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3 }
  }
}

<FlowyCard whileHover="hover" variants={customVariants}>
  Custom animation card
</FlowyCard>
```

## 📚 Documentation

For comprehensive design principles and guidelines, see:
- [`docs/flowy-card-design-principles.md`](../docs/flowy-card-design-principles.md) - Complete design system documentation

## 🛠 Technology Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design tokens
- **Animations**: Framer Motion
- **UI Library**: shadcn/ui components
- **TypeScript**: Full type safety
- **Icons**: Lucide React

## 🎯 Performance Considerations

- **GPU Optimization**: Backdrop blur limited to visible cards
- **Lazy Loading**: Off-screen cards load on demand
- **Efficient Animations**: Use of `transform` and `opacity` only
- **Memory Management**: Intersection observer for blur effects

## 🐛 Troubleshooting

### Common Issues

**Cards not showing glassmorphic effect?**
- Ensure your browser supports `backdrop-filter`
- Check if hardware acceleration is enabled

**Performance issues?**
- Limit the number of cards with backdrop blur
- Use the `transparent` variant for better performance

**Accessibility warnings?**
- Ensure sufficient contrast ratios
- Add proper ARIA labels to interactive elements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the design principles in the documentation
4. Ensure accessibility compliance
5. Add tests for new components
6. Submit a pull request

## 📄 License

MIT License - feel free to use in your projects!

## 🙏 Acknowledgments

- Inspired by Apple's Vision Pro interface design
- Microsoft's Fluent Design Acrylic materials
- Modern glassmorphism design trends
- shadcn/ui component architecture
