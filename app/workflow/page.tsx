"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft,
  ArrowRight,
  User,
  Briefcase,
  Users,
  Plus,
  Info,
  CheckCircle,
  Star,
  MapPin,
  Calendar,
  Clock,
  Mail,
  Phone,
  Globe,
  Zap,
  Play,
  Pause
} from "lucide-react"
import Link from "next/link"

// Workflow step types
type WorkflowStep = {
  id: string
  type: 'welcome' | 'profile' | 'project' | 'team' | 'custom' | 'completion'
  title: string
  description: string
  completed: boolean
  interactive?: boolean
  showDetails?: boolean
}

// Base Flowy Card component for horizontal layout
const HorizontalFlowyCard = ({ 
  children, 
  className = "",
  delay = 0,
  size = "default",
  interactive = false,
  completed = false,
  active = false,
  onClick
}: { 
  children: React.ReactNode
  className?: string
  delay?: number
  size?: "compact" | "default" | "large"
  interactive?: boolean
  completed?: boolean
  active?: boolean
  onClick?: () => void
}) => (
  <motion.div
    initial={{ opacity: 0, x: 100, scale: 0.8 }}
    animate={{ 
      opacity: 1, 
      x: 0, 
      scale: active ? 1.05 : completed ? 0.95 : 1,
      filter: completed && !active ? "brightness(0.8)" : "brightness(1)"
    }}
    transition={{ 
      duration: 1.2, 
      delay,
      ease: [0.25, 0.4, 0.25, 1]
    }}
    whileHover={interactive ? { 
      y: -8,
      scale: active ? 1.08 : 1.02,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }
    } : {}}
    onClick={onClick}
    className={`
      relative
      bg-white/20 
      backdrop-blur-xl 
      border border-white/10
      rounded-[1.5rem]
      shadow-2xl shadow-black/5
      hover:shadow-3xl hover:shadow-black/10
      transition-all duration-700 ease-out
      ${size === "compact" ? "p-4 w-72" : size === "large" ? "p-8 w-96" : "p-6 w-80"}
      ${interactive ? "cursor-pointer" : ""}
      ${active ? "ring-2 ring-blue-300/50 bg-white/30" : ""}
      ${completed ? "bg-green-50/30 border-green-200/30" : ""}
      min-h-[320px]
      flex flex-col
      ${className}
    `}
  >
    {/* Completion indicator */}
    {completed && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
      >
        <CheckCircle className="w-5 h-5 text-white" />
      </motion.div>
    )}
    
    {/* Active indicator */}
    {active && !completed && (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
      >
        <Play className="w-4 h-4 text-white ml-0.5" />
      </motion.div>
    )}
    
    {children}
  </motion.div>
)

// Flowing text component
const FlowingText = ({ 
  children, 
  size = "base",
  className = "" 
}: { 
  children: React.ReactNode
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl"
  className?: string
}) => {
  const sizeClasses = {
    xs: "text-xs leading-relaxed",
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed", 
    lg: "text-lg leading-relaxed",
    xl: "text-xl leading-relaxed font-light",
    "2xl": "text-2xl leading-relaxed font-light"
  }
  
  return (
    <div className={`text-slate-700 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

// Dangling detail card for horizontal layout
const HorizontalDanglingCard = ({ 
  children, 
  position = "right",
  show = false,
  onClose
}: {
  children: React.ReactNode
  position?: "right" | "left" | "bottom"
  show: boolean
  onClose?: () => void
}) => {
  const positionClasses = {
    right: "left-full ml-4 top-0",
    left: "right-full mr-4 top-0",
    bottom: "top-full mt-4 left-1/2 transform -translate-x-1/2"
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: position === "right" ? -20 : position === "left" ? 20 : 0, y: position === "bottom" ? -20 : 0 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: position === "right" ? -20 : position === "left" ? 20 : 0, y: position === "bottom" ? -20 : 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
          className={`absolute ${positionClasses[position]} z-20`}
          style={{ 
            maxWidth: '600px',
            minWidth: '480px'
          }}
        >
          <div className="bg-white/40 backdrop-blur-lg border border-white/30 rounded-xl p-4 shadow-xl">
            {onClose && (
              <button 
                onClick={onClose}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors"
              >
                ×
              </button>
            )}
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Welcome Step Card
const WelcomeCard = ({ active, completed, onNext }: { active: boolean, completed: boolean, onNext: () => void }) => (
  <HorizontalFlowyCard active={active} completed={completed} className="justify-center text-center">
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
        className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto flex items-center justify-center"
      >
        <Zap className="w-8 h-8 text-blue-600" />
      </motion.div>
      
      <div className="space-y-3">
        <FlowingText size="lg" className="text-slate-800 font-medium">
          Welcome to Flowy Workflow
        </FlowingText>
        <FlowingText size="sm" className="text-slate-600">
          Experience cards flowing together in horizontal harmony
        </FlowingText>
      </div>
      
      {active && !completed && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2 bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-lg text-blue-700 font-medium hover:bg-blue-500/30 transition-all duration-300"
        >
          Begin Journey
        </motion.button>
      )}
    </div>
  </HorizontalFlowyCard>
)

// Profile Setup Card
const ProfileCard = ({ active, completed, onNext }: { active: boolean, completed: boolean, onNext: () => void }) => {
  const [showDetails, setShowDetails] = React.useState(false)
  
  return (
    <div className="relative">
      <HorizontalFlowyCard 
        active={active} 
        completed={completed} 
        interactive={active}
        onClick={() => active && setShowDetails(!showDetails)}
      >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <FlowingText size="base" className="text-slate-800 font-medium">
                Setup Profile
              </FlowingText>
              <FlowingText size="xs" className="text-slate-500">
                {active ? "Click for details" : completed ? "Completed" : "Coming up"}
              </FlowingText>
            </div>
            {active && <Info className="w-4 h-4 text-slate-400" />}
          </div>
          
          <FlowingText size="sm" className="text-slate-600">
            Configure your workspace preferences and personal settings.
          </FlowingText>
          
          {active && !completed && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-300/30 rounded-lg text-purple-700 font-medium hover:bg-purple-500/30 transition-all duration-300"
            >
              Complete Profile
            </motion.button>
          )}
        </div>
      </HorizontalFlowyCard>
      
      <HorizontalDanglingCard 
        show={showDetails && active} 
        position="right"
        onClose={() => setShowDetails(false)}
      >
        <div className="space-y-2">
          <FlowingText size="sm" className="text-slate-700 font-medium">Profile Settings</FlowingText>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Mail className="w-3 h-3" />
              <span>Email preferences</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="w-3 h-3" />
              <span>Language settings</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-3 h-3" />
              <span>Theme customization</span>
            </div>
          </div>
        </div>
      </HorizontalDanglingCard>
    </div>
  )
}

// Project Selection Card  
const ProjectCard = ({ active, completed, onNext }: { active: boolean, completed: boolean, onNext: () => void }) => {
  const [selectedProject, setSelectedProject] = React.useState<string | null>(completed ? "design" : null)
  const [showProjectDetails, setShowProjectDetails] = React.useState(false)
  
  const projects = [
    { id: "design", name: "Design System", color: "blue" },
    { id: "mobile", name: "Mobile App", color: "green" },
    { id: "web", name: "Web Platform", color: "purple" }
  ]
  
  return (
    <div className="relative">
      <HorizontalFlowyCard active={active} completed={completed}>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-teal-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <FlowingText size="base" className="text-slate-800 font-medium">
                Choose Project
              </FlowingText>
              <FlowingText size="xs" className="text-slate-500">
                {completed ? "Design System selected" : active ? "Select to continue" : "Coming up"}
              </FlowingText>
            </div>
          </div>
          
          {active && (
            <div className="space-y-2">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ x: 2 }}
                  onClick={() => {
                    setSelectedProject(project.id)
                    setShowProjectDetails(true)
                  }}
                  className={`p-2 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedProject === project.id 
                      ? 'border-blue-300 bg-blue-50/50' 
                      : 'border-slate-200/50 hover:border-slate-300/50'
                  }`}
                >
                  <FlowingText size="sm" className="text-slate-700">
                    {project.name}
                  </FlowingText>
                </motion.div>
              ))}
            </div>
          )}
          
          {selectedProject && active && !completed && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-300/30 rounded-lg text-green-700 font-medium hover:bg-green-500/30 transition-all duration-300"
            >
              Continue with {projects.find(p => p.id === selectedProject)?.name}
            </motion.button>
          )}
        </div>
      </HorizontalFlowyCard>
      
      <HorizontalDanglingCard 
        show={showProjectDetails && active} 
        position="right"
        onClose={() => setShowProjectDetails(false)}
      >
        <div className="space-y-2">
          <FlowingText size="sm" className="text-slate-700 font-medium">
            Project Details
          </FlowingText>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 h-3" />
              <span>Timeline: 8 weeks</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-3 h-3" />
              <span>Team size: 4-6 people</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3 h-3" />
              <span>Status: Planning phase</span>
            </div>
          </div>
        </div>
      </HorizontalDanglingCard>
    </div>
  )
}

// Team Invitation Card
const TeamCard = ({ active, completed, onNext }: { active: boolean, completed: boolean, onNext: () => void }) => {
  const [inviteSent, setInviteSent] = React.useState(completed)
  
  return (
    <HorizontalFlowyCard active={active} completed={completed}>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-orange-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-pink-600" />
          </div>
          <div className="flex-1">
            <FlowingText size="base" className="text-slate-800 font-medium">
              Invite Team
            </FlowingText>
            <FlowingText size="xs" className="text-slate-500">
              {completed ? "Invitations sent" : active ? "Add collaborators" : "Coming up"}
            </FlowingText>
          </div>
        </div>
        
        {active && (
          <div className="space-y-3">
            <input 
              type="email" 
              placeholder="colleague@company.com"
              className="w-full px-3 py-2 text-sm bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:border-pink-300/50 transition-all duration-300"
            />
            
            <motion.button
              onClick={() => setInviteSent(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={inviteSent}
              className={`w-full px-4 py-2 text-sm backdrop-blur-sm border rounded-lg font-medium transition-all duration-300 ${
                inviteSent 
                  ? 'bg-green-500/20 border-green-300/30 text-green-700'
                  : 'bg-pink-500/20 border-pink-300/30 text-pink-700 hover:bg-pink-500/30'
              }`}
            >
              {inviteSent ? '✓ Invitation Sent' : 'Send Invitation'}
            </motion.button>
          </div>
        )}
        
        {inviteSent && active && !completed && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-2 text-sm bg-slate-500/20 backdrop-blur-sm border border-slate-300/30 rounded-lg text-slate-700 font-medium hover:bg-slate-500/30 transition-all duration-300"
          >
            Continue Workflow
          </motion.button>
        )}
      </div>
    </HorizontalFlowyCard>
  )
}

// Add Custom Step Card
const CustomStepCard = ({ active, completed, onNext, onAddStep }: { active: boolean, completed: boolean, onNext: () => void, onAddStep: (step: string) => void }) => {
  const [customStep, setCustomStep] = React.useState("")
  const [steps, setSteps] = React.useState<string[]>(completed ? ["Design Review", "Testing Phase"] : [])
  
  const addStep = () => {
    if (customStep.trim()) {
      const newSteps = [...steps, customStep]
      setSteps(newSteps)
      onAddStep(customStep)
      setCustomStep("")
    }
  }
  
  return (
    <HorizontalFlowyCard active={active} completed={completed}>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
            <Plus className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="flex-1">
            <FlowingText size="base" className="text-slate-800 font-medium">
              Customize Workflow
            </FlowingText>
            <FlowingText size="xs" className="text-slate-500">
              {completed ? "Steps customized" : active ? "Add custom steps" : "Coming up"}
            </FlowingText>
          </div>
        </div>
        
        {active && (
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input 
                type="text"
                value={customStep}
                onChange={(e) => setCustomStep(e.target.value)}
                placeholder="Add workflow step..."
                className="flex-1 px-3 py-2 text-sm bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg text-slate-700 placeholder-slate-500 focus:outline-none focus:border-indigo-300/50 transition-all duration-300"
                onKeyDown={(e) => e.key === 'Enter' && addStep()}
              />
              <motion.button
                onClick={addStep}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 bg-indigo-500/20 backdrop-blur-sm border border-indigo-300/30 rounded-lg text-indigo-700 hover:bg-indigo-500/30 transition-all duration-300"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            
            {steps.length > 0 && (
              <div className="space-y-2 max-h-20 overflow-y-auto">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-2 p-2 bg-white/20 rounded text-xs"
                  >
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <FlowingText size="xs" className="text-slate-700">{step}</FlowingText>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {active && !completed && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-4 py-2 text-sm bg-indigo-500/20 backdrop-blur-sm border border-indigo-300/30 rounded-lg text-indigo-700 font-medium hover:bg-indigo-500/30 transition-all duration-300"
          >
            Complete Workflow
          </motion.button>
        )}
      </div>
    </HorizontalFlowyCard>
  )
}

// Completion Card
const CompletionCard = ({ active, completed, customSteps }: { active: boolean, completed: boolean, customSteps: string[] }) => (
  <HorizontalFlowyCard active={active} completed={completed} className="justify-center text-center">
    <div className="space-y-6">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
        className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mx-auto flex items-center justify-center"
      >
        <CheckCircle className="w-8 h-8 text-green-600" />
      </motion.div>
      
      <div className="space-y-3">
        <FlowingText size="lg" className="text-slate-800 font-medium">
          Workflow Complete!
        </FlowingText>
        <FlowingText size="sm" className="text-slate-600">
          All cards flowed together beautifully in horizontal harmony
        </FlowingText>
        
        {active && customSteps.length > 0 && (
          <div className="text-xs text-slate-600">
            Custom steps: {customSteps.length}
          </div>
        )}
      </div>
      
      {active && (
        <div className="flex flex-col space-y-2">
          <Link 
            href="/cards"
            className="px-4 py-2 text-xs bg-blue-500/20 backdrop-blur-sm border border-blue-300/30 rounded-lg text-blue-700 font-medium hover:bg-blue-500/30 transition-all duration-300"
          >
            View All Cards
          </Link>
          <Link 
            href="/"
            className="px-4 py-2 text-xs bg-slate-500/20 backdrop-blur-sm border border-slate-300/30 rounded-lg text-slate-700 font-medium hover:bg-slate-500/30 transition-all duration-300"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  </HorizontalFlowyCard>
)

export default function HorizontalWorkflowShowcase() {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [customSteps, setCustomSteps] = React.useState<string[]>([])
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([])
  
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5))
  }
  
  const addCustomStep = (step: string) => {
    setCustomSteps(prev => [...prev, step])
  }
  
  // Ensure component is mounted before running client-side effects
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // Auto-scroll to active card - only after mount
  React.useEffect(() => {
    if (!mounted) return
    
    if (scrollContainerRef.current && cardRefs.current[currentStep]) {
      const container = scrollContainerRef.current
      const activeCard = cardRefs.current[currentStep]
      
      if (activeCard) {
        const containerRect = container.getBoundingClientRect()
        const cardRect = activeCard.getBoundingClientRect()
        
        // Calculate the scroll position to center the active card
        const scrollLeft = activeCard.offsetLeft - (containerRect.width / 2) + (cardRect.width / 2)
        
        // Smooth scroll to the active card
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        })
      }
    }
  }, [currentStep, mounted])
  
  // Auto-play functionality - only after mount
  React.useEffect(() => {
    if (!mounted) return
    
    if (isPlaying && currentStep < 5) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, currentStep, mounted])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <div className="pt-6 pb-4">
        <div className="max-w-full mx-auto px-8">
          <div className="flex items-center justify-between">
            <Link 
              href="/cards"
              className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Cards</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-white/30 backdrop-blur-lg border border-white/20 rounded-xl text-slate-700 hover:bg-white/40 transition-all duration-300"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span className="text-sm">{isPlaying ? "Pause" : "Auto-play"}</span>
              </motion.button>
              
              <FlowingText size="sm" className="text-slate-600">
                Horizontal Flow • Step {currentStep + 1} of 6
              </FlowingText>
            </div>
          </div>
        </div>
      </div>

      {/* Main Horizontal Workflow - Fixed Truncation */}
      <div className="pt-16 pb-16">
        <div className="w-full px-8">
          {/* Horizontal scrolling container */}
          <div ref={scrollContainerRef} className="overflow-x-auto overflow-y-visible">
            <div className="flex space-x-8 pb-8 min-w-fit justify-center" style={{ minHeight: '500px', paddingTop: '2rem' }}>
              <motion.div
                ref={(el) => { cardRefs.current[0] = el }}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: 0 <= currentStep ? 1 : 0.4,
                  scale: 0 === currentStep ? 1 : 0.95
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex-shrink-0"
              >
                <WelcomeCard 
                  active={0 === currentStep}
                  completed={0 < currentStep}
                  onNext={nextStep}
                />
              </motion.div>

              <motion.div
                ref={(el) => { cardRefs.current[1] = el }}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: 1 <= currentStep ? 1 : 0.4,
                  scale: 1 === currentStep ? 1 : 0.95
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex-shrink-0"
              >
                <ProfileCard 
                  active={1 === currentStep}
                  completed={1 < currentStep}
                  onNext={nextStep}
                />
              </motion.div>

              <motion.div
                ref={(el) => { cardRefs.current[2] = el }}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: 2 <= currentStep ? 1 : 0.4,
                  scale: 2 === currentStep ? 1 : 0.95
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex-shrink-0"
              >
                <ProjectCard 
                  active={2 === currentStep}
                  completed={2 < currentStep}
                  onNext={nextStep}
                />
              </motion.div>

              <motion.div
                ref={(el) => { cardRefs.current[3] = el }}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: 3 <= currentStep ? 1 : 0.4,
                  scale: 3 === currentStep ? 1 : 0.95
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex-shrink-0"
              >
                <TeamCard 
                  active={3 === currentStep}
                  completed={3 < currentStep}
                  onNext={nextStep}
                />
              </motion.div>

              <motion.div
                ref={(el) => { cardRefs.current[4] = el }}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: 4 <= currentStep ? 1 : 0.4,
                  scale: 4 === currentStep ? 1 : 0.95
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex-shrink-0"
              >
                <CustomStepCard 
                  active={4 === currentStep}
                  completed={4 < currentStep}
                  onNext={nextStep}
                  onAddStep={addCustomStep}
                />
              </motion.div>

              <motion.div
                ref={(el) => { cardRefs.current[5] = el }}
                initial={{ opacity: 0.3 }}
                animate={{ 
                  opacity: 5 <= currentStep ? 1 : 0.4,
                  scale: 5 === currentStep ? 1 : 0.95
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                className="flex-shrink-0"
              >
                <CompletionCard 
                  active={5 === currentStep}
                  completed={5 < currentStep}
                  customSteps={customSteps}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Flow Indicator - Fixed at Bottom */}
      <div className="pb-8">
        <div className="max-w-full mx-auto px-8">
          <div className="flex items-center justify-center space-x-3">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <React.Fragment key={index}>
                <motion.button
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-500 cursor-pointer ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-slate-300'
                  }`}
                  animate={{ 
                    scale: index === currentStep ? 1.5 : 1,
                    backgroundColor: index === currentStep ? '#3B82F6' : index < currentStep ? '#10B981' : '#CBD5E1'
                  }}
                  whileHover={{ scale: 1.3 }}
                />
                {index < 5 && (
                  <motion.div 
                    className="w-8 h-0.5 transition-all duration-500"
                    animate={{ 
                      backgroundColor: index < currentStep ? '#10B981' : '#CBD5E1'
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 