"use client"

import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import { getMercuryFocusClasses } from "@/lib/mercury-tokens"
import { Mic, Plus, Send } from "lucide-react"
import { MercuryDraggableAction } from './mercury-draggable-action'
import { createPortal } from 'react-dom'

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const // Natural settling
const wuWeiSlowEasing = [0.15, 0.35, 0.25, 0.96] as const // Deep tranquility
const wuWeiSpringEasing = [0.34, 1.56, 0.64, 1] as const // Natural bounce

interface ChatMessage {
  id: string
  author: string
  content: string
  avatar: string
  timestamp?: string
}

interface SelectedText {
  text: string
  messageId: string
  range: Range | null
  position: { x: number; y: number }
}

interface MercuryChatModuleProps {
  intent: string
  focusLevel?: 'focused' | 'ambient' | 'fog'
  onActionDetected?: (action: string, context: string) => void
  onActionUsed?: (actionId: string) => void
  className?: string
}

// Dynamic text analysis - detects entities and generates actions
const analyzeSelectedText = (text: string, context: string) => {
  const trimmedText = text.trim().toLowerCase()
  const actions: Array<{
    id: string
    title: string
    type: 'housing-search' | 'location' | 'photos' | 'person' | 'general'
    data: any
  }> = []

  // Create consistent IDs based on content, not timestamps
  const createActionId = (type: string, text: string) => {
    const cleanText = text.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    return `${type}-${cleanText}`
  }

  // Location detection patterns
  const locationPatterns = [
    /\b(mountain view|palo alto|san francisco|sf|berkeley|oakland|san jose|cupertino|sunnyvale|santa clara|redwood city|menlo park)\b/i,
    /\b\w+\s+(city|town|village|area|neighborhood)\b/i,
    /\b\w+,?\s*(ca|california|ny|new york|tx|texas)\b/i
  ]

  // Person name patterns
  const namePatterns = [
    /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/, // First Last
    /\b(jason|devin|victoria|marisa|alex|sarah|mike|john|jane)\b/i // Common names
  ]

  // Action patterns
  const actionPatterns = [
    /\b(find|search|look for|locate|get|show me)\s+(.+)/i,
    /\b(book|reserve|schedule|plan)\s+(.+)/i,
    /\b(call|contact|message|email)\s+(.+)/i
  ]

  // Analyze for locations
  if (locationPatterns.some(pattern => pattern.test(text))) {
    const location = text.replace(/\b(in|at|to|near)\b/gi, '').trim()
    
    actions.push({
      id: createActionId('find-homes', location),
      title: `Find homes in ${location}`,
      type: 'housing-search',
      data: { location, type: 'housing-search' }
    })
    
    actions.push({
      id: createActionId('locate', location),
      title: `Get directions to ${location}`,
      type: 'location',
      data: { location, type: 'location' }
    })
    
    actions.push({
      id: createActionId('photos', location),
      title: `Find photos of ${location}`,
      type: 'photos',
      data: { location, type: 'photos' }
    })
  }

  // Analyze for names
  if (namePatterns.some(pattern => pattern.test(text))) {
    actions.push({
      id: createActionId('contact', text),
      title: `Contact ${text}`,
      type: 'person',
      data: { person: text, type: 'contact' }
    })
    
    actions.push({
      id: createActionId('find-social', text),
      title: `Find ${text} on social media`,
      type: 'person',
      data: { person: text, type: 'social-search' }
    })
  }

  // Analyze for actions
  const actionMatch = actionPatterns.find(pattern => pattern.test(text))
  if (actionMatch) {
    const matches = text.match(actionMatch)
    if (matches && matches[2]) {
      actions.push({
        id: createActionId('action', matches[2]),
        title: `${matches[1]} ${matches[2]}`.replace(/\s+/g, ' ').trim(),
        type: 'general',
        data: { query: matches[2], action: matches[1], type: 'general-action' }
      })
    }
  }

  // If no specific patterns, create general actions
  if (actions.length === 0) {
    actions.push({
      id: createActionId('search', text),
      title: `Search for "${text}"`,
      type: 'general',
      data: { query: text, type: 'web-search' }
    })
    
    actions.push({
      id: createActionId('reminder', text),
      title: `Create reminder about "${text}"`,
      type: 'general',
      data: { content: text, type: 'reminder' }
    })
  }

  return actions
}

const SAMPLE_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    author: 'Devin',
    content: 'You guys these prices are ridiculous!!',
    avatar: 'https://i.pravatar.cc/40?u=devin'
  },
  {
    id: '2', 
    author: 'Devin',
    content: 'The second one is literally called 777 Expense Way I am SCREMING sdjkafffjdjfdjdj',
    avatar: 'https://i.pravatar.cc/40?u=devin'
  },
  {
    id: '3',
    author: 'Victoria',
    content: 'Jason did you rig the results or something there\'s no way everything is this expensive –',
    avatar: 'https://i.pravatar.cc/40?u=victoria'
  },
  {
    id: '4',
    author: 'Marisa', 
    content: 'Knowing Jason he 101% did lol',
    avatar: 'https://i.pravatar.cc/40?u=marisa'
  },
  {
    id: '5',
    author: 'Marisa',
    content: 'Look at the search query it\'s literally "Find 4 bedroom apartments in San Francisco" I\'m really not trying to be slick y\'all',
    avatar: 'https://i.pravatar.cc/40?u=marisa'
  },
  {
    id: '6',
    author: 'Marisa',
    content: 'brb changing the playlist because we can\'t keep listening to Blackpink',
    avatar: 'https://i.pravatar.cc/40?u=marisa'
  },
  {
    id: '7',
    author: 'Victoria',
    content: 'tbh we should just look in Mountain View instead because SF is just SF',
    avatar: 'https://i.pravatar.cc/40?u=victoria'
  }
]

export function MercuryChatModule({
  intent,
  focusLevel = 'ambient',
  onActionDetected,
  onActionUsed,
  className
}: MercuryChatModuleProps) {
  const [messages] = useState<ChatMessage[]>(SAMPLE_MESSAGES)
  const [selectedText, setSelectedText] = useState<SelectedText | null>(null)
  const [showActionPopup, setShowActionPopup] = useState(false)
  const [availableActions, setAvailableActions] = useState<any[]>([])
  const [usedActions, setUsedActions] = useState<Set<string>>(new Set())
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)
  const messageRefs = useRef<Map<string, HTMLElement>>(new Map())
  const chatModuleRef = useRef<HTMLDivElement>(null)
  const [modalAbsolutePosition, setModalAbsolutePosition] = useState({ x: 0, y: 0 })

  // Calculate absolute position for portal modal
  useEffect(() => {
    if (selectedText && showActionPopup && chatModuleRef.current) {
      const updateModalPosition = () => {
        const chatRect = chatModuleRef.current!.getBoundingClientRect()
        
        // Position modal at the RIGHT EDGE of chat module (not on selected text)
        const chatModuleWidth = 400 // Chat module is 400px wide
        const modalOffset = 20 // Small gap between chat and modal
        const absoluteX = chatRect.left + chatModuleWidth + modalOffset
        const absoluteY = chatRect.top + selectedText.position.y + 30 // Add 30px below selected text
        
        // Adjust Y position to prevent bottom cutoff and ensure visibility
        const modalHeight = 320 // Estimated modal height
        const modalWidth = 320 // w-80 = 320px
        const viewportHeight = window.innerHeight
        const viewportWidth = window.innerWidth
        
        const adjustedY = Math.min(absoluteY, viewportHeight - modalHeight - 20) // 20px margin from bottom
        const finalY = Math.max(60, adjustedY) // Minimum 60px from top
        
        // Adjust X position to ensure modal stays within viewport
        // Since modal uses translateX(-50%), we need to account for that
        const modalCenterX = absoluteX
        const modalLeftEdge = modalCenterX - modalWidth / 2
        const modalRightEdge = modalCenterX + modalWidth / 2
        
        let finalX = modalCenterX
        if (modalRightEdge > viewportWidth - 20) {
          // Modal would go off right edge, move it left
          finalX = viewportWidth - modalWidth / 2 - 20
        } else if (modalLeftEdge < 20) {
          // Modal would go off left edge, move it right
          finalX = modalWidth / 2 + 20
        }
        
        setModalAbsolutePosition({ x: finalX, y: finalY })
        
        console.log('🎯 MODAL POSITIONING (Right Edge):', {
          selectedTextPos: selectedText.position,
          chatRect: { left: chatRect.left, top: chatRect.top, width: chatModuleWidth },
          calculated: { x: absoluteX, y: absoluteY },
          adjusted: { x: finalX, y: finalY },
          viewport: { width: viewportWidth, height: viewportHeight },
          modalSize: { width: modalWidth, height: modalHeight },
          strategy: 'RIGHT_EDGE_OF_CHAT'
        })
      }

      // Initial calculation
      updateModalPosition()

      // Real-time position tracking with multiple methods
      let rafId: number
      let isTracking = true

      // Method 1: MutationObserver for style changes
      const mutationObserver = new MutationObserver(() => {
        if (isTracking) updateModalPosition()
      })

      // Method 2: Continuous tracking during transitions
      const trackPosition = () => {
        if (isTracking) {
          updateModalPosition()
          rafId = requestAnimationFrame(trackPosition)
        }
      }

      // Start tracking
      if (chatModuleRef.current) {
        // Watch for style changes on chat module
        mutationObserver.observe(chatModuleRef.current, {
          attributes: true,
          attributeFilter: ['style', 'class']
        })

        // Watch for style changes on chat module's parent (canvas)
        const parent = chatModuleRef.current.offsetParent
        if (parent) {
          mutationObserver.observe(parent, {
            attributes: true,
            attributeFilter: ['style', 'class']
          })
        }
      }

      // Start continuous position tracking
      trackPosition()

      // Standard event listeners
      const handleUpdate = () => {
        if (isTracking) updateModalPosition()
      }
      
      window.addEventListener('scroll', handleUpdate, true)
      window.addEventListener('resize', handleUpdate)

      return () => {
        isTracking = false
        mutationObserver.disconnect()
        if (rafId) cancelAnimationFrame(rafId)
        window.removeEventListener('scroll', handleUpdate, true)
        window.removeEventListener('resize', handleUpdate)
      }
    }
  }, [selectedText, showActionPopup])

  const handleTextSelection = useCallback((event: React.MouseEvent, messageId: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const selectedTextContent = selection.toString().trim()
    if (selectedTextContent.length < 3) return // Minimum 3 characters

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    // Get chat module element to calculate relative position
    const chatModule = event.currentTarget.closest('.mercury-module')
    const chatRect = chatModule?.getBoundingClientRect()
    
    // Generate dynamic actions based on selected text
    const actions = analyzeSelectedText(selectedTextContent, `message-${messageId}`)
    
    console.log(`🎯 Dynamic text selected: "${selectedTextContent}"`)
    console.log(`🤖 Generated ${actions.length} actions:`, actions.map(a => a.title))

    // Calculate relative position with bounds checking
    let relativeX = chatRect ? rect.left + rect.width / 2 - chatRect.left : rect.left + rect.width / 2
    let relativeY = chatRect ? rect.top - chatRect.top - 10 : rect.top - 10
    
    // Ensure popup stays within chat module bounds (with some padding)
    if (chatRect) {
      const popupWidth = 320 // w-80 = 320px
      const padding = 16
      
      // Keep popup within horizontal bounds
      relativeX = Math.max(padding + popupWidth / 2, Math.min(chatRect.width - padding - popupWidth / 2, relativeX))
      
      // Ensure popup doesn't go above the chat module
      relativeY = Math.max(10, relativeY)
    }

    setSelectedText({
      text: selectedTextContent,
      messageId,
      range,
      position: {
        x: relativeX,
        y: relativeY
      }
    })
    
    setAvailableActions(actions.filter(action => !usedActions.has(action.id)))
    
    // Wu Wei delay for natural action processing
    setTimeout(() => {
      setShowActionPopup(true)
    }, 150)
  }, [usedActions])

  const handleActionSelect = useCallback((action: any) => {
    console.log(`Mercury Dynamic Action Selected: ${action.title}`)
    setShowActionPopup(false)
    onActionDetected?.(action.title, `selected-text: ${selectedText?.text}`)
    
    // Clear selection
    window.getSelection()?.removeAllRanges()
    setSelectedText(null)
  }, [onActionDetected, selectedText])

  const markActionAsUsed = useCallback((actionId: string) => {
    console.log(`🗑️ Mercury Action Used: ${actionId}`)
    setUsedActions(prev => new Set([...prev, actionId]))
    onActionUsed?.(actionId)
    
    // Show feedback that action was used
    setActionFeedback(`Action "${actionId.split('-')[0]}" completed!`)
    setTimeout(() => setActionFeedback(null), 1500)
  }, [onActionUsed])

  // Handle successful drag completion
  const handleDragSuccess = useCallback((actionId: string) => {
    console.log(`🎯 Action "${actionId}" successfully dragged to canvas`)
    markActionAsUsed(actionId)
    
    // Immediately update available actions to remove the used one
    setAvailableActions(prev => prev.filter(action => action.id !== actionId))
    
    // Close popup if no more actions available
    const remainingActions = availableActions.filter(action => action.id !== actionId)
    if (remainingActions.length === 0) {
      setTimeout(() => {
        setShowActionPopup(false)
        setSelectedText(null)
        window.getSelection()?.removeAllRanges()
      }, 500)
    }
  }, [availableActions, markActionAsUsed])

  // Mercury Message Animation Variants
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
      filter: "blur(3px)"
    },
    visible: (index: number) => ({
      opacity: 1, 
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: index * 0.08, // Staggered natural entrance
        ease: wuWeiEasing,
        filter: {
          duration: 0.6,
          delay: index * 0.08 + 0.2,
          ease: wuWeiEasing
        }
      }
    })
  }

  const renderMessage = (message: ChatMessage, index: number) => (
    <motion.div
      key={message.id}
      custom={index}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className="flex space-x-3 mb-4"
    >
      <motion.div 
        className="w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
        whileHover={{ 
          scale: 1.05,
          transition: { duration: 0.2, ease: wuWeiEasing }
        }}
      >
        <img 
          src={message.avatar} 
          alt={message.author} 
          className="w-full h-full object-cover"
        />
      </motion.div>
      <div className="flex-1">
        <motion.div 
          className="bg-slate-50/80 dark:bg-slate-800/30 rounded-2xl px-4 py-3 max-w-sm"
          whileHover={{
            scale: 1.002,
            transition: { duration: 0.3, ease: wuWeiEasing }
          }}
        >
          <p 
            className="text-[14px] text-slate-700 dark:text-slate-200 leading-[1.4] font-normal cursor-text select-text"
            onMouseUp={(e) => handleTextSelection(e, message.id)}
            ref={(el) => {
              if (el) messageRefs.current.set(message.id, el)
            }}
            style={{ userSelect: 'text' }}
          >
            {message.content}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )

  return (
    <motion.div
      data-intent={intent}
      className={cn(
        'mercury-module',
        getMercuryFocusClasses(focusLevel),
        'relative h-[600px] w-[400px] bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/40 flex flex-col',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: wuWeiEasing
      }}
      ref={chatModuleRef}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"/>
          <div>
            <h3 className="font-medium text-slate-800 text-sm">
              Devin, Victoria, Marisa
            </h3>
            <p className="text-xs text-slate-500">Messenger Conversation</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[Mic, Plus].map((Icon, index) => (
            <button 
              key={index}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-150"
            >
              <Icon className="w-4 h-4 text-slate-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => renderMessage(message, index))}
        
        {/* Timestamp */}
        <div className="text-center pt-4">
          <span className="text-xs text-slate-400">Yesterday, 9:48 PM</span>
        </div>
      </div>

      {/* Portal Modal - Rendered outside chat to avoid clipping */}
      {typeof window !== 'undefined' && selectedText && showActionPopup && createPortal(
        <AnimatePresence>
          <motion.div
            className="fixed z-[9999] pointer-events-auto"
            style={{
              left: modalAbsolutePosition.x,
              top: modalAbsolutePosition.y,
              transform: 'translateX(-50%)'
            }}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: wuWeiEasing }}
          >
            <motion.div
              className="w-80 p-0 border border-slate-200/50 shadow-lg rounded-2xl bg-white/98 backdrop-blur-sm"
              initial={{ y: 10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1, ease: wuWeiEasing }}
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"/>
                    <span className="font-medium text-slate-800 text-sm">
                      "{selectedText.text}"
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowActionPopup(false)
                      setSelectedText(null)
                      window.getSelection()?.removeAllRanges()
                    }}
                    className="text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1 rounded-lg hover:bg-slate-100"
                  >
                    <div className="w-4 h-4 flex items-center justify-center relative">
                      <div className="w-3 h-0.5 bg-current rotate-45 absolute"></div>
                      <div className="w-3 h-0.5 bg-current -rotate-45 absolute"></div>
                    </div>
                  </button>
                </div>
                
                {/* Dynamic Actions - Made scrollable with max height */}
                <div className="space-y-1 pt-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <AnimatePresence mode="popLayout">
                    {availableActions.map((action, index) => (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ 
                          opacity: 0, 
                          scale: 0.95, 
                          height: 0,
                          transition: { 
                            duration: 0.3, 
                            ease: wuWeiEasing
                          }
                        }}
                        transition={{ 
                          duration: 0.4, 
                          delay: index * 0.05,
                          ease: wuWeiEasing 
                        }}
                      >
                        <MercuryDraggableAction
                          action={action}
                          onActionUsed={handleDragSuccess}
                          onClick={() => handleActionSelect(action)}
                          className="w-full flex items-center space-x-3 p-3 hover:bg-slate-50/80 rounded-xl text-left transition-all duration-200 group border border-transparent hover:border-blue-100/50 hover:shadow-sm"
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
                            action.type === 'housing-search' ? 'bg-red-100 group-hover:bg-red-200/80' : 
                            action.type === 'location' ? 'bg-blue-100 group-hover:bg-blue-200/80' :
                            action.type === 'person' ? 'bg-green-100 group-hover:bg-green-200/80' :
                            'bg-slate-100 group-hover:bg-slate-200/80'
                          }`}>
                            <div className={`rounded-full transition-all duration-200 ${
                              action.type === 'housing-search' ? 'w-3 h-3 bg-red-500 group-hover:bg-red-600' : 
                              action.type === 'location' ? 'w-3 h-3 bg-blue-500 group-hover:bg-blue-600' :
                              action.type === 'person' ? 'w-3 h-3 bg-green-500 group-hover:bg-green-600' :
                              'w-2 h-2 bg-slate-600 group-hover:bg-slate-700'
                            }`}></div>
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-slate-800 text-sm group-hover:text-slate-900 transition-colors duration-200">
                              {action.title}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 capitalize group-hover:text-slate-600 transition-colors duration-200">
                              {action.type.replace('-', ' ')}
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          </div>
                        </MercuryDraggableAction>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Empty state */}
                  {availableActions.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: wuWeiEasing }}
                      className="text-center py-6"
                    >
                      <p className="text-sm text-slate-600">No actions available for this text</p>
                      <p className="text-xs text-slate-500 mt-1">Try selecting different text</p>
                    </motion.div>
                  )}
                </div>

                {/* Scroll indicator when content overflows */}
                {availableActions.length > 4 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                    className="flex items-center justify-center pt-2 border-t border-slate-100 mt-2"
                  >
                    <div className="flex items-center space-x-1 text-xs text-slate-400">
                      <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                      <span>Scroll for more actions</span>
                      <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}

      {/* Debug state display */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 right-2 text-xs bg-black/70 text-white px-2 py-1 rounded font-mono">
          Selected: {selectedText ? `"${selectedText.text}"` : 'None'}
        </div>
      )}

      {/* Action Feedback */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg backdrop-blur-sm z-50"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.95 }}
            transition={{ duration: 0.3, ease: wuWeiEasing }}
          >
            ✅ {actionFeedback}
            <motion.div
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-500/90"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 0.1, ease: wuWeiEasing }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
} 