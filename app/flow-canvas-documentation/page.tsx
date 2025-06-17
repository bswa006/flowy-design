"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  Code,
  Eye,
  Layers,
  Layout,
  MousePointer,
  Palette,
  Play,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";

// Mercury Wu Wei Easing - Natural movement without effort
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const;

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function DocumentationSection({
  title,
  icon,
  children,
  defaultOpen = false,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <motion.div
      className="bg-white/95 backdrop-blur-lg rounded-2xl border border-slate-200/50 shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: wuWeiEasing }}
    >
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-8 py-6 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white hover:from-blue-50 hover:to-indigo-50 transition-all duration-500"
        whileHover={{ scale: 1.005 }}
        whileTap={{ scale: 0.995 }}
      >
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-blue-100 rounded-xl text-blue-600">{icon}</div>
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3, ease: wuWeiEasing }}
        >
          <ChevronRight className="w-6 h-6 text-slate-600" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: wuWeiEasing }}
            className="overflow-hidden"
          >
            <div className="px-8 py-6 border-t border-slate-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function CodeBlock({
  children,
  language = "typescript",
}: {
  children: string;
  language?: string;
}) {
  return (
    <div className="relative bg-slate-900 rounded-xl overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-slate-300 text-sm font-medium">{language}</span>
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      <pre className="p-4 text-sm text-slate-100 overflow-x-auto">
        <code>{children}</code>
      </pre>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
  highlight = false,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <motion.div
      className={`p-6 rounded-xl border-2 transition-all duration-500 ${
        highlight
          ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg"
          : "bg-white border-slate-200 hover:border-blue-200 hover:shadow-md"
      }`}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3, ease: wuWeiEasing }}
    >
      <div className="flex items-start space-x-4">
        <div
          className={`p-3 rounded-lg ${highlight ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-600"}`}
        >
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function FlowCanvasDocumentationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-6xl mx-auto px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: wuWeiEasing }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl">
                <Layout className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-black text-slate-800 mb-6">
              Mercury Contextual Demo
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              A comprehensive spatial computing interface built with the Mercury
              OS Design System. This component demonstrates contextual actions,
              dynamic module spawning, and fluid spatial interactions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                React 19
              </div>
              <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
                Mercury OS
              </div>
              <div className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                Framer Motion
              </div>
              <div className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">
                React DnD
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12 space-y-8">
        {/* Component Overview */}
        <DocumentationSection
          title="Component Overview"
          icon={<BookOpen className="w-6 h-6" />}
          defaultOpen={true}
        >
          <div className="space-y-6">
            <p className="text-slate-700 leading-relaxed text-lg">
              The{" "}
              <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                MercuryContextualDemoPage
              </code>{" "}
              is a sophisticated spatial computing interface that showcases the
              Mercury OS design system's contextual action capabilities. It
              creates a dynamic workspace where users can interact with
              intelligent modules that respond to context and intent.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                title="Contextual Actions"
                description="Automatically detects user intent from chat interactions and suggests relevant actions"
                icon={<Zap className="w-5 h-5" />}
                highlight={true}
              />
              <FeatureCard
                title="Dynamic Module Spawning"
                description="Modules appear contextually based on detected actions (e.g., housing search triggers housing module)"
                icon={<Layers className="w-5 h-5" />}
              />
              <FeatureCard
                title="Spatial Positioning"
                description="Intelligent positioning system with drag-and-drop capabilities for optimal workspace organization"
                icon={<MousePointer className="w-5 h-5" />}
              />
              <FeatureCard
                title="Wu Wei Animations"
                description="Natural, effortless animations following Daoist principles of inexertion"
                icon={<Sparkles className="w-5 h-5" />}
              />
            </div>
          </div>
        </DocumentationSection>

        {/* Architecture & Design System */}
        <DocumentationSection
          title="Architecture & Design System"
          icon={<Palette className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Mercury OS Design System
            </h3>
            <p className="text-slate-700 leading-relaxed">
              Built entirely on the Mercury OS Design System, this component
              demonstrates the system's core principles:
              <strong>Fluid, Focused, and Familiar</strong> interactions with
              intelligent focus management.
            </p>

            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="font-semibold mb-3">Mercury Focus Hierarchy</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span>
                    <strong>Focused:</strong> Primary attention, maximum clarity
                    and interaction
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-300 rounded-full opacity-70"></div>
                  <span>
                    <strong>Ambient:</strong> Secondary context, reduced but
                    readable
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-200 rounded-full opacity-40"></div>
                  <span>
                    <strong>Fog:</strong> Background context, gentle de-emphasis
                  </span>
                </div>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 mb-3">
              Wu Wei Daoist Easing
            </h4>
            <p className="text-slate-700 mb-3">
              All animations use the Wu Wei easing function for natural,
              effortless movement:
            </p>
            <CodeBlock language="typescript">
              {`// Mercury OS Wu Wei Daoist Easing Functions
const wuWeiEasing = [0.25, 0.46, 0.45, 0.94] as const

// Applied to all animations for natural movement
transition={{
  duration: 0.8,
  ease: wuWeiEasing
}}`}
            </CodeBlock>
          </div>
        </DocumentationSection>

        {/* Component Structure */}
        <DocumentationSection
          title="Component Structure & State Management"
          icon={<Settings className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              State Architecture
            </h3>
            <p className="text-slate-700 leading-relaxed mb-4">
              The component uses a sophisticated state management system to
              handle complex interactions:
            </p>

            <CodeBlock language="typescript">
              {`// Core state management
const [animationState, setAnimationState] = useState<'idle' | 'action-triggered' | 'complete'>('idle')
const [actionFeedback, setActionFeedback] = useState<string | null>(null)
const [cardsCreated, setCardsCreated] = useState(0)
const [showHousingModule, setShowHousingModule] = useState(false)
const [housingModulePosition, setHousingModulePosition] = useState({ x: 600, y: 200 })
const [chatModulePosition, setChatModulePosition] = useState({ x: 32, y: 32 })`}
            </CodeBlock>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Animation States
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • <strong>idle:</strong> Waiting for user interaction
                  </li>
                  <li>
                    • <strong>action-triggered:</strong> Processing detected
                    action
                  </li>
                  <li>
                    • <strong>complete:</strong> Action processed successfully
                  </li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Positioning System
                </h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Dynamic centering on mount</li>
                  <li>• Responsive positioning</li>
                  <li>• Drag-and-drop repositioning</li>
                  <li>• Viewport constraint handling</li>
                </ul>
              </div>
            </div>
          </div>
        </DocumentationSection>

        {/* Key Features */}
        <DocumentationSection
          title="Key Features & Capabilities"
          icon={<Play className="w-6 h-6" />}
        >
          <div className="space-y-8">
            {/* Contextual Action Detection */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                1. Contextual Action Detection
              </h3>
              <p className="text-slate-700 mb-4">
                The system intelligently analyzes chat interactions to detect
                user intent and suggest contextual actions.
              </p>
              <CodeBlock language="typescript">
                {`const handleActionDetected = useCallback((action: string, context: string) => {
  console.log(\`Mercury Contextual Action: \${action} from \${context}\`)
  
  setAnimationState('action-triggered')
  setActionFeedback(\`Contextual action detected: \${action}\`)
  
  // Smart action routing based on intent
  if (action.toLowerCase().includes('find homes') || action.toLowerCase().includes('housing')) {
    setTimeout(() => {
      setShowHousingModule(true)
      setActionFeedback('Housing search module activated!')
      setAnimationState('complete')
    }, 1000)
  }
}, [])`}
              </CodeBlock>
            </div>

            {/* Dynamic Module Spawning */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                2. Dynamic Module Spawning
              </h3>
              <p className="text-slate-700 mb-4">
                Modules appear contextually with sophisticated entrance
                animations and positioning logic.
              </p>
              <CodeBlock language="typescript">
                {`<AnimatePresence>
  {showHousingModule && (
    <motion.div
      className="absolute z-30"
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
      transition={{
        duration: 1.2,
        ease: wuWeiEasing,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      <MercuryHousingModule
        intent="contextual-housing-search"
        focusLevel="focused"
      />
    </motion.div>
  )}
</AnimatePresence>`}
              </CodeBlock>
            </div>

            {/* Spatial Positioning */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                3. Intelligent Spatial Positioning
              </h3>
              <p className="text-slate-700 mb-4">
                Advanced positioning system with responsive centering and
                drag-and-drop capabilities.
              </p>
              <CodeBlock language="typescript">
                {`// Intelligent centering on component mount
React.useEffect(() => {
  const centerChatModule = () => {
    const chatWidth = 400
    const chatHeight = 600
    const centeredPosition = {
      x: (window.innerWidth - chatWidth) / 2 - 100,
      y: (window.innerHeight - chatHeight) / 2
    }
    setChatModulePosition(centeredPosition)
  }

  centerChatModule()
  window.addEventListener('resize', centerChatModule)
  return () => window.removeEventListener('resize', centerChatModule)
}, [])`}
              </CodeBlock>
            </div>

            {/* Feedback System */}
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-4">
                4. Real-time Feedback System
              </h3>
              <p className="text-slate-700 mb-4">
                Sophisticated feedback system with animated notifications and
                status indicators.
              </p>
              <CodeBlock language="typescript">
                {`const feedbackVariants = {
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
}`}
              </CodeBlock>
            </div>
          </div>
        </DocumentationSection>

        {/* Integration & Dependencies */}
        <DocumentationSection
          title="Integration & Dependencies"
          icon={<Code className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Required Dependencies
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-3">Core Dependencies</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>React 19:</strong> Latest React with concurrent
                    features
                  </li>
                  <li>
                    • <strong>Framer Motion:</strong> Advanced animation library
                  </li>
                  <li>
                    • <strong>React DnD:</strong> Drag and drop functionality
                  </li>
                  <li>
                    • <strong>HTML5Backend:</strong> DnD backend for web
                  </li>
                </ul>
              </div>
              <div className="bg-blue-50 p-6 rounded-xl">
                <h4 className="font-semibold mb-3">Mercury Components</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    • <strong>MercuryChatModule:</strong> Contextual chat
                    interface
                  </li>
                  <li>
                    • <strong>MercuryFlowCanvas:</strong> Spatial workspace
                    container
                  </li>
                  <li>
                    • <strong>MercuryHousingModule:</strong> Dynamic housing
                    search
                  </li>
                </ul>
              </div>
            </div>

            <h4 className="font-semibold text-slate-800 mb-3">
              Import Structure
            </h4>
            <CodeBlock language="typescript">
              {`"use client"

import React, { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { MercuryChatModule } from '@/components/mercury/mercury-chat-module'
import { MercuryFlowCanvas } from '@/components/mercury/mercury-flow-canvas'
import { MercuryHousingModule } from '@/components/mercury/mercury-housing-module'`}
            </CodeBlock>
          </div>
        </DocumentationSection>

        {/* Usage Examples */}
        <DocumentationSection
          title="Usage Examples & Implementation"
          icon={<Eye className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">
              Basic Implementation
            </h3>
            <p className="text-slate-700 mb-4">
              Here's how to implement the Mercury Contextual Demo in your
              application:
            </p>

            <CodeBlock language="typescript">
              {`export default function MercuryContextualDemoPage() {
  const [animationState, setAnimationState] = useState<'idle' | 'action-triggered' | 'complete'>('idle')
  const [showHousingModule, setShowHousingModule] = useState(false)
  
  const handleActionDetected = useCallback((action: string, context: string) => {
    // Handle contextual actions based on detected intent
    if (action.toLowerCase().includes('housing')) {
      setShowHousingModule(true)
    }
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <MercuryFlowCanvas
          intent="contextual-flow-canvas"
          onCardCreated={(card) => console.log('Card created:', card)}
        >
          <MercuryChatModule
            intent="chat-with-contextual-actions"
            focusLevel="focused"
            onActionDetected={handleActionDetected}
          />
        </MercuryFlowCanvas>
      </div>
    </DndProvider>
  )
}`}
            </CodeBlock>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg">
              <h4 className="font-semibold text-amber-800 mb-2">💡 Pro Tips</h4>
              <ul className="text-amber-700 space-y-1 text-sm">
                <li>
                  • Always wrap in DndProvider for drag-and-drop functionality
                </li>
                <li>• Use Mercury-compliant intent props for all components</li>
                <li>
                  • Implement proper focus level management for visual hierarchy
                </li>
                <li>
                  • Handle responsive positioning for different screen sizes
                </li>
              </ul>
            </div>
          </div>
        </DocumentationSection>

        {/* Performance & Accessibility */}
        <DocumentationSection
          title="Performance & Accessibility"
          icon={<Zap className="w-6 h-6" />}
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">
                  Performance Optimizations
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>
                    • <strong>GPU Acceleration:</strong> All animations use
                    transform-gpu
                  </li>
                  <li>
                    • <strong>Memoized Callbacks:</strong> useCallback for event
                    handlers
                  </li>
                  <li>
                    • <strong>Smooth Animations:</strong> 60fps with Wu Wei
                    easing
                  </li>
                  <li>
                    • <strong>Efficient Rendering:</strong> AnimatePresence for
                    mount/unmount
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-3">
                  Accessibility Features
                </h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li>
                    • <strong>WCAG 2.1 AAA:</strong> Full compliance with
                    accessibility standards
                  </li>
                  <li>
                    • <strong>Keyboard Navigation:</strong> Full keyboard
                    support
                  </li>
                  <li>
                    • <strong>Screen Readers:</strong> Proper ARIA labels and
                    roles
                  </li>
                  <li>
                    • <strong>Reduced Motion:</strong> Respects user motion
                    preferences
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl">
              <h4 className="font-semibold text-green-800 mb-3">
                🌟 Mercury Compliance
              </h4>
              <p className="text-green-700 text-sm">
                This component is 100% Mercury Design System compliant,
                following all principles for enterprise-grade applications
                including focus management, natural animations, and cognitive
                accessibility for ADHD/ASD users.
              </p>
            </div>
          </div>
        </DocumentationSection>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: wuWeiEasing }}
          className="text-center py-12"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Build with Mercury?
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              This comprehensive documentation provides everything you need to
              understand and implement the Mercury Contextual Demo component in
              your own applications.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                View Live Demo
              </button>
              <button className="px-6 py-3 bg-white text-slate-700 border-2 border-slate-200 rounded-xl font-semibold hover:border-blue-300 transition-colors">
                Download Source
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
