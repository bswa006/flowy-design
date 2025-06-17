"use client";

import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface FlowCard {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  status?: "active" | "completed" | "pending" | "neutral";
  time?: string;
}

interface MercuryFlowCardsProps {
  intent: string;
  focusLevel?: "focused" | "ambient" | "fog";
  cards: FlowCard[];
  className?: string;
  onCardSelect?: (cardId: string) => void;
}

export function MercuryFlowCards({
  intent,
  focusLevel = "ambient",
  cards,
  className,
  onCardSelect,
}: MercuryFlowCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Natural easing inspired by Mercury OS
  const naturalEase = [0.25, 0.46, 0.45, 0.94];

  // Handle card navigation
  const handleCardSelect = (index: number) => {
    setCurrentIndex(index);
    onCardSelect?.(cards[index].id);
  };

  // Handle drag to navigate
  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;

    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -threshold && currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    setIsDragging(false);
  };

  return (
    <div
      data-intent={intent}
      className={cn(
        "mercury-flow-container relative h-[400px] w-full overflow-hidden",
        "bg-gradient-to-br from-slate-50 to-white",
        "rounded-2xl border border-white/20 shadow-xl",
        className
      )}
      role="region"
      aria-label={`${intent} flow cards`}
      style={{ perspective: "1000px" }}
    >
      {/* Flow Cards */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="sync">
          {cards.map((card, index) => {
            const distance = index - currentIndex;
            const absDistance = Math.abs(distance);
            const isActive = index === currentIndex;

            // Spatial positioning
            const translateX = distance * 100;
            const translateZ = -absDistance * 50;
            const rotateY = distance * 5;
            const scale = Math.max(0.8, 1 - absDistance * 0.1);
            const opacity = Math.max(0.4, 1 - absDistance * 0.2);

            return (
              <motion.div
                key={card.id}
                className={cn(
                  "absolute w-80 h-64 cursor-pointer",
                  "transform-gpu will-change-transform"
                )}
                initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                animate={{
                  x: translateX,
                  z: translateZ,
                  rotateY,
                  scale,
                  opacity,
                }}
                exit={{ opacity: 0, scale: 0.8, rotateY: -20 }}
                transition={{
                  duration: 0.8,
                  ease: naturalEase,
                }}
                drag="x"
                dragConstraints={{ left: -150, right: 150 }}
                dragElastic={0.3}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handleDragEnd}
                onClick={() => !isDragging && handleCardSelect(index)}
                style={{
                  transformStyle: "preserve-3d",
                  zIndex: 10 - absDistance,
                }}
                whileHover={isActive ? { scale: scale * 1.02 } : {}}
                whileTap={isActive ? { scale: scale * 0.98 } : {}}
              >
                {/* Card Content */}
                <div
                  className={cn(
                    "w-full h-full rounded-xl overflow-hidden",
                    "bg-white/90 backdrop-blur-sm",
                    "border border-white/30 shadow-lg",
                    isActive && "ring-1 ring-blue-200/50",
                    card.status === "active" && "border-blue-200/60",
                    card.status === "completed" && "border-emerald-200/60",
                    card.status === "pending" && "border-amber-200/60"
                  )}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {/* Status Indicator */}
                  <div className="flex items-center justify-between p-4 pb-2">
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        card.status === "active" && "bg-blue-500",
                        card.status === "completed" && "bg-emerald-500",
                        card.status === "pending" && "bg-amber-500",
                        !card.status && "bg-slate-300"
                      )}
                    />

                    {card.time && (
                      <span className="text-xs text-slate-500 font-medium">
                        {card.time}
                      </span>
                    )}
                  </div>

                  {/* Card Header */}
                  <div className="px-4 pb-2">
                    <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                      {card.title}
                    </h3>

                    {card.subtitle && (
                      <p className="text-sm text-slate-600 mt-1">
                        {card.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="px-4 pb-4">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {card.content}
                    </p>
                  </div>
                </div>

                {/* 3D Shadow */}
                <div
                  className="absolute inset-0 bg-black/5 rounded-xl -z-10"
                  style={{
                    transform: "translateZ(-10px) scale(0.98)",
                    filter: "blur(8px)",
                  }}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-2 px-3 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/30 shadow-sm">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => handleCardSelect(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex
                  ? "bg-slate-800 w-4"
                  : "bg-slate-300 hover:bg-slate-400"
              )}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
