"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"

// Import our clean Mercury card components
import { ProductCard } from "@/components/mercury/product-card"
import { MusicCard } from "@/components/mercury/music-card"
import { MessageCard } from "@/components/mercury/message-card"
import { LocationCard } from "@/components/mercury/location-card"

export default function WorkflowPage() {
  // Workflow state management
  const [currentStep, setCurrentStep] = useState(0)
  const [visibleCards, setVisibleCards] = useState([0]) // Track which cards are visible
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
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
      width: "w-120"
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
      width: "w-120"
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
      width: "w-140"
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
      width: "w-80"
    }
  ]

  // Navigation functions
  const nextStep = () => {
    if (currentStep < workflowSteps.length - 1) {
      const newStep = currentStep + 1
      setCurrentStep(newStep)
      
      // Add the new card to visible cards if not already visible
      if (!visibleCards.includes(newStep)) {
        setVisibleCards(prev => [...prev, newStep])
      }
      
      // Scroll to show the new card
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const cardWidth = 320 + 32 // card width + gap
          scrollContainerRef.current.scrollTo({
            left: newStep * cardWidth,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1
      setCurrentStep(newStep)
      
      // Scroll to show the previous card
      setTimeout(() => {
        if (scrollContainerRef.current) {
          const cardWidth = 320 + 32 // card width + gap
          scrollContainerRef.current.scrollTo({
            left: newStep * cardWidth,
            behavior: 'smooth'
          })
        }
      }, 100)
    }
  }

  const goToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex)
    
    // Add all cards up to and including the target step
    const newVisibleCards = Array.from({ length: stepIndex + 1 }, (_, i) => i)
    setVisibleCards(newVisibleCards)
    
    // Scroll to the target card
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const cardWidth = 320 + 32 // card width + gap
        scrollContainerRef.current.scrollTo({
          left: stepIndex * cardWidth,
          behavior: 'smooth'
        })
      }
    }, 100)
  }

  // Mercury animation variants for cards sliding in
  const cardVariants = {
    hidden: {
      x: 400,
      opacity: 0,
      scale: 0.9,
      filter: "blur(8px)"
    },
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94] // Mercury easing
      }
    })
  }

  const currentStepData = workflowSteps[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Header Section */}
      {/* <div className="px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl"
        >
          <p className="text-xl text-slate-600 leading-relaxed max-w-3xl">
            Experience a step-by-step workflow powered by Mercury design principles. 
            Each module demonstrates focused interaction patterns with natural horizontal flow.
          </p>
        </motion.div>
      </div> */}



      {/* Main Workflow Area */}
      <div className="px-8 pb-16">
        <div className="mx-auto">
          
          {/* Horizontal Scrolling Card Container */}
          <div className="mb-16">
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto overflow-y-visible py-8 px-8 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <div className="flex space-x-8 w-max">
                {visibleCards.map((cardIndex) => {
                  const stepData = workflowSteps[cardIndex]
                  const CardComponent = stepData.component as any
                  
                  return (
                    <motion.div
                      key={stepData.id}
                      custom={cardIndex}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className={`flex-shrink-0 ${stepData.width} h-auto`}
                    >
                      <div className={`
                        relative transition-all duration-300 transform-gpu
                        ${cardIndex === currentStep 
                          ? 'scale-105 z-10' 
                          : cardIndex < currentStep 
                            ? 'scale-95 opacity-80' 
                            : 'scale-100'
                        }
                      `}>
                        <CardComponent
                          intent={stepData.intent}
                          focusLevel={cardIndex === currentStep ? "focused" : "ambient"}
                          size={stepData.size}
                          data={stepData.data}
                          className={`
                            h-full transition-shadow duration-500 transform-gpu
                            ${cardIndex === currentStep 
                              ? 'shadow-2xl ring-2 ring-slate-200' 
                              : 'shadow-lg hover:shadow-xl'
                            }
                          `}
                          isInteractive={true}
                        />
                        
                        {/* Step Number Badge */}
                        <div className={`
                          absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                          transition-all duration-300
                          ${cardIndex === currentStep 
                            ? 'bg-slate-900 text-white scale-110' 
                            : cardIndex < currentStep 
                              ? 'bg-emerald-500 text-white' 
                              : 'bg-slate-200 text-slate-600'
                          }
                        `}>
                          {cardIndex < currentStep ? '✓' : cardIndex + 1}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center space-x-6"
          >
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`
                flex items-center space-x-3 px-6 py-3 rounded-xl font-medium
                transition-all duration-300 transform-gpu
                ${currentStep === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                }
                border border-slate-200 shadow-sm
              `}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            <div className="flex items-center space-x-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/40">
              <span className="text-sm font-medium text-slate-600">
                {currentStep + 1} / {workflowSteps.length}
              </span>
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === workflowSteps.length - 1}
              className={`
                flex items-center space-x-3 px-6 py-3 rounded-xl font-medium
                transition-all duration-300 transform-gpu
                ${currentStep === workflowSteps.length - 1
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'
                }
                shadow-sm
              `}
            >
              <span>Next</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>

          {/* Workflow Completion */}
          {currentStep === workflowSteps.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Workflow Complete!</h3>
                <p className="text-slate-600 mb-4">
                  You've experienced all {workflowSteps.length} Mercury workflow components.
                </p>
                <button
                  onClick={() => {
                    setCurrentStep(0)
                    setVisibleCards([0])
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' })
                    }
                  }}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>Restart Workflow</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Enhanced Navigation */}
      <div className="px-8 py-12 bg-gradient-to-r from-slate-50 to-white border-t border-slate-200/50">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center space-x-3 text-slate-600 hover:text-slate-900 transition-all duration-300 group"
          >
            <div className="p-3 rounded-full bg-white/60 group-hover:bg-white transition-all duration-300 shadow-sm group-hover:shadow-md">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </div>
            <span className="font-medium text-lg">Back to Home</span>
          </Link>
        </motion.div>
      </div>

      {/* Hide scrollbar styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
} 