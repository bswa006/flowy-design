"use client"

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MercuryChatModule } from '@/components/mercury/mercury-chat-module'
import { MercuryFlowCanvas } from '@/components/mercury/mercury-flow-canvas'
import { MercuryHousingModule } from '@/components/mercury/mercury-housing-module'

// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const

export default function MercuryContextualDemoPage() {
  const [animationState, setAnimationState] = useState<'idle' | 'action-triggered' | 'complete'>('idle')
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)
  const [cardsCreated, setCardsCreated] = useState(0)
  const [showHousingModule, setShowHousingModule] = useState(false)
  const [housingModulePosition, setHousingModulePosition] = useState({ x: 600, y: 200 })
  const [chatModulePosition, setChatModulePosition] = useState({ x: 32, y: 32 }) // Start with fallback

  // Effect to center chat module after component mounts
  React.useEffect(() => {
    const centerChatModule = () => {
      const chatWidth = 400
      const chatHeight = 600
      const centeredPosition = {
        x: (window.innerWidth - chatWidth) / 2 - 100, // Slightly left of center for card flow
        y: (window.innerHeight - chatHeight) / 2
      }
      console.log('🎯 CENTERING CHAT MODULE ON MOUNT:', centeredPosition)
      console.log('🎯 VIEWPORT:', { width: window.innerWidth, height: window.innerHeight })
      setChatModulePosition(centeredPosition)
    }

    centerChatModule()
    
    // Also center on window resize
    window.addEventListener('resize', centerChatModule)
    return () => window.removeEventListener('resize', centerChatModule)
  }, [])

  const handleActionDetected = useCallback((action: string, context: string) => {
    console.log(`Mercury Contextual Action: ${action} from ${context}`)
    
    setAnimationState('action-triggered')
    setActionFeedback(`Contextual action detected: ${action}`)
    
    // Check if this is a housing search action
    if (action.toLowerCase().includes('find homes') || action.toLowerCase().includes('housing')) {
      console.log('🏠 Housing search action detected - showing housing module!')
      
      setTimeout(() => {
        setShowHousingModule(true)
        setActionFeedback('Housing search module activated!')
        setAnimationState('complete')
        
        setTimeout(() => setActionFeedback(null), 3000)
      }, 1000)
    } else {
      setTimeout(() => {
        setAnimationState('complete')
        setActionFeedback('Ready to drag actions to canvas')
        
        setTimeout(() => setActionFeedback(null), 2000)
      }, 800)
    }
  }, [])

  const handleHousingModuleClose = useCallback(() => {
    setShowHousingModule(false)
    setActionFeedback('Housing module closed')
    setTimeout(() => setActionFeedback(null), 1500)
  }, [])

  // Action Feedback Animation
  const feedbackVariants = {
    hidden: { 
      opacity: 0, 
      y: -20,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: wuWeiEasing
      }
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: wuWeiEasing
      }
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-x-hidden">
        {/* Mercury Action Feedback */}
        <AnimatePresence>
          {actionFeedback && (
            <motion.div
              variants={feedbackVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-8 right-8 z-50"
            >
              <div className="bg-slate-900/90 text-white px-6 py-3 rounded-2xl backdrop-blur-lg border border-white/20 shadow-2xl">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span className="text-sm font-medium">{actionFeedback}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Viewport-Constrained Mercury Spatial Computing Interface */}
        <MercuryFlowCanvas
          intent="contextual-flow-canvas"
          onCardCreated={(card) => {
            console.log('New Mercury card created:', card)
            setCardsCreated(prev => prev + 1)
            
            if (card.intent.includes('housing-card')) {
              setActionFeedback(`🏠 Created housing card: ${card.content.title}`)
            } else {
              setActionFeedback(`Created card: ${card.content.title}`)
            }
            setTimeout(() => setActionFeedback(null), 2000)
          }}
          onCardRemoved={(cardId) => {
            console.log('Mercury card removed:', cardId)
            setCardsCreated(prev => Math.max(0, prev - 1))
            setActionFeedback('Card removed from flow')
            setTimeout(() => setActionFeedback(null), 1500)
          }}
          onChatRepositioned={(newPosition) => {
            console.log('🎯 CHAT REPOSITIONING REQUESTED:', newPosition)
            setChatModulePosition(newPosition)
          }}
        >
          {/* Chat Module as Spatial Object */}
          <motion.div
            className="absolute z-40"
            initial={{ 
              opacity: 0, 
              scale: 0.9
            }}
            animate={{ 
              opacity: 1, 
              scale: 1
            }}
            transition={{
              duration: 0.8,
              ease: wuWeiEasing,
              delay: 0.5
            }}
            style={{ 
              left: chatModulePosition.x,
              top: chatModulePosition.y,
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity',
              transition: 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
          >
            <MercuryChatModule
              intent="chat-with-contextual-actions"
              focusLevel="focused"
              onActionDetected={handleActionDetected}
              onActionUsed={(actionId) => {
                console.log(`Parent: Action ${actionId} was used`)
                setActionFeedback(`Action "${actionId}" completed!`)
                setTimeout(() => setActionFeedback(null), 2000)
              }}
            />
          </motion.div>

          {/* Housing Module - Appears when housing actions are triggered */}
          <AnimatePresence>
            {showHousingModule && (
              <motion.div
                className="absolute z-30"
                style={{
                  left: housingModulePosition.x,
                  top: housingModulePosition.y
                }}
                initial={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  y: 50,
                  rotateY: -15 
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotateY: 0 
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.9, 
                  y: 30,
                  rotateY: 10 
                }}
                transition={{
                  duration: 1.2,
                  ease: wuWeiEasing,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                drag
                dragMomentum={false}
                onDragEnd={(event, info) => {
                  setHousingModulePosition(prev => ({
                    x: prev.x + info.offset.x,
                    y: prev.y + info.offset.y
                  }))
                }}
                whileHover={{ 
                  scale: 1.02,
                  y: -8,
                  transition: { duration: 0.3, ease: wuWeiEasing }
                }}
              >
                <div className="relative">
                  {/* Close button */}
                  <motion.button
                    onClick={handleHousingModuleClose}
                    className="absolute -top-3 -right-3 z-50 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg text-sm font-bold"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3, ease: wuWeiEasing }}
                  >
                    ×
                  </motion.button>

                  {/* Drag indicator */}
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium shadow-lg whitespace-nowrap"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.4, ease: wuWeiEasing }}
                  >
                    🏠 Drag to reposition
                  </motion.div>

                  <MercuryHousingModule
                    intent="contextual-housing-search"
                    focusLevel="focused"
                    onAddAllToFlow={() => {
                      setActionFeedback('All listings added to flow!')
                      setTimeout(() => setActionFeedback(null), 2000)
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animation State Indicator - Positioned on Canvas */}
          <motion.div
            className="absolute top-8 right-8 z-40"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 1.2,
              ease: wuWeiEasing
            }}
          >
            <div className="flex items-center space-x-3 px-4 py-2 bg-white/90 backdrop-blur-lg rounded-xl border border-slate-200/50 shadow-lg">
              <motion.div
                className={`w-3 h-3 rounded-full ${
                  animationState === 'idle' ? 'bg-slate-400' :
                  animationState === 'action-triggered' ? 'bg-yellow-400' :
                  'bg-emerald-400'
                }`}
                animate={{ 
                  scale: animationState !== 'idle' ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  duration: 0.8,
                  repeat: animationState === 'action-triggered' ? Infinity : 0,
                  ease: wuWeiEasing
                }}
              />
              <span className="text-xs font-medium text-slate-700 capitalize">
                {animationState.replace('-', ' ')}
              </span>
              {showHousingModule && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold"
                >
                  🏠 Housing Active
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Instructions overlay */}
          {/* {!showHousingModule && (
            <motion.div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.6, ease: wuWeiEasing }}
            >
              <div className="bg-white/95 backdrop-blur-sm px-6 py-4 rounded-2xl border border-slate-200/50 shadow-lg max-w-md text-center">
                <h3 className="font-semibold text-slate-800 mb-2">Try the Demo!</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Select any text in the chat (like "Mountain View") to see dynamic contextual actions appear. 
                  Choose "Find homes" to see the beautiful housing search module!
                </p>
              </div>
            </motion.div>
          )} */}
        </MercuryFlowCanvas>
      </div>
    </DndProvider>
  )
} 