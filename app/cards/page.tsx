"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { 
  User, 
  Bell, 
  ShoppingBag, 
  Calendar,
  MapPin,
  Star,
  Heart,
  MessageCircle,
  ArrowLeft,
  Camera,
  Music,
  BookOpen,
  Coffee,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { FlowyCard as BaseFlowyCard } from '@/components/ui/flowy-card'

// Wrapper to add delay functionality
const FlowyCard = ({ 
  children, 
  delay = 0, 
  size = "md",
  ...props 
}: { 
  children: React.ReactNode
  delay?: number
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  className?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
  >
    <BaseFlowyCard size={size} {...props}>
      {children}
    </BaseFlowyCard>
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
    base: "text-base leading-loose", 
    lg: "text-lg leading-loose",
    xl: "text-xl leading-loose font-light",
    "2xl": "text-2xl leading-loose font-light"
  }
  
  return (
    <div className={`text-slate-700 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  )
}

// Profile Card
const ProfileCard = ({ delay = 0 }) => (
  <FlowyCard delay={delay} className="max-w-sm">
    <div className="text-center space-y-6">
      <div className="relative">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mx-auto flex items-center justify-center">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
      </div>
      
      <div className="space-y-3">
        <FlowingText size="xl" className="text-slate-800 font-medium">
          Sarah Chen
        </FlowingText>
        <FlowingText size="sm" className="text-slate-500">
          Product Designer at Flow Co.
        </FlowingText>
        <FlowingText size="sm" className="text-slate-600">
          Creating beautiful, intuitive experiences that flow naturally with human behavior.
        </FlowingText>
      </div>
      
      <div className="flex justify-center space-x-4 pt-4">
        <div className="text-center">
          <FlowingText size="lg" className="text-slate-800 font-medium">2.1k</FlowingText>
          <FlowingText size="xs" className="text-slate-500">Followers</FlowingText>
        </div>
        <div className="text-center">
          <FlowingText size="lg" className="text-slate-800 font-medium">847</FlowingText>
          <FlowingText size="xs" className="text-slate-500">Following</FlowingText>
        </div>
      </div>
    </div>
  </FlowyCard>
)

// Product Card
const ProductCard = ({ delay = 0 }) => (
  <FlowyCard delay={delay} className="max-w-sm">
    <div className="space-y-6">
      <div className="aspect-video bg-gradient-to-br from-pink-100 to-orange-100 rounded-xl flex items-center justify-center">
        <Camera className="w-12 h-12 text-pink-600" />
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <FlowingText size="lg" className="text-slate-800 font-medium">
              Flow Camera Pro
            </FlowingText>
            <FlowingText size="sm" className="text-slate-500">
              Professional Photography
            </FlowingText>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <FlowingText size="sm" className="text-slate-600">4.9</FlowingText>
          </div>
        </div>
        
        <FlowingText size="sm" className="text-slate-600">
          Capture life's flowing moments with crystal clarity and natural beauty.
        </FlowingText>
        
        <div className="flex items-center justify-between pt-2">
          <FlowingText size="xl" className="text-slate-800 font-semibold">
            $299
          </FlowingText>
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer" />
            <ShoppingBag className="w-5 h-5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </FlowyCard>
)

// Notification Card
const NotificationCard = ({ delay = 0 }) => (
  <FlowyCard delay={delay} size="sm" className="max-w-md">
    <div className="flex items-start space-x-4">
      <div className="p-3 bg-blue-100/60 rounded-xl">
        <Bell className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <FlowingText size="base" className="text-slate-800 font-medium">
            New Message
          </FlowingText>
          <FlowingText size="xs" className="text-slate-500">
            2 min ago
          </FlowingText>
        </div>
        
        <FlowingText size="sm" className="text-slate-600">
          Your design flows beautifully! The cards have that perfect weightless feeling we discussed.
        </FlowingText>
        
        <div className="flex items-center space-x-3 pt-2">
          <FlowingText size="xs" className="text-blue-600 cursor-pointer hover:text-blue-700">
            Reply
          </FlowingText>
          <FlowingText size="xs" className="text-slate-500 cursor-pointer hover:text-slate-600">
            Mark as read
          </FlowingText>
        </div>
      </div>
    </div>
  </FlowyCard>
)

// Event Card
const EventCard = ({ delay = 0 }) => (
  <FlowyCard delay={delay} className="max-w-sm">
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="p-4 bg-purple-100/60 rounded-xl">
          <Calendar className="w-8 h-8 text-purple-600" />
        </div>
        <div className="space-y-1">
          <FlowingText size="xs" className="text-purple-600 font-medium uppercase tracking-wide">
            Tomorrow
          </FlowingText>
          <FlowingText size="lg" className="text-slate-800 font-medium">
            Design Workshop
          </FlowingText>
        </div>
      </div>
      
      <FlowingText size="sm" className="text-slate-600">
        Join us for an exploration of flowy design principles and how to create interfaces that feel naturally weightless.
      </FlowingText>
      
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <MapPin className="w-4 h-4 text-slate-400" />
          <FlowingText size="sm" className="text-slate-600">
            Creative Studio, Downtown
          </FlowingText>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-full bg-green-400"></div>
          <FlowingText size="sm" className="text-slate-600">
            12 people attending
          </FlowingText>
        </div>
      </div>
    </div>
  </FlowyCard>
)

// Music Card
const MusicCard = ({ delay = 0 }) => (
  <FlowyCard delay={delay} size="sm" className="max-w-md">
    <div className="flex items-center space-x-4">
      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-teal-100 rounded-xl flex items-center justify-center">
        <Music className="w-8 h-8 text-green-600" />
      </div>
      
      <div className="flex-1 space-y-2">
        <FlowingText size="base" className="text-slate-800 font-medium">
          Flowing Waters
        </FlowingText>
        <FlowingText size="sm" className="text-slate-500">
          Nature Sounds Collection
        </FlowingText>
        
        <div className="flex items-center space-x-2 pt-1">
          <div className="w-32 h-1 bg-slate-200 rounded-full">
            <div className="w-1/3 h-1 bg-green-400 rounded-full"></div>
          </div>
          <FlowingText size="xs" className="text-slate-500">
            2:34
          </FlowingText>
        </div>
      </div>
    </div>
  </FlowyCard>
)

// Article Card
const ArticleCard = ({ delay = 0 }) => (
  <FlowyCard delay={delay} className="max-w-md">
    <div className="space-y-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-orange-100/60 rounded-xl">
          <BookOpen className="w-6 h-6 text-orange-600" />
        </div>
        <div className="flex-1 space-y-2">
          <FlowingText size="lg" className="text-slate-800 font-medium">
            The Art of Flowy Design
          </FlowingText>
          <FlowingText size="sm" className="text-slate-500">
            5 min read • Design
          </FlowingText>
        </div>
      </div>
      
      <FlowingText size="sm" className="text-slate-600">
        Discover how to create interfaces that flow like water, breathe with generous space, and feel weightless to interact with. Learn the principles that make design feel effortless.
      </FlowingText>
      
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-slate-300 rounded-full"></div>
          <FlowingText size="sm" className="text-slate-600">
            Alex Rivers
          </FlowingText>
        </div>
        
        <div className="flex items-center space-x-3">
          <Heart className="w-5 h-5 text-slate-400 hover:text-red-400 transition-colors cursor-pointer" />
          <MessageCircle className="w-5 h-5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer" />
        </div>
      </div>
    </div>
  </FlowyCard>
)

// Quote Card
const QuoteCard = ({ delay = 0 }) => (
  <FlowyCard delay={delay} size="xl" className="max-w-2xl">
    <div className="text-center space-y-8">
      <div className="p-6 bg-gradient-to-br from-indigo-100/60 to-purple-100/60 rounded-2xl">
        <Coffee className="w-12 h-12 text-indigo-600 mx-auto mb-6" />
        
        <FlowingText size="xl" className="text-slate-800 italic font-light">
          "Design is not just what it looks like and feels like. 
          Design is how it flows."
        </FlowingText>
      </div>
      
      <div className="space-y-2">
        <FlowingText size="base" className="text-slate-700 font-medium">
          Steve Jobs
        </FlowingText>
        <FlowingText size="sm" className="text-slate-500">
          Adapted for the Flowy Design Era
        </FlowingText>
      </div>
    </div>
  </FlowyCard>
)

export default function CardsShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <div className="pt-8 pb-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center justify-between">
            <Link 
              href="/"
              className="inline-flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Home</span>
            </Link>
            
            <Link 
              href="/workflow"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-white/30 backdrop-blur-lg border border-white/20 rounded-xl text-slate-700 hover:text-slate-800 hover:bg-white/40 transition-all duration-500 ease-out hover:scale-105"
            >
              <span className="text-sm font-medium">Try Interactive Workflow</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="pb-24">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl font-light text-slate-800 mb-6">
              Flowy Card Collection
            </h1>
            <FlowingText size="lg" className="text-slate-600 max-w-2xl mx-auto">
              A showcase of different card types, each following the same flowy principles: 
              generous spacing, natural flow, graceful curves, and weightless interactions
            </FlowingText>
          </motion.div>

          {/* Cards Grid - Organic Layout */}
          <div className="space-y-16">
            
            {/* Row 1 - Profile and Product */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12 space-y-16 lg:space-y-0">
              <ProfileCard delay={0.1} />
              <div className="lg:mt-8">
                <ProductCard delay={0.3} />
              </div>
            </div>

            {/* Row 2 - Notifications */}
            <div className="flex justify-center">
              <NotificationCard delay={0.5} />
            </div>

            {/* Row 3 - Event and Music */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-12 space-y-16 lg:space-y-0">
              <div className="lg:ml-16">
                <EventCard delay={0.7} />
              </div>
              <div className="lg:mt-12">
                <MusicCard delay={0.9} />
              </div>
            </div>

            {/* Row 4 - Article */}
            <div className="flex justify-end">
              <div className="lg:mr-16">
                <ArticleCard delay={1.1} />
              </div>
            </div>

            {/* Row 5 - Quote (Centered) */}
            <div className="flex justify-center pt-8">
              <QuoteCard delay={1.3} />
            </div>

          </div>

          {/* Footer */}
          <div className="mt-32 text-center">
            <FlowingText className="text-slate-500 italic">
              Each card flows naturally, breathes with space, and feels weightless to interact with
            </FlowingText>
          </div>

        </div>
      </div>
    </div>
  )
} 