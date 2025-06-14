"use client"

import React, { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MercuryModuleCard } from './mercury-module-card'
import { MercuryFlowContainer } from './mercury-flow-container'
import { MercuryAddModuleBubble } from './mercury-add-module-bubble'
import { cn } from "@/lib/utils"

interface CardData {
  id: string
  title: string
  content: string
}

const SAMPLE_CARDS: CardData[] = [
  { id: '1', title: 'Module 1', content: 'Initial Content' },
  { id: '2', title: 'Module 2', content: 'Another Card' },
]

type AnimationState = 'idle' | 'card-entering' | 'card-settling' | 'bubble-revealing'

export function MercuryFlowDemo() {
  const [cards, setCards] = useState<CardData[]>(SAMPLE_CARDS)
  const [animationState, setAnimationState] = useState<AnimationState>('idle')
  const [newCardId, setNewCardId] = useState<string | null>(null)
  
  const addCard = useCallback(() => {
    if (animationState !== 'idle') return

    const newId = `card-${Date.now()}`
    setNewCardId(newId)
    setAnimationState('card-entering')
    
    const newCard: CardData = {
      id: newId,
      title: `Module ${cards.length + 1}`,
      content: 'New content...'
    }
    setCards(prev => [...prev, newCard])
  }, [animationState, cards.length])

  const onCardAnimationComplete = useCallback(() => {
    if (animationState === 'card-entering') {
      console.log("Card entered, now settling...")
      setAnimationState('card-settling')
      
      // The settling animation is handled by the card itself now
      // After settling, reveal the bubble
      setTimeout(() => {
        console.log("Card settled, revealing bubble...")
        setAnimationState('bubble-revealing')
      }, 300) // Corresponds to settling duration
    }
  }, [animationState])

  useEffect(() => {
    if (animationState === 'bubble-revealing') {
      // After bubble is revealed, return to idle
      setTimeout(() => {
        console.log("Cycle complete, returning to idle.")
        setAnimationState('idle')
        setNewCardId(null)
      }, 150) // Corresponds to bubble reveal duration
    }
  }, [animationState])

  return (
    <div className="space-y-8 p-4 bg-slate-100 dark:bg-slate-900 rounded-lg">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          High-Fidelity Mercury Flow
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Recreating the exact animation sequence from the video reference.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Animation State: <span className="font-bold text-blue-500">{animationState}</span>
        </p>
      </div>

      <div className="relative">
        <MercuryFlowContainer 
          intent="high-fidelity-flow-demo"
          focusManagement={false} // Disable auto-focus for this controlled demo
          className="min-h-[150px]"
        >
          <AnimatePresence mode="popLayout">
            {cards.map((card) => (
              <MercuryModuleCard
                key={card.id}
                intent={`demo-card-${card.id}`}
                title={card.title}
                isNew={card.id === newCardId}
                onAnimationComplete={onCardAnimationComplete}
              >
                {card.content}
              </MercuryModuleCard>
            ))}
          </AnimatePresence>
          
          <div className="flex-shrink-0 flex items-center justify-center pl-4">
            <AnimatePresence>
              {(animationState === 'idle' || animationState === 'bubble-revealing') && (
                <MercuryAddModuleBubble
                  intent="add-flow-card"
                  onClick={addCard}
                  disabled={animationState !== 'idle'}
                />
              )}
            </AnimatePresence>
          </div>
        </MercuryFlowContainer>
      </div>
    </div>
  )
} 