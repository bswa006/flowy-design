# Mercury OS Contextual System - Action Plan

## 🎯 **Executive Summary**

**Current Status:** 40% Complete - Foundation is solid, but core interactive functionality is missing  
**Critical Path:** Drag & Drop → Card Creation → Flow Canvas → Intelligence  
**Target:** Full contextual computing experience with spatial interaction

## 🚨 **Critical Issue: Node.js Version**

```bash
# Current error from user terminal:
# You are using Node.js 18.17.0. For Next.js, Node.js version "^18.18.0 || ^19.8.0 || >= 20.0.0" is required.
```

**❗ IMMEDIATE ACTION REQUIRED:**
```bash
# Update Node.js first
nvm install 20
nvm use 20
# OR
nvm install 18.18.0
nvm use 18.18.0
```

## 🛠️ **Phase 1: Core Drag & Drop System (Week 1)**

### **Day 1-2: Setup & Dependencies**

#### **1. Install Required Packages**
```bash
npm install react-dnd react-dnd-html5-backend @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
npm install --save-dev @types/react-dnd
```

#### **2. Create Core Type Definitions**
```typescript
// lib/mercury-types.ts
export interface Point {
  x: number
  y: number
}

export interface DragItem {
  id: string
  type: 'search-result' | 'action-card' | 'content-block'
  data: any
  sourceContext: string
  previewComponent?: React.ComponentType<any>
}

export interface DropResult {
  targetId: string
  targetType: 'flow-canvas' | 'card-stack' | 'connection-point'
  position: Point
  action: 'create-card' | 'add-to-existing' | 'create-connection'
}

export interface MercuryCard {
  id: string
  type: 'housing-listing' | 'location-info' | 'content-block'
  position: Point
  content: CardContent
  connections: Connection[]
  focusLevel: FocusLevel
  intent: string
  metadata: CardMetadata
}

export interface CardContent {
  title: string
  description?: string
  imageUrl?: string
  price?: string
  metadata: Record<string, any>
}

export interface Connection {
  id: string
  source: string
  target: string
  type: 'related' | 'derived' | 'sequential'
  strength: number
}
```

#### **3. Create Drag System Hook**
```typescript
// lib/mercury-drag-system.ts
import { useDrag, useDrop } from 'react-dnd'

export function useMercuryDrag(item: DragItem) {
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: item.type,
    item: item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  return { isDragging, drag, dragPreview }
}

export function useMercuryDrop(onDrop: (item: DragItem, position: Point) => void) {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ['search-result', 'action-card', 'content-block'],
    drop: (item: DragItem, monitor) => {
      const clientOffset = monitor.getClientOffset()
      if (clientOffset) {
        onDrop(item, { x: clientOffset.x, y: clientOffset.y })
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  return { isOver, canDrop, drop }
}
```

### **Day 3-4: Draggable Components**

#### **4. Create Draggable Listing Component**
```typescript
// components/mercury/mercury-draggable-listing.tsx
"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { useMercuryDrag } from '@/lib/mercury-drag-system'
import { DragItem } from '@/lib/mercury-types'

interface MercuryDraggableListingProps {
  listing: ApartmentListing
  onDragStart?: () => void
  onDragEnd?: () => void
}

export function MercuryDraggableListing({ 
  listing, 
  onDragStart, 
  onDragEnd 
}: MercuryDraggableListingProps) {
  const dragItem: DragItem = {
    id: listing.id,
    type: 'search-result',
    data: listing,
    sourceContext: 'housing-module'
  }

  const { isDragging, drag } = useMercuryDrag(dragItem)

  return (
    <motion.div
      ref={drag}
      className={`cursor-move ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      animate={{ 
        scale: isDragging ? 1.05 : 1,
        zIndex: isDragging ? 999 : 1
      }}
      transition={{ duration: 0.2 }}
    >
      {/* Existing listing content */}
    </motion.div>
  )
}
```

#### **5. Update Housing Module for Drag**
```typescript
// Update components/mercury/mercury-housing-module.tsx
// Replace renderListing with MercuryDraggableListing
import { MercuryDraggableListing } from './mercury-draggable-listing'

const renderListing = (listing: ApartmentListing, index: number) => (
  <MercuryDraggableListing
    key={listing.id}
    listing={listing}
    onDragStart={() => console.log('Drag started:', listing.id)}
    onDragEnd={() => console.log('Drag ended:', listing.id)}
  />
)
```

### **Day 5-7: Drop Zones & Basic Canvas**

#### **6. Create Flow Canvas Component**
```typescript
// components/mercury/mercury-flow-canvas.tsx
"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMercuryDrop } from '@/lib/mercury-drag-system'
import { MercuryCard, DragItem, Point } from '@/lib/mercury-types'

interface MercuryFlowCanvasProps {
  intent: string
  children?: React.ReactNode
  onCardCreated?: (card: MercuryCard) => void
}

export function MercuryFlowCanvas({ 
  intent, 
  children, 
  onCardCreated 
}: MercuryFlowCanvasProps) {
  const [cards, setCards] = useState<MercuryCard[]>([])

  const handleDrop = useCallback((item: DragItem, position: Point) => {
    const newCard: MercuryCard = {
      id: `card-${Date.now()}`,
      type: 'housing-listing',
      position,
      content: {
        title: item.data.name,
        description: `${item.data.bedrooms}, ${item.data.bathrooms}`,
        price: item.data.price,
        metadata: item.data
      },
      connections: [],
      focusLevel: 'focused',
      intent: `${intent}-spawned-card`,
      metadata: {
        sourceType: item.type,
        sourceContext: item.sourceContext,
        createdAt: Date.now()
      }
    }

    setCards(prev => [...prev, newCard])
    onCardCreated?.(newCard)
  }, [intent, onCardCreated])

  const { isOver, canDrop, drop } = useMercuryDrop(handleDrop)

  return (
    <motion.div
      ref={drop}
      data-intent={intent}
      className={`
        relative min-h-[400px] w-full rounded-2xl border-2 border-dashed 
        ${isOver && canDrop ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200'}
        transition-all duration-300
      `}
      animate={{
        backgroundColor: isOver && canDrop ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
      }}
    >
      {/* Existing content */}
      {children}

      {/* Spawned cards */}
      <AnimatePresence>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            initial={{ 
              scale: 0.8, 
              opacity: 0, 
              x: card.position.x, 
              y: card.position.y 
            }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              x: card.position.x, 
              y: card.position.y 
            }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="absolute bg-white rounded-xl shadow-lg p-4 min-w-[200px]"
            style={{ 
              left: card.position.x - 100, 
              top: card.position.y - 50 
            }}
          >
            <h3 className="font-medium text-slate-900">{card.content.title}</h3>
            <p className="text-sm text-slate-600">{card.content.description}</p>
            <p className="text-sm font-bold text-slate-900">{card.content.price}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Drop instruction overlay */}
      {isOver && canDrop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-blue-50/30 rounded-2xl"
        >
          <div className="text-blue-600 font-medium">Drop to create card</div>
        </motion.div>
      )}
    </motion.div>
  )
}
```

#### **7. Update Main Demo Page**
```typescript
// Update app/mercury-contextual-demo/page.tsx
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MercuryFlowCanvas } from '@/components/mercury/mercury-flow-canvas'

export default function MercuryContextualDemoPage() {
  // ... existing code ...

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        {/* ... existing header ... */}

        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* ... existing instructions ... */}

          {/* Multi-Module Layout with Flow Canvas */}
          <motion.section className="space-y-8">
            <h2 className="text-2xl font-semibold text-slate-900">
              Multi-Module Spatial Interface
            </h2>
            
            <div className="flex space-x-8 items-start">
              {/* Chat Module */}
              <MercuryChatModule ... />

              {/* Housing Module */}
              <AnimatePresence mode="wait">
                {showHousingModule && (
                  <MercuryHousingModule ... />
                )}
              </AnimatePresence>
            </div>

            {/* NEW: Flow Canvas */}
            <MercuryFlowCanvas
              intent="contextual-flow-canvas"
              onCardCreated={(card) => {
                console.log('New card created:', card)
                setActionFeedback(`Created card: ${card.content.title}`)
                setTimeout(() => setActionFeedback(null), 2000)
              }}
            />
          </motion.section>
        </main>
      </div>
    </DndProvider>
  )
}
```

## 🚀 **Phase 2: Card System Enhancement (Week 2)**

### **Day 8-10: Advanced Card Components**

#### **8. Create Mercury Card Component**
```typescript
// components/mercury/mercury-contextual-card.tsx
"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MercuryCard, FocusLevel } from '@/lib/mercury-types'
import { cn } from '@/lib/utils'
import { getMercuryFocusClasses } from '@/lib/mercury-tokens'

interface MercuryContextualCardProps {
  card: MercuryCard
  onFocusChange?: (level: FocusLevel) => void
  onMove?: (position: Point) => void
  onDelete?: () => void
}

export function MercuryContextualCard({ 
  card, 
  onFocusChange, 
  onMove, 
  onDelete 
}: MercuryContextualCardProps) {
  const [focusLevel, setFocusLevel] = useState<FocusLevel>(card.focusLevel)

  const handleFocusChange = (level: FocusLevel) => {
    setFocusLevel(level)
    onFocusChange?.(level)
  }

  return (
    <motion.div
      data-intent={card.intent}
      className={cn(
        'mercury-module',
        getMercuryFocusClasses(focusLevel),
        'absolute bg-white rounded-xl shadow-lg border border-slate-200 min-w-[240px] max-w-[320px]',
        'cursor-move hover:shadow-xl transition-all duration-300'
      )}
      style={{ 
        left: card.position.x, 
        top: card.position.y 
      }}
      whileHover={{ scale: 1.02, y: -4 }}
      drag
      dragMomentum={false}
      onDragEnd={(event, info) => {
        const newPosition = {
          x: card.position.x + info.offset.x,
          y: card.position.y + info.offset.y
        }
        onMove?.(newPosition)
      }}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-900 text-sm">
            {card.content.title}
          </h3>
          <div className="flex items-center space-x-1">
            {/* Focus level controls */}
            {(['fog', 'ambient', 'focused'] as FocusLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => handleFocusChange(level)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-200',
                  focusLevel === level ? 'bg-blue-500' : 'bg-slate-300'
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {card.content.imageUrl && (
          <img 
            src={card.content.imageUrl} 
            alt={card.content.title}
            className="w-full h-32 object-cover rounded-lg mb-3"
          />
        )}
        
        {card.content.description && (
          <p className="text-sm text-slate-600 mb-3">
            {card.content.description}
          </p>
        )}

        {card.content.price && (
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900">
              {card.content.price}
            </span>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onDelete}
                className="text-xs text-slate-500 hover:text-red-500 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connection points */}
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 hover:opacity-100 transition-opacity" />
    </motion.div>
  )
}
```

### **Day 11-14: Spatial Intelligence**

#### **9. Add Collision Detection**
```typescript
// lib/mercury-spatial.ts
import { MercuryCard, Point } from './mercury-types'

export function detectCollisions(cards: MercuryCard[]): Array<[string, string]> {
  const collisions: Array<[string, string]> = []
  
  for (let i = 0; i < cards.length; i++) {
    for (let j = i + 1; j < cards.length; j++) {
      if (isColliding(cards[i], cards[j])) {
        collisions.push([cards[i].id, cards[j].id])
      }
    }
  }
  
  return collisions
}

function isColliding(card1: MercuryCard, card2: MercuryCard): boolean {
  const padding = 20
  const card1Bounds = {
    left: card1.position.x,
    right: card1.position.x + 240 + padding,
    top: card1.position.y,
    bottom: card1.position.y + 200 + padding
  }
  
  const card2Bounds = {
    left: card2.position.x,
    right: card2.position.x + 240 + padding,
    top: card2.position.y,
    bottom: card2.position.y + 200 + padding
  }
  
  return !(card1Bounds.right < card2Bounds.left || 
           card1Bounds.left > card2Bounds.right || 
           card1Bounds.bottom < card2Bounds.top || 
           card1Bounds.top > card2Bounds.bottom)
}

export function findOptimalPosition(
  preferredPosition: Point, 
  existingCards: MercuryCard[],
  canvasSize: { width: number; height: number }
): Point {
  const gridSize = 20
  const maxAttempts = 100
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const testPosition = {
      x: Math.round(preferredPosition.x / gridSize) * gridSize,
      y: Math.round((preferredPosition.y + attempt * 50) / gridSize) * gridSize
    }
    
    const testCard: MercuryCard = {
      id: 'test',
      position: testPosition,
      // ... other required properties
    } as MercuryCard
    
    if (!existingCards.some(card => isColliding(testCard, card))) {
      return testPosition
    }
  }
  
  return preferredPosition
}
```

## 🧠 **Phase 3: Intelligence Systems (Week 3-4)**

### **Advanced Context Detection**
```typescript
// lib/mercury-context-engine.ts
interface ContextPattern {
  pattern: RegExp
  type: 'housing' | 'travel' | 'shopping' | 'dining'
  confidence: number
  entityExtractor: (match: RegExpMatchArray) => Entity[]
}

const CONTEXT_PATTERNS: ContextPattern[] = [
  {
    pattern: /look(?:ing)?\s+(?:in|at|for)\s+([A-Z][a-zA-Z\s]+(?:,\s*[A-Z]{2})?)/gi,
    type: 'housing',
    confidence: 0.9,
    entityExtractor: (match) => [{
      text: match[1],
      type: 'location',
      confidence: 0.95,
      position: [match.index!, match.index! + match[0].length]
    }]
  },
  {
    pattern: /(?:find|search|looking for)\s+(?:apartments?|homes?|housing|places?)\s+(?:in|at|near)\s+([A-Z][a-zA-Z\s]+)/gi,
    type: 'housing',
    confidence: 0.95,
    entityExtractor: (match) => [{
      text: match[1],
      type: 'location',
      confidence: 0.9,
      position: [match.index!, match.index! + match[0].length]
    }]
  }
  // Add more patterns for travel, shopping, etc.
]

export function analyzeMessage(message: string): ContextTrigger[] {
  const triggers: ContextTrigger[] = []
  
  for (const pattern of CONTEXT_PATTERNS) {
    const matches = [...message.matchAll(pattern.pattern)]
    
    for (const match of matches) {
      const entities = pattern.entityExtractor(match)
      const trigger: ContextTrigger = {
        type: pattern.type,
        entities,
        confidence: pattern.confidence,
        suggestedActions: generateActionsForType(pattern.type, entities),
        location: entities.find(e => e.type === 'location')?.text
      }
      
      triggers.push(trigger)
    }
  }
  
  return triggers
}
```

## 📋 **Success Metrics & Testing**

### **Phase 1 Success Criteria:**
- [ ] Users can drag apartment listings
- [ ] Drop zones highlight on drag over
- [ ] New cards spawn on drop with Mercury animations
- [ ] Cards display listing information correctly

### **Phase 2 Success Criteria:**
- [ ] Cards can be moved around canvas
- [ ] Focus levels work (fog/ambient/focused)
- [ ] Collision detection prevents overlaps
- [ ] Cards connect with visual relationships

### **Phase 3 Success Criteria:**
- [ ] Context detection works for multiple scenarios
- [ ] Real-time content generation from API
- [ ] Progressive disclosure based on focus level
- [ ] Personalized results and recommendations

## 🎯 **Immediate Next Steps**

1. **Fix Node.js version** (immediate blocker)
2. **Install drag & drop dependencies**
3. **Create basic drag functionality for listings**
4. **Add flow canvas with drop zones**
5. **Implement card spawning with Mercury animations**

This action plan provides a clear path from the current 40% complete state to a fully functional contextual computing interface that matches the sophisticated interaction patterns shown in your original analysis.

---

**Ready to begin implementation?** Start with fixing the Node.js version, then proceed through Phase 1 day by day. 