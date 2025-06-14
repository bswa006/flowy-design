"use client"

import React, { useState } from 'react'
import { MercuryFlowCards } from '@/components/mercury/mercury-flow-cards'
import Link from 'next/link'
import { motion } from 'framer-motion'

// Clean Mercury OS inspired flow cards
const mercuryFlowCards = [
  {
    id: 'welcome',
    title: 'Welcome to Mercury OS',
    subtitle: 'Spatial Computing Interface',
    content: 'Experience the future of human-computer interaction with our revolutionary spatial computing platform. Navigate through dimensions of information with natural gestures.',
    status: 'active' as const,
    time: 'Now'
  },
  {
    id: 'spatial-flow',
    title: 'Spatial Flow',
    subtitle: 'Three-Dimensional Navigation',
    content: 'Move through information spaces with intuitive 3D interactions. Each card exists in its own spatial layer, creating depth and context.',
    status: 'active' as const,
    time: '2 min ago'
  },
  {
    id: 'natural-motion',
    title: 'Natural Motion',
    subtitle: 'Wu Wei Principles',
    content: 'Our animations follow natural flow principles - effortless action that feels organic and unforced. Every transition settles like water finding its level.',
    status: 'completed' as const,
    time: '5 min ago'
  },
  {
    id: 'focus-hierarchy',
    title: 'Focus Hierarchy',
    subtitle: 'Selective Attention',
    content: 'Experience intelligent focus where active content shines while background elements gracefully fade, creating natural attention flow.',
    status: 'pending' as const,
    time: '10 min ago'
  },
  {
    id: 'accessibility',
    title: 'Universal Access',
    subtitle: 'Cognitive Accessibility',
    content: 'Every interaction is designed for neurodivergent users, supporting ADHD and ASD needs through clear patterns and reduced cognitive load.',
    status: 'completed' as const,
    time: '15 min ago'
  }
]

export default function MercuryFlowDemoPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <div className="px-8 py-6">
        <Link 
          href="/"
          className="text-slate-400 hover:text-white transition-colors duration-200"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            Mercury OS Flow Cards
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            Experience spatial computing with 3D card flows inspired by the Mercury OS interface. 
            Drag cards horizontally or click navigation dots to explore the dimensional space.
          </p>
          
          {selectedCard && (
            <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-lg border border-white/20">
              <span className="text-sm text-slate-300">
                Selected: <span className="text-white font-medium">{selectedCard}</span>
              </span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mercury Flow Cards */}
      <div className="px-8 pb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <MercuryFlowCards
            intent="mercury-os-spatial-flow"
            focusLevel="focused"
            cards={mercuryFlowCards}
            onCardSelect={handleCardSelect}
            className="mb-12"
          />
        </motion.div>
      </div>

      {/* Instructions */}
      <div className="px-8 py-12 border-t border-white/10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Interaction Guide
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Drag to Navigate</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Click and drag cards horizontally to move through the 3D space. Cards will naturally flow to their new positions.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Click to Focus</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Click any card or navigation dot to bring it into focus and explore its content in detail.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 