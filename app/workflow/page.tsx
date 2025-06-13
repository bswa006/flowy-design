"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// Mercury OS Spatial Computing - Remove old scroll animation globals
// Add Mercury spatial state management
declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

// Import our clean Mercury card components
import { ProductCard } from "@/components/mercury/product-card"
import { MusicCard } from "@/components/mercury/music-card"
import { MessageCard } from "@/components/mercury/message-card"
import { LocationCard } from "@/components/mercury/location-card"

export default function WorkflowPage() {
  // Sample data for each card type - 7 total steps
  const workflowSteps = [
    {
      id: 'location-starbucks',
      title: 'Find Location',
      description: 'Discover nearby places and businesses',
      component: LocationCard,
      data: {
        title: "Starbucks Reserve",
        type: "Coffee Shop",
        address: "1912 Pike Place, Seattle, WA 98101",
        distance: "0.3 miles",
        rating: 4.8,
        status: "open" as const
      },
      intent: "starbucks-reserve-location",
      size: "compact" as const,
      width: "w-80"
    },
    {
      id: 'message-danny',
      title: 'Handle Communications',
      description: 'Manage conversations and messages',
      component: MessageCard,
      data: {
        contactName: "Danny Trinh",
        contactHandle: "@dtrinh",
        avatar: "https://i.pravatar.cc/40?u=danny",
        lastMessage: "Let me get back to you on that. My schedule is kinda crazy right now with Mercury.",
        timestamp: "Mon 11:26 PM",
        platform: "Twitter Conversation",
        status: "unread" as const,
        messages: [
          {
            text: "Let me get back to you on that. My schedule is kinda crazy right now with Mercury.",
            timestamp: "Mon 11:26 PM",
            isOwn: false
          },
          {
            text: "Haha. Oh man",
            timestamp: "Mon 11:30 PM", 
            isOwn: true
          },
          {
            text: "I'm excited to see this beast",
            timestamp: "Mon 11:50 PM",
            isOwn: true
          }
        ]
      },
      intent: "danny-twitter-conversation",
      size: "standard" as const,
      width: "w-96"
    },
    {
      id: 'music-taeyeon',
      title: 'Control Media',
      description: 'Manage music and entertainment',
      component: MusicCard,
      data: {
        title: "Four Seasons",
        artist: "Taeyeon",
        album: "Daily Mix 1",
        platform: "Music from Spotify",
        duration: "3:42",
        currentTime: "1:34",
        progress: 40,
        artwork: "https://i.scdn.co/image/ab67616d00001e02c8a11e48c91a982d086afc69",
        status: "paused" as const,
        playlist: "Daily Mix 1"
      },
      intent: "four-seasons-spotify",
      size: "compact" as const,
      width: "w-80"
    },
    {
      id: 'product-balenciaga',
      title: 'Browse Products',
      description: 'Explore and purchase items',
      component: ProductCard,
      data: {
        title: "Black Bonded Speed Sneakers",
        brand: "Balenciaga",
        price: "$795",
        originalPrice: "$950",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
        rating: 4,
        reviewCount: 127,
        status: "available" as const,
        sizes: ["7", "8", "9", "10", "11"],
        selectedSize: "8",
        category: "Sneakers",
        isWishlisted: false,
        shipping: {
          method: "Express Shipping",
          time: "2-3 days",
          cost: "Free"
        }
      },
      intent: "balenciaga-speed-sneakers",
      size: "expanded" as const,
      width: "w-[28rem]"
    },
    {
      id: 'location-blue-bottle',
      title: 'Discover More Places',
      description: 'Find additional nearby locations',
      component: LocationCard,
      data: {
        title: "Blue Bottle Coffee",
        type: "Cafe",
        address: "300 Broadway, Oakland, CA",
        distance: "1.2 miles",
        rating: 4.6,
        status: "open" as const
      },
      intent: "blue-bottle-cafe",
      size: "compact" as const,
      width: "w-80"
    },
    {
      id: 'music-weeknd',
      title: 'Expand Media Library',
      description: 'Discover more entertainment options',
      component: MusicCard,
      data: {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        platform: "Apple Music",
        duration: "3:20",
        currentTime: "1:45",
        progress: 52,
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        status: "playing" as const,
        playlist: "Weekend Vibes"
      },
      intent: "weekend-vibes-music",
      size: "compact" as const,
      width: "w-80"
    },
    {
      id: 'message-team',
      title: 'Team Collaboration',
      description: 'Connect with your team members',
      component: MessageCard,
      data: {
        contactName: "Sarah Chen",
        contactHandle: "@sarahc",
        avatar: "https://i.pravatar.cc/40?u=sarah",
        lastMessage: "The new Mercury components look amazing! Great work on the workflow animations.",
        timestamp: "Now",
        platform: "Slack",
        status: "unread" as const,
        messages: [
          {
            text: "Hey! How's the workflow component coming along?",
            timestamp: "2:15 PM",
            isOwn: false
          },
          {
            text: "Just finished implementing the horizontal scroll. It's looking great!",
            timestamp: "2:18 PM",
            isOwn: true
          },
          {
            text: "The new Mercury components look amazing! Great work on the workflow animations.",
            timestamp: "Now",
            isOwn: false
          }
        ]
      },
      intent: "team-collaboration-slack",
      size: "standard" as const,
      width: "w-96"
    }
  ]

  // Mercury OS State Management
  const [currentStep, setCurrentStep] = useState(0)
  const [visibleCards, setVisibleCards] = useState([0]) // Progressive reveal
  const [manualPosition, setManualPosition] = useState(0) // Manual scroll position
  const [isDragging, setIsDragging] = useState(false)
  const [hasDragged, setHasDragged] = useState(false) // Track if user actually dragged
  const [dragStart, setDragStart] = useState({ x: 0, position: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Wu Wei Daoist Easing - Natural deceleration curves
  const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] // Settles into stillness
  const wuWeiSlowEasing = [0.15, 0.35, 0.25, 0.96] // Even more natural for major transitions

  // Calculate Mercury Flow positioning - intelligent spatial arrangement
  const calculateFlowPosition = () => {
    if (typeof window === 'undefined') return manualPosition
    
    // If user is manually controlling, use manual position
    if (isDragging || Math.abs(manualPosition) > 10) {
      return manualPosition
    }
    
    const viewportWidth = window.innerWidth
    const cardSpacing = 32 // Space between cards
    
    // Calculate total width of visible cards
    let totalWidth = 0
    visibleCards.forEach((cardIndex) => {
      const cardWidth = getCardWidth(workflowSteps[cardIndex].width)
      totalWidth += cardWidth + cardSpacing
    })
    totalWidth -= cardSpacing // Remove last spacing
    
    // If cards fit in viewport, center them
    if (totalWidth <= viewportWidth - 128) { // 128px for padding
      return (viewportWidth - totalWidth) / 2 - 64 // 64px base padding
    }
    
    // Otherwise, position to show current card optimally
    let currentCardPosition = 64 // Start padding
    for (let i = 0; i < currentStep; i++) {
      if (visibleCards.includes(i)) {
        currentCardPosition += getCardWidth(workflowSteps[i].width) + cardSpacing
      }
    }
    
    // Position current card at 40% of viewport width
    const targetPosition = viewportWidth * 0.4
    return targetPosition - currentCardPosition
  }

  // Helper to get card width in pixels
  const getCardWidth = (widthClass: string) => {
    switch (widthClass) {
      case 'w-80': return 320
      case 'w-96': return 384
      case 'w-[28rem]': return 448
      default: return 320
    }
  }

  // Mercury OS Kiri Fog System - Subtle depth and focus
  const getKiriFogStyle = (cardIndex: number) => {
    const distanceFromActive = Math.abs(cardIndex - currentStep)
    const isActive = cardIndex === currentStep
    
    if (isActive) {
      return {
        opacity: 1,
        filter: 'blur(0px) brightness(1)',
        transform: 'scale(1) translateY(0px)',
        zIndex: 10
      }
    }
    
    // Kiri fog - subtle mist effect for non-active cards
    const fogOpacity = Math.max(0.4, 1 - (distanceFromActive * 0.2))
    const fogBlur = Math.min(3, distanceFromActive * 1.5)
    const fogBrightness = Math.max(0.7, 1 - (distanceFromActive * 0.1))
    const fogScale = Math.max(0.92, 1 - (distanceFromActive * 0.04))
    const fogY = distanceFromActive * 8
    
    return {
      opacity: fogOpacity,
      filter: `blur(${fogBlur}px) brightness(${fogBrightness})`,
      transform: `scale(${fogScale}) translateY(${fogY}px)`,
      zIndex: 10 - distanceFromActive
    }
  }

  // Calculate which card should be active based on current position
  const calculateActiveCard = (position: number) => {
    if (typeof window === 'undefined') return 0
    
    const viewportCenter = window.innerWidth / 2
    let cardPosition = 64 - position // Start position minus current offset
    
    for (let i = 0; i < visibleCards.length; i++) {
      const cardIndex = visibleCards[i]
      const cardWidth = getCardWidth(workflowSteps[cardIndex].width)
      const cardCenter = cardPosition + cardWidth / 2
      
      // If this card's center is closest to viewport center
      if (Math.abs(cardCenter - viewportCenter) < cardWidth / 2 + 32) {
        return cardIndex
      }
      
      cardPosition += cardWidth + 32 // Move to next card position
    }
    
    return currentStep
  }



  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on a card
    if ((e.target as HTMLElement).closest('[data-card-clickable]')) {
      return
    }
    
    setIsDragging(true)
    setHasDragged(false) // Reset drag flag
    setDragStart({
      x: e.clientX,
      position: manualPosition
    })
  }

  // Handle drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    const deltaX = e.clientX - dragStart.x
    
    // Only consider it a drag if moved more than 5 pixels
    if (Math.abs(deltaX) > 5) {
      setHasDragged(true)
    }
    
    const newPosition = dragStart.position + deltaX
    
    // Constrain dragging bounds
    const maxScroll = visibleCards.length * 400
    const constrainedPosition = Math.max(-maxScroll, Math.min(200, newPosition))
    
    setManualPosition(constrainedPosition)
    
    // Update active card based on position
    const newActiveCard = calculateActiveCard(constrainedPosition)
    if (newActiveCard !== currentStep && visibleCards.includes(newActiveCard)) {
      setCurrentStep(newActiveCard)
    }
  }

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add mouse move and up listeners to document when dragging
  useEffect(() => {
    if (isDragging) {
      const handleDocumentMouseMove = (e: MouseEvent) => {
        const deltaX = e.clientX - dragStart.x
        
        // Only consider it a drag if moved more than 5 pixels
        if (Math.abs(deltaX) > 5) {
          setHasDragged(true)
        }
        
        const newPosition = dragStart.position + deltaX
        
        const maxScroll = visibleCards.length * 400
        const constrainedPosition = Math.max(-maxScroll, Math.min(200, newPosition))
        
        setManualPosition(constrainedPosition)
        
        const newActiveCard = calculateActiveCard(constrainedPosition)
        if (newActiveCard !== currentStep && visibleCards.includes(newActiveCard)) {
          setCurrentStep(newActiveCard)
        }
      }
      
      const handleDocumentMouseUp = () => {
        setIsDragging(false)
      }
      
      document.addEventListener('mousemove', handleDocumentMouseMove)
      document.addEventListener('mouseup', handleDocumentMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove)
        document.removeEventListener('mouseup', handleDocumentMouseUp)
      }
    }
  }, [isDragging, dragStart, manualPosition, currentStep, visibleCards])

  // Mercury OS Navigation - Progressive Module Spawning
  const nextStep = () => {
    if (currentStep < workflowSteps.length - 1) {
      const newStep = currentStep + 1
      
      // Progressive reveal - spawn new module
      if (!visibleCards.includes(newStep)) {
        setVisibleCards(prev => [...prev, newStep])
      }
      
      setCurrentStep(newStep)
      // Reset manual position when using buttons
      setManualPosition(0)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      // Reset manual position when using buttons
      setManualPosition(0)
    }
  }

  const goToStep = (stepIndex: number) => {
    // Ensure all modules up to target are spawned
    const newVisibleCards = Array.from({ length: stepIndex + 1 }, (_, i) => i)
    setVisibleCards(newVisibleCards)
    setCurrentStep(stepIndex)
    // Reset manual position when using direct navigation
    setManualPosition(0)
  }

  // Handle card click navigation
  const handleCardClick = (cardIndex: number, e: React.MouseEvent) => {
    console.log('Card clicked:', cardIndex, 'Visible cards:', visibleCards)
    
    // Always spawn next card when any visible card is clicked
    const nextCardIndex = Math.max(...visibleCards) + 1
    
    if (nextCardIndex < workflowSteps.length && !visibleCards.includes(nextCardIndex)) {
      console.log('Spawning next card:', nextCardIndex)
      // Spawn the next card
      setVisibleCards(prev => [...prev, nextCardIndex])
      // Move to the newly spawned card
      setCurrentStep(nextCardIndex)
    } else if (visibleCards.includes(cardIndex)) {
      // If no more cards to spawn, just navigate to clicked card
      console.log('No more cards to spawn, navigating to:', cardIndex)
      setCurrentStep(cardIndex)
    }
    
    // Reset manual position for smooth auto-positioning
    setManualPosition(0)
  }

  // Mercury Module Variants - Elegant spawning animation
  const mercuryModuleVariants = {
    hidden: {
      x: 120,
      y: 20,
      opacity: 0,
      scale: 0.85,
      rotateY: 8,
      filter: "blur(6px)"
    },
    visible: (index: number) => ({
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.0,
        ease: wuWeiSlowEasing,
        
        // Staggered natural settling
        opacity: { 
          duration: 0.7,
          delay: 0.1,
          ease: wuWeiEasing
        },
        filter: {
          duration: 0.8,
          delay: 0.2,
          ease: wuWeiEasing
        },
        scale: {
          duration: 0.9,
          delay: 0.1,
          ease: wuWeiEasing
        },
        rotateY: {
          duration: 1.1,
          delay: 0.05,
          ease: wuWeiSlowEasing
        }
      }
    })
  }

  const flowPosition = calculateFlowPosition()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Mercury OS Header */}
      <div className="px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: wuWeiEasing }}
          className="max-w-4xl"
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-3">Mercury Workflow</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Experience progressive module spawning with Wu Wei motion principles. 
            Each step reveals new capabilities in spatial harmony.
          </p>
        </motion.div>
      </div>

             {/* Mercury Flow Container */}
       <div 
         className="relative overflow-hidden cursor-grab active:cursor-grabbing" 
         style={{ perspective: '1200px' }}
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
       >
        <motion.div
          ref={containerRef}
          className="flex items-start py-12 select-none"
          animate={{ x: flowPosition }}
          transition={{ 
            duration: isDragging ? 0 : 0.9, 
            ease: wuWeiSlowEasing,
            type: "tween"
          }}
          style={{ 
            willChange: 'transform',
            transformStyle: 'preserve-3d'
          }}
        >
          {visibleCards.map((cardIndex) => {
            const stepData = workflowSteps[cardIndex]
            const CardComponent = stepData.component as any
            const kiriFogStyle = getKiriFogStyle(cardIndex)
            
            return (
              <motion.div
                key={stepData.id}
                custom={cardIndex}
                variants={mercuryModuleVariants}
                initial="hidden"
                animate="visible"
                data-card-clickable="true"
                className={`flex-shrink-0 ${stepData.width} mr-8 relative cursor-pointer`}
                style={{
                  ...kiriFogStyle,
                  transformStyle: 'preserve-3d',
                  willChange: 'transform, opacity, filter'
                }}
                onClick={(e) => {
                  e.stopPropagation() // Prevent container drag handlers
                  handleCardClick(cardIndex, e)
                }}
              >
                {/* Mercury Module Container */}
                <motion.div 
                  className="relative"
                  animate={{
                    // Subtle active card enhancement
                    boxShadow: cardIndex === currentStep 
                      ? '0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1)'
                      : '0 8px 20px -4px rgba(0, 0, 0, 0.08)',
                    y: cardIndex === currentStep ? -4 : 0
                  }}
                  transition={{
                    duration: 0.8,
                    ease: wuWeiEasing
                  }}
                >
                  <CardComponent
                    intent={stepData.intent}
                    focusLevel={cardIndex === currentStep ? "focused" : "ambient"}
                    size={stepData.size}
                    data={stepData.data}
                    className={`
                      h-full transition-all duration-700 transform-gpu
                      ${cardIndex === currentStep 
                        ? 'ring-1 ring-slate-200/50' 
                        : ''
                      }
                    `}
                    isInteractive={cardIndex === currentStep}
                  />
                  
                  {/* Click to Continue Indicator - Only show on active card if more cards available */}
                  {cardIndex === currentStep && visibleCards.length < workflowSteps.length && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-blue-500/10 rounded-xl border-2 border-blue-500/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-blue-200/50">
                        <div className="flex items-center space-x-2 text-blue-700">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          <span className="text-sm font-medium">Click to reveal next</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Permanent subtle indicator for active card */}
                  {cardIndex === currentStep && visibleCards.length < workflowSteps.length && (
                    <motion.div
                      className="absolute top-4 right-4 w-8 h-8 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/30"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.7, 1, 0.7]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: wuWeiEasing
                      }}
                    >
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </motion.div>
                  )}
                  
                  {/* Mercury Module Badge */}
                  <motion.div 
                    className={`
                      absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      backdrop-blur-sm border border-white/30 shadow-lg
                      ${cardIndex === currentStep 
                        ? 'bg-slate-900/90 text-white' 
                        : cardIndex < currentStep 
                          ? 'bg-emerald-500/90 text-white' 
                          : 'bg-white/90 text-slate-600'
                      }
                    `}
                    animate={{ 
                      scale: cardIndex === currentStep ? 1.1 : 1,
                      rotate: cardIndex === currentStep ? [0, 3, -2, 0] : 0,
                    }}
                    transition={{
                      duration: 1.0,
                      ease: wuWeiSlowEasing,
                      rotate: {
                        duration: 1.5,
                        ease: wuWeiSlowEasing
                      }
                    }}
                    key={`badge-${stepData.id}-${currentStep}`}
                  >
                    {cardIndex < currentStep ? '✓' : cardIndex + 1}
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Mercury OS Step Indicator */}
      <motion.div
        className="flex items-center justify-center px-8 py-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.3,
          ease: wuWeiEasing
        }}
      >
        <div className="flex items-center space-x-2 px-6 py-3 bg-white/80 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-xl">
          <span className="text-sm font-semibold text-slate-700">
            {currentStep + 1} / {workflowSteps.length}
          </span>
          <span className="text-xs text-slate-500 ml-2">
            Click cards to navigate • Drag to explore
          </span>
        </div>
      </motion.div>

      {/* Mercury OS Completion State */}
      <AnimatePresence>
        {currentStep === workflowSteps.length - 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.8, delay: 0.3, ease: wuWeiSlowEasing }}
            className="px-8 pb-16"
          >
            <div className="max-w-md mx-auto bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50 rounded-2xl p-8 text-center backdrop-blur-sm">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Mercury Flow Complete</h3>
              <p className="text-slate-600 mb-6">
                All {workflowSteps.length} modules experienced in spatial harmony.
              </p>
              <button
                onClick={() => {
                  setVisibleCards([0])
                  setCurrentStep(0)
                }}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Return to Origin</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mercury OS Footer Navigation */}
      <div className="px-8 py-12 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200/50">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.8, 
            delay: 0.5,
            ease: wuWeiEasing
          }}
        >
          <Link 
            href="/"
            className="inline-flex items-center space-x-3 text-slate-600 hover:text-slate-900 transition-all duration-400 group"
          >
            <motion.div 
              className="p-3 rounded-full bg-white group-hover:bg-slate-50 transition-all duration-400 shadow-sm group-hover:shadow-md"
              whileHover={{ 
                scale: 1.1, 
                rotate: [0, -5, 0],
                transition: { duration: 0.5, ease: wuWeiEasing }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </motion.div>
            <span className="font-medium text-lg">Return to Timeline</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
} 