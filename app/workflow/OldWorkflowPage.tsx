"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ProductCard } from "@/components/mercury/product-card";
import { MusicCard } from "@/components/mercury/music-card";
import { MessageCard } from "@/components/mercury/message-card";
import { LocationCard } from "@/components/mercury/location-card";

// Mercury OS Spatial Computing - Remove old scroll animation globals
// Add Mercury spatial state management
declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

export default function OldWorkflowPage() {
  // Sample data for each card type - 7 total steps
  const workflowSteps = [
    {
      id: "location-starbucks",
      title: "Find Location",
      description: "Discover nearby places and businesses",
      component: LocationCard,
      data: {
        title: "Starbucks Reserve",
        type: "Coffee Shop",
        address: "1912 Pike Place, Seattle, WA 98101",
        distance: "0.3 miles",
        rating: 4.8,
        status: "open" as const,
      },
      intent: "starbucks-reserve-location",
      size: "compact" as const,
      width: "w-96",
    },
    {
      id: "message-danny",
      title: "Handle Communications",
      description: "Manage conversations and messages",
      component: MessageCard,
      data: {
        contactName: "Danny Trinh",
        contactHandle: "@dtrinh",
        avatar: "https://i.pravatar.cc/40?u=danny",
        lastMessage:
          "Let me get back to you on that. My schedule is kinda crazy right now with Mercury.",
        timestamp: "Mon 11:26 PM",
        platform: "Twitter Conversation",
        status: "unread" as const,
        messages: [
          {
            text: "Let me get back to you on that. My schedule is kinda crazy right now with Mercury.",
            timestamp: "Mon 11:26 PM",
            isOwn: false,
          },
          {
            text: "Haha. Oh man",
            timestamp: "Mon 11:30 PM",
            isOwn: true,
          },
          {
            text: "I'm excited to see this beast",
            timestamp: "Mon 11:50 PM",
            isOwn: true,
          },
        ],
      },
      intent: "danny-twitter-conversation",
      size: "standard" as const,
      width: "w-96",
    },
    {
      id: "music-taeyeon",
      title: "Control Media",
      description: "Manage music and entertainment",
      component: MusicCard,
      data: {
        title: "Four Seasons",
        artist: "Taeyeon",
        album: "Daily Mix 1",
        platform: "Music from Spotify",
        duration: "3:42",
        currentTime: "1:34",
        progress: 40,
        artwork:
          "https://i.scdn.co/image/ab67616d00001e02c8a11e48c91a982d086afc69",
        status: "paused" as const,
        playlist: "Daily Mix 1",
      },
      intent: "four-seasons-spotify",
      size: "compact" as const,
      width: "w-96",
    },
    {
      id: "product-balenciaga",
      title: "Browse Products",
      description: "Explore and purchase items",
      component: ProductCard,
      data: {
        title: "Black Bonded Speed Sneakers",
        brand: "Balenciaga",
        price: "$795",
        originalPrice: "$950",
        image:
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop",
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
          cost: "Free",
        },
      },
      intent: "balenciaga-speed-sneakers",
      size: "expanded" as const,
      width: "w-96",
    },
    {
      id: "location-blue-bottle",
      title: "Discover More Places",
      description: "Find additional nearby locations",
      component: LocationCard,
      data: {
        title: "Blue Bottle Coffee",
        type: "Cafe",
        address: "300 Broadway, Oakland, CA",
        distance: "1.2 miles",
        rating: 4.6,
        status: "open" as const,
      },
      intent: "blue-bottle-cafe",
      size: "compact" as const,
      width: "w-96",
    },
    {
      id: "music-weeknd",
      title: "Expand Media Library",
      description: "Discover more entertainment options",
      component: MusicCard,
      data: {
        title: "Blinding Lights",
        artist: "The Weeknd",
        album: "After Hours",
        platform: "Apple Music",
        duration: "3:20",
        currentTime: "1:45",
        progress: 52,
        artwork:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
        status: "playing" as const,
        playlist: "Weekend Vibes",
      },
      intent: "weekend-vibes-music",
      size: "compact" as const,
      width: "w-96",
    },
    {
      id: "message-sarah-slack",
      title: "Team Collaboration",
      description: "Connect with your team members",
      component: MessageCard,
      data: {
        contactName: "Sarah Chen",
        contactHandle: "@sarahc",
        avatar: "https://i.pravatar.cc/40?u=sarah",
        lastMessage:
          "The new Mercury components look amazing! Great work on the workflow animations.",
        timestamp: "Today 3:42 PM",
        platform: "Slack Team Chat",
        status: "read" as const,
        messages: [
          {
            text: "Hey! How's the workflow component coming along?",
            timestamp: "Today 2:15 PM",
            isOwn: false,
          },
          {
            text: "Just finished implementing the horizontal scroll. It's looking great!",
            timestamp: "Today 2:18 PM",
            isOwn: true,
          },
          {
            text: "The new Mercury components look amazing! Great work on the workflow animations.",
            timestamp: "Today 3:42 PM",
            isOwn: false,
          },
        ],
      },
      intent: "sarah-slack-team-chat",
      size: "standard" as const,
      width: "w-96",
    },
  ];

  // Mercury OS State Management
  const [currentStep, setCurrentStep] = useState(0);
  const [visibleCards, setVisibleCards] = useState([0]);
  const [manualPosition, setManualPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, position: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate Mercury Flow positioning - intelligent spatial arrangement
  const calculateFlowPosition = () => {
    if (typeof window === "undefined") return manualPosition;

    // If user is manually controlling, use manual position
    if (isDragging || Math.abs(manualPosition) > 10) {
      return manualPosition;
    }

    const viewportWidth = window.innerWidth;
    const cardSpacing = 32; // Space between cards

    // Calculate total width of visible cards
    let totalWidth = 0;
    visibleCards.forEach((cardIndex) => {
      const cardWidth = getCardWidth(workflowSteps[cardIndex].width);
      totalWidth += cardWidth + cardSpacing;
    });
    totalWidth -= cardSpacing; // Remove last spacing

    // If cards fit in viewport, center them
    if (totalWidth <= viewportWidth - 128) {
      // 128px for padding
      return (viewportWidth - totalWidth) / 2 - 64; // 64px base padding
    }

    // Otherwise, position to show current card optimally
    let currentCardPosition = 64; // Start padding
    for (let i = 0; i < currentStep; i++) {
      if (visibleCards.includes(i)) {
        currentCardPosition +=
          getCardWidth(workflowSteps[i].width) + cardSpacing;
      }
    }

    // Position current card at 40% of viewport width
    const targetPosition = viewportWidth * 0.4;
    return targetPosition - currentCardPosition;
  };

  // Helper to get card width in pixels
  const getCardWidth = (widthClass: string) => {
    switch (widthClass) {
      case "w-96":
        return 384;
      default:
        return 384;
    }
  };

  // Mercury OS Kiri Fog System - Subtle depth and focus
  const getKiriFogStyle = (cardIndex: number) => {
    const distanceFromActive = Math.abs(cardIndex - currentStep);
    const isActive = cardIndex === currentStep;

    if (isActive) {
      return {
        opacity: 1,
        filter: "blur(0px) brightness(1)",
        transform: "scale(1) translateY(0px)",
        zIndex: 10,
      };
    }

    // Kiri fog - subtle mist effect for non-active cards
    const fogOpacity = Math.max(0.4, 1 - distanceFromActive * 0.2);
    const fogBlur = Math.min(3, distanceFromActive * 1.5);
    const fogBrightness = Math.max(0.7, 1 - distanceFromActive * 0.1);
    const fogScale = Math.max(0.92, 1 - distanceFromActive * 0.04);
    const fogY = distanceFromActive * 8;

    return {
      opacity: fogOpacity,
      filter: `blur(${fogBlur}px) brightness(${fogBrightness})`,
      transform: `scale(${fogScale}) translateY(${fogY}px)`,
      zIndex: 10 - distanceFromActive,
    };
  };

  // Calculate which card should be active based on current position
  const calculateActiveCard = (position: number) => {
    if (typeof window === "undefined") return 0;

    const viewportCenter = window.innerWidth / 2;
    let cardPosition = 64 - position; // Start position minus current offset

    for (let i = 0; i < visibleCards.length; i++) {
      const cardIndex = visibleCards[i];
      const cardWidth = getCardWidth(workflowSteps[cardIndex].width);
      const cardCenter = cardPosition + cardWidth / 2;

      // If this card's center is closest to viewport center
      if (Math.abs(cardCenter - viewportCenter) < cardWidth / 2 + 32) {
        return cardIndex;
      }

      cardPosition += cardWidth + 32; // Move to next card position
    }

    return currentStep;
  };

  // Handle drag start
  const handleMouseDown = (e: React.MouseEvent) => {
    // Don't start drag if clicking on a card
    if ((e.target as HTMLElement).closest("[data-card-clickable]")) {
      return;
    }

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      position: manualPosition,
    });
  };

  // Handle drag move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;

    // Only consider it a drag if moved more than 5 pixels
    if (Math.abs(deltaX) > 5) {
      setManualPosition(dragStart.position + deltaX);
    }

    // Update active card based on position
    const newActiveCard = calculateActiveCard(dragStart.position + deltaX);
    if (newActiveCard !== currentStep && visibleCards.includes(newActiveCard)) {
      setCurrentStep(newActiveCard);
    }
  };

  // Handle drag end
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Debug state changes
  useEffect(() => {
    console.log("State changed:", {
      visibleCards,
      currentStep,
      totalSteps: workflowSteps.length,
    });
    visibleCards.forEach((cardIndex, i) => {
      const step = workflowSteps[cardIndex];
      console.log(
        `  Card ${i}: Index ${cardIndex}, ID: ${step.id}, Title: ${step.title}`
      );
    });
  }, [visibleCards, currentStep]);

  // Handle card click navigation
  const handleCardClick = (cardIndex: number) => {
    console.log(
      "Card clicked:",
      cardIndex,
      "Visible cards:",
      visibleCards,
      "Current step:",
      currentStep
    );

    // Always spawn next card when any visible card is clicked
    const nextCardIndex = Math.max(...visibleCards) + 1;

    if (
      nextCardIndex < workflowSteps.length &&
      !visibleCards.includes(nextCardIndex)
    ) {
      console.log("Spawning next card:", nextCardIndex);
      const newVisibleCards = [...visibleCards, nextCardIndex];
      console.log("New visible cards will be:", newVisibleCards);
      // Spawn the next card
      setVisibleCards(newVisibleCards);
      // Move to the newly spawned card
      setCurrentStep(nextCardIndex);
    } else if (visibleCards.includes(cardIndex)) {
      // If no more cards to spawn, just navigate to clicked card
      console.log("No more cards to spawn, navigating to:", cardIndex);
      setCurrentStep(cardIndex);
    }

    // Reset manual position for smooth auto-positioning
    setManualPosition(0);
  };

  // Mercury Module Variants - Elegant spawning animation
  const mercuryModuleVariants = {
    hidden: {
      x: 120,
      y: 20,
      opacity: 0,
      scale: 0.85,
      rotateY: 8,
      filter: "blur(6px)",
    },
    visible: () => ({
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        duration: 1.0,
        ease: [0.15, 0.35, 0.25, 0.96],
        opacity: { duration: 0.7, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
        filter: { duration: 0.8, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
        scale: { duration: 0.9, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
        rotateY: { duration: 1.1, delay: 0.05, ease: [0.15, 0.35, 0.25, 0.96] },
      },
    }),
  };

  const flowPosition = calculateFlowPosition();

  return (
    <div>
      <header className="h-16 bg-gray-300 px-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Context</h1>
      </header>
      {/* Mercury Flow Container - Only cards and their interactions */}
      <div
        className="relative overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ perspective: "1200px" }}
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
            ease: [0.15, 0.35, 0.25, 0.96],
            type: "tween",
          }}
          style={{
            willChange: "transform",
            transformStyle: "preserve-3d",
          }}
        >
          {visibleCards.map((cardIndex) => {
            const stepData = workflowSteps[cardIndex];
            const CardComponent = stepData.component;
            const kiriFogStyle = getKiriFogStyle(cardIndex);
            return (
              <motion.div
                key={`card-${cardIndex}-${stepData.id}`}
                custom={cardIndex}
                variants={mercuryModuleVariants}
                initial="hidden"
                animate="visible"
                data-card-clickable="true"
                className={`flex-shrink-0 ${stepData.width} mr-8 relative cursor-pointer`}
                style={{
                  ...kiriFogStyle,
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity, filter",
                }}
                onClick={() => handleCardClick(cardIndex)}
              >
                <motion.div
                  className="relative"
                  animate={{
                    boxShadow:
                      cardIndex === currentStep
                        ? "0 20px 40px -8px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                        : "0 8px 20px -4px rgba(0, 0, 0, 0.08)",
                    y: cardIndex === currentStep ? -4 : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <CardComponent
                    intent={stepData.intent}
                    focusLevel={
                      cardIndex === currentStep ? "focused" : "ambient"
                    }
                    size={stepData.size}
                    data={stepData.data}
                    showNextIndicator={
                      cardIndex === currentStep &&
                      visibleCards.length < workflowSteps.length
                    }
                    onRevealNext={() => handleCardClick(cardIndex)}
                    className="h-full transition-all duration-700 transform-gpu"
                    isInteractive={cardIndex === currentStep}
                  />
                  <motion.div
                    className={`
                      absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      backdrop-blur-sm border border-white/30 shadow-lg
                      ${
                        cardIndex === currentStep
                          ? "bg-slate-900/90 text-white"
                          : cardIndex < currentStep
                            ? "bg-emerald-500/90 text-white"
                            : "bg-white/90 text-slate-600"
                      }
                    `}
                    animate={{
                      scale: cardIndex === currentStep ? 1.1 : 1,
                      rotate: cardIndex === currentStep ? [0, 3, -2, 0] : 0,
                    }}
                    transition={{
                      duration: 1.0,
                      ease: [0.15, 0.35, 0.25, 0.96],
                      rotate: {
                        duration: 1.5,
                        ease: [0.15, 0.35, 0.25, 0.96],
                      },
                    }}
                    key={`badge-${stepData.id}-${currentStep}`}
                  >
                    {cardIndex < currentStep ? "✓" : cardIndex + 1}
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
