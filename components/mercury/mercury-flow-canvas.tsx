"use client"

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMercuryDrop, getMercuryDropZoneStyles } from '@/lib/mercury-drag-system'
import { MercuryCard, DragItem, Point, ApartmentListing } from '@/lib/mercury-types'
import { cn } from '@/lib/utils'

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const
const wuWeiSlowEasing = [0.15, 0.35, 0.25, 0.96] as const
const wuWeiSpringEasing = [0.34, 1.56, 0.64, 1] as const

interface MercuryFlowCanvasProps {
  intent: string
  children?: React.ReactNode
  onCardCreated?: (card: MercuryCard) => void
  onCardRemoved?: (cardId: string) => void
  className?: string
}

export function MercuryFlowCanvas({ 
  intent, 
  children, 
  onCardCreated,
  onCardRemoved,
  className = ''
}: MercuryFlowCanvasProps) {
  const [cards, setCards] = useState<MercuryCard[]>([])
  const [dragPreview, setDragPreview] = useState<{ position: Point; item: DragItem } | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleDrop = useCallback((item: DragItem, position: Point) => {
    console.log('🎯 CANVAS RECEIVED DROP:', { item, position })
    console.log('🎯 ITEM TYPE:', item.type, 'DATA TYPE:', item.data.type)
    
    // Handle housing search action - create unified search results card
    if (item.type === 'action-card' && (item.data.type === 'housing-search' || item.data.type === 'housing')) {
      const housingListings = [
        {
          id: '1',
          name: '7 Creekside',
          bedrooms: '4br',
          bathrooms: '2b',
          price: '$9,000/month',
          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=250&fit=crop&auto=format',
          description: 'Modern apartment with city views'
        },
        {
          id: '2',
          name: '64 Church St.',
          bedrooms: '4br', 
          bathrooms: '2b',
          price: '$12,000/month',
          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=250&fit=crop&auto=format',
          description: 'Luxury downtown living'
        },
        {
          id: '3',
          name: 'The Rustic Swag',
          bedrooms: '4br',
          bathrooms: '2b', 
          price: '$20,000/month',
          image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=250&fit=crop&auto=format',
          description: 'Premium luxury apartment'
        },
        {
          id: '4',
          name: 'Noobles Ave.',
          bedrooms: '4br',
          bathrooms: '2b',
          price: '$11,000/month', 
          image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&h=250&fit=crop&auto=format',
          description: 'Cozy residential apartment'
        }
      ]

      // Create single unified search results card  
      // CENTER THE CARD ON DROP POINT (search results are ~425px wide, ~300px tall)
      const finalPosition = {
        x: position.x - 212, // Half of card width (425/2)
        y: position.y - 150  // Half of card height (300/2)
      }
      
      console.log('🎯 CREATING CENTERED SEARCH RESULTS CARD:', finalPosition)
      console.log('🎯 DROP POSITION WAS:', position)
      console.log('🎯 OFFSET: -212px left, -150px up to center the card')
      
      const searchResultsCard: MercuryCard = {
        id: `search-results-${Date.now()}`,
        type: 'housing-listing' as const,
        position: finalPosition,
        content: {
          title: 'Find homes in Mountain View, CA',
          description: `${housingListings.length} results found`,
          metadata: { 
            searchQuery: item.data.title,
            listings: housingListings,
            searchType: 'housing-search'
          }
        },
        connections: [],
        focusLevel: 'focused' as const,
        intent: `${intent}-search-results`,
        metadata: {
          sourceType: item.type,
          sourceContext: item.sourceContext,
          createdAt: Date.now(),
          searchResults: housingListings
        }
      }

      setCards(prev => [...prev, searchResultsCard])
      onCardCreated?.(searchResultsCard)
          } else if (item.type === 'action-card') {
      // Handle other action cards as single cards
      // CENTER THE CARD ON DROP POINT (action cards are ~280px wide, ~150px tall)
      const actionCardPosition = {
        x: position.x - 140, // Half of card width (280/2)
        y: position.y - 75   // Half of card height (150/2)
      }
      
      console.log('🎯 CREATING CENTERED ACTION CARD:', actionCardPosition)
      console.log('🎯 DROP POSITION WAS:', position)
      console.log('🎯 OFFSET: -140px left, -75px up to center the card')
      
      const newCard: MercuryCard = {
        id: `action-card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'action-result',
        position: actionCardPosition,
        content: {
          title: item.data.title || 'Action Result',
          description: item.data.description || `${item.data.type} action`,
          metadata: { ...item.data }
        },
        connections: [],
        focusLevel: 'focused',
        intent: `${intent}-action-card`,
        metadata: {
          sourceType: item.type,
          sourceContext: item.sourceContext,
          createdAt: Date.now()
        }
      }

      setCards(prev => [...prev, newCard])
      onCardCreated?.(newCard)
    } else {
      // Handle single item drops (existing logic)
      // CENTER THE CARD ON DROP POINT (single cards are ~280px wide, ~200px tall)
      const singleCardPosition = {
        x: position.x - 140, // Half of card width (280/2)
        y: position.y - 100  // Half of card height (200/2)
      }
      
      console.log('🎯 CREATING CENTERED SINGLE CARD:', singleCardPosition)
      console.log('🎯 DROP POSITION WAS:', position)
      console.log('🎯 OFFSET: -140px left, -100px up to center the card')
      
      const newCard: MercuryCard = {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: item.type === 'search-result' ? 'housing-listing' : 'action-result',
        position: singleCardPosition,
        content: {
          title: item.data.name || item.data.title || 'Untitled',
          description: item.data.bedrooms && item.data.bathrooms 
            ? `${item.data.bedrooms}, ${item.data.bathrooms}` 
            : item.data.description || '',
          price: item.data.price || '',
          imageUrl: item.data.image,
          metadata: { ...item.data }
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
    }
    
    // Clear drag preview
    setDragPreview(null)
  }, [intent, onCardCreated])

  const handleCardMove = useCallback((cardId: string, newPosition: Point) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, position: newPosition }
        : card
    ))
  }, [])

  const handleCardRemove = useCallback((cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
    onCardRemoved?.(cardId)
  }, [onCardRemoved])

  const canvasId = `${intent}-flow-canvas`
  const { isOver, canDrop, drop } = useMercuryDrop(handleDrop, canvasId)

  const dropZoneStyles = getMercuryDropZoneStyles(isOver, canDrop)

  return (
    <motion.div
      ref={(node) => {
        drop(node)
        if (node) {
          // Ensure the node has the correct ID for drop targeting
          node.id = canvasId
        }
      }}
      data-intent={intent}
      id={canvasId}
      className={cn(
        'relative h-screen w-full overflow-hidden',
        'bg-gradient-to-br from-slate-50/50 to-white/80 backdrop-blur-sm',
        className
      )}
      style={dropZoneStyles}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        ease: wuWeiEasing
      }}
    >
      {/* Canvas Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="mercury-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1" fill="#64748b" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mercury-grid)" />
        </svg>
      </div>

      {/* Content area */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Spawned Cards */}
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <MercuryContextualCard
            key={card.id}
            card={card}
            onMove={(newPosition) => handleCardMove(card.id, newPosition)}
            onRemove={() => handleCardRemove(card.id)}
          />
        ))}
      </AnimatePresence>

      {/* Drop instruction overlay */}
      <AnimatePresence>
        {isOver && canDrop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center bg-blue-50/40 backdrop-blur-sm z-20"
            transition={{ duration: 0.3, ease: wuWeiEasing }}
          >
            <motion.div
              className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-blue-200/50"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: wuWeiSpringEasing }}
            >
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: wuWeiEasing
                  }}
                >
                  <div className="w-6 h-6 bg-white rounded-full" />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Drop to Create Card
                </h3>
                <p className="text-sm text-slate-600">
                  Release to spawn a new contextual card in your flow
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {cards.length === 0 && !isOver && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, ease: wuWeiEasing }}
        >
          <div className="text-center max-w-md">
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full mx-auto mb-6 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: wuWeiEasing
              }}
            >
              <div className="w-8 h-8 bg-white/60 rounded-full" />
            </motion.div>
            <h3 className="text-xl font-semibold text-slate-700 mb-3">
              Mercury Flow Canvas
            </h3>
            <p className="text-slate-500 leading-relaxed">
              Drag apartment listings or actions here to create contextual cards. 
              Organize your spatial computing interface with Wu Wei principles.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

/**
 * Individual Mercury Contextual Card Component
 */
interface MercuryContextualCardProps {
  card: MercuryCard
  onMove?: (position: Point) => void
  onRemove?: () => void
  onFocusChange?: (level: 'focused' | 'ambient' | 'fog') => void
}

function MercuryContextualCard({ 
  card, 
  onMove, 
  onRemove,
  onFocusChange
}: MercuryContextualCardProps) {
  const [focusLevel, setFocusLevel] = useState(card.focusLevel)
  const [isDragging, setIsDragging] = useState(false)

  const handleFocusChange = (level: 'focused' | 'ambient' | 'fog') => {
    setFocusLevel(level)
    onFocusChange?.(level)
  }

  const isSearchResults = card.intent.includes('search-results')
  const listings = card.metadata?.searchResults || []

  return (
    <motion.div
      data-intent={card.intent}
      className={cn(
        'bg-white rounded-xl shadow-lg border border-slate-200',
        'cursor-move hover:shadow-xl z-30',
        isDragging ? 'transition-none' : 'transition-all duration-300',
        isSearchResults ? 'min-w-[400px] max-w-[450px]' : 'min-w-[240px] max-w-[320px]',
        focusLevel === 'focused' ? 'opacity-100' : 
        focusLevel === 'ambient' ? 'opacity-85' : 'opacity-60'
      )}

      initial={{ 
        x: card.position.x,
        y: card.position.y,
        scale: 0.8, 
        opacity: 0, 
        rotateY: -15,
        filter: "blur(6px)"
      }}
      animate={{ 
        x: card.position.x,
        y: card.position.y,
        scale: 1, 
        opacity: focusLevel === 'focused' ? 1 : focusLevel === 'ambient' ? 0.85 : 0.6,
        rotateY: 0,
        filter: focusLevel === 'fog' ? "blur(1px)" : "blur(0px)"
      }}
      onAnimationStart={() => {
        console.log('🎯 CARD ANIMATION START:', card.id, 'POSITION:', card.position)
      }}
      exit={{ 
        scale: 0.8, 
        opacity: 0, 
        rotateY: 15,
        filter: "blur(4px)",
        transition: { duration: 0.4, ease: wuWeiEasing }
      }}
      transition={{ 
        duration: 0.8,
        ease: wuWeiEasing,
        opacity: { duration: 0.6, ease: wuWeiEasing },
        filter: { duration: 0.6, ease: wuWeiEasing },
        x: { duration: 0.3, ease: wuWeiEasing },
        y: { duration: 0.3, ease: wuWeiEasing }
      }}
      style={{ 
        position: 'absolute',
        filter: focusLevel === 'fog' ? 'blur(1px)' : 'none',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
      whileHover={{ 
        scale: 1.01,
        transition: { duration: 0.2, ease: wuWeiEasing }
      }}
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={false}
      whileDrag={{
        scale: 1.05,
        rotate: 2,
        zIndex: 999,
        transition: { duration: 0.1 }
      }}
      onDragStart={(event, info) => {
        setIsDragging(true)
        document.body.style.setProperty('--mercury-performance-mode', 'true')
      }}
      onDragEnd={(event, info) => {
        setIsDragging(false)
        document.body.style.removeProperty('--mercury-performance-mode')
        
        // Use the reliable offset from drag info
        const newPosition = {
          x: Math.max(0, card.position.x + info.offset.x),
          y: Math.max(0, card.position.y + info.offset.y)
        }
        
        onMove?.(newPosition)
      }}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isSearchResults && (
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              </div>
            )}
            <h3 className="font-semibold text-slate-900 text-sm">
              {card.content.title}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            {/* Focus level controls */}
            {(['fog', 'ambient', 'focused'] as const).map((level) => (
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
      <div className={cn('p-4', isSearchResults ? 'max-h-[400px] overflow-y-auto' : '')}>
        {isSearchResults ? (
          /* Search Results Layout */
          <div className="space-y-3">
            {isDragging ? (
              /* Simplified view during drag */
              <div className="text-center py-8">
                <div className="text-sm text-slate-600">
                  {listings.length} search results
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Release to view details
                </div>
              </div>
            ) : (
              /* Full detailed view when not dragging */
              listings.map((listing: any, index: number) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.2, 
                  delay: index * 0.05, 
                  ease: wuWeiEasing 
                }}
                className="flex space-x-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors duration-150"
              >
                <div className="w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={listing.image} 
                    alt={listing.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">
                        {listing.bedrooms}, {listing.bathrooms}
                      </p>
                      <h4 className="font-semibold text-slate-900 text-sm mb-1">
                        {listing.name}
                      </h4>
                      <p className="font-bold text-slate-900 text-sm">
                        {listing.price}
                      </p>
                    </div>
                  </div>
                                 </div>
               </motion.div>
               ))
             )}
             
             {!isDragging && (
               <>
                 {/* Action Buttons */}
                 <div className="flex space-x-2 pt-4 border-t border-slate-100">
                   <button className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                     Add all to flow
                   </button>
                   <button className="flex-1 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">
                     Find some more
                   </button>
                 </div>
                 
                 <button 
                   onClick={onRemove}
                   className="w-full py-2 text-xs text-slate-500 hover:text-red-500 transition-colors"
                 >
                   Remove card
                 </button>
               </>
             )}
          </div>
        ) : (
          /* Regular Card Layout */
          <>
            {/* Apartment Image */}
            {card.content.imageUrl && (
              <motion.div 
                className="w-full h-32 rounded-lg overflow-hidden mb-3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: wuWeiEasing }}
              >
                <img 
                  src={card.content.imageUrl} 
                  alt={card.content.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
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
                    onClick={onRemove}
                    className="text-xs text-slate-500 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Connection points */}
      <div className="absolute -right-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute -left-2 top-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  )
} 