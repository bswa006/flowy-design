"use client"

import React, { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from "@/lib/utils"
import { getMercuryFocusClasses } from "@/lib/mercury-tokens"
import { Mic, Plus, Send } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { MercuryDraggableAction } from './mercury-draggable-action'

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

  const handleTextSelection = useCallback((event: React.MouseEvent, messageId: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const selectedTextContent = selection.toString().trim()
    if (selectedTextContent.length < 3) return // Minimum 3 characters

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()
    
    // Generate dynamic actions based on selected text
    const actions = analyzeSelectedText(selectedTextContent, `message-${messageId}`)
    
    console.log(`🎯 Dynamic text selected: "${selectedTextContent}"`)
    console.log(`🤖 Generated ${actions.length} actions:`, actions.map(a => a.title))

    setSelectedText({
      text: selectedTextContent,
      messageId,
      range,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
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

      {/* Dynamic Action Popup */}
      {selectedText && (
        <Popover open={showActionPopup} onOpenChange={setShowActionPopup}>
          <PopoverTrigger asChild>
            <div 
              className="fixed pointer-events-none"
              style={{
                left: selectedText.position.x,
                top: selectedText.position.y,
                transform: 'translateX(-50%)'
              }}
            />
          </PopoverTrigger>
          <PopoverContent 
            side="bottom" 
            align="center"
            sideOffset={10}
            className="w-80 p-0 border-slate-200/50 shadow-lg rounded-2xl bg-white/98 backdrop-blur-sm"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
                <div className="w-4 h-4 bg-blue-500 rounded-full"/>
                <span className="font-medium text-slate-800 text-sm">
                  "{selectedText.text}"
                </span>
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
          </PopoverContent>
        </Popover>
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