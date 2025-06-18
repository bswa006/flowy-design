"use client";

import * as React from "react";

import Link from "next/link";

import { motion } from "framer-motion";
import { ArrowRight, Cloud, Droplets, Heart, Sparkles } from "lucide-react";

// True Flowy Card - feels like floating on water
const FlowyCard = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 1.2,
      delay,
      ease: [0.25, 0.4, 0.25, 1], // Natural easing like water
    }}
    whileHover={{
      y: -8,
      scale: 1.02,
      transition: { duration: 0.6, ease: [0.25, 0.4, 0.25, 1] },
    }}
    className={`
      bg-white/20 
      backdrop-blur-xl 
      border border-white/10
      rounded-[2rem]
      p-12
      shadow-2xl shadow-black/5
      hover:shadow-3xl hover:shadow-black/10
      transition-all duration-700 ease-out
      ${className}
    `}
  >
    {children}
  </motion.div>
);

// Flowing text that breathes
const FlowingText = ({
  children,
  size = "base",
  className = "",
}: {
  children: React.ReactNode;
  size?: "sm" | "base" | "lg" | "xl" | "2xl";
  className?: string;
}) => {
  const sizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-loose",
    lg: "text-lg leading-loose",
    xl: "text-2xl leading-loose font-light",
    "2xl": "text-4xl leading-loose font-light",
  };

  return (
    <div
      className={`
      text-slate-700 
      ${sizeClasses[size]}
      ${className}
    `}
    >
      {children}
    </div>
  );
};

// Main page with true flowy layout
export default function TrueFlowyShowcase() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Generous breathing space at top */}
      <div className="pt-24 pb-32">
        {/* Hero section with natural flow */}
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.25, 0.4, 0.25, 1] }}
            className="text-center mb-24"
          >
            <h1 className="text-6xl font-light text-slate-800 mb-8 leading-tight">
              True Flowy Design
            </h1>
            <FlowingText size="xl" className="text-slate-600 max-w-3xl mx-auto">
              Cards that float like clouds, flow like water, and breathe with
              generous space
            </FlowingText>

            {/* Navigation to Cards Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1,
                delay: 0.5,
                ease: [0.25, 0.4, 0.25, 1],
              }}
              className="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/cards"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-white/30 backdrop-blur-lg border border-white/20 rounded-2xl text-slate-700 hover:text-slate-800 hover:bg-white/40 transition-all duration-500 ease-out hover:scale-105"
              >
                <span className="text-lg font-medium">
                  Explore Card Collection
                </span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/mercury-demo"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-blue-500/20 backdrop-blur-lg border border-blue-300/30 rounded-2xl text-blue-700 hover:text-blue-800 hover:bg-blue-500/30 transition-all duration-500 ease-out hover:scale-105"
              >
                <span className="text-lg font-medium">Mercury OS Demo</span>
                <Sparkles className="w-5 h-5" />
              </Link>

              <Link
                href="/enterprise-demo"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-lg border border-purple-300/30 rounded-2xl text-purple-700 hover:text-purple-800 hover:from-purple-500/30 hover:to-indigo-500/30 transition-all duration-500 ease-out hover:scale-105"
              >
                <span className="text-lg font-medium">
                  Enterprise Dashboard
                </span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/mercury-flow-demo"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-slate-500/20 to-slate-600/20 backdrop-blur-lg border border-slate-300/30 rounded-2xl text-slate-700 hover:text-slate-800 hover:from-slate-500/30 hover:to-slate-600/30 transition-all duration-500 ease-out hover:scale-105"
              >
                <span className="text-lg font-medium">Mercury Flow Cards</span>
                <Cloud className="w-5 h-5" />
              </Link>

              <Link
                href="/workflow"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-lg border border-emerald-300/30 rounded-2xl text-emerald-700 hover:text-emerald-800 hover:from-emerald-500/30 hover:to-teal-500/30 transition-all duration-500 ease-out hover:scale-105"
              >
                <span className="text-lg font-medium">Workflow Demo</span>
                <Droplets className="w-5 h-5" />
              </Link>

              <Link
                href="/canvas-workflow"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-lg border border-orange-300/30 rounded-2xl text-orange-700 hover:text-orange-800 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-500 ease-out hover:scale-105"
              >
                <span className="text-lg font-medium">
                  Playbook Demo
                </span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Organic card layout - like stones in a stream */}
          <div className="space-y-16">
            {/* First flowing card */}
            <FlowyCard delay={0.2} className="max-w-4xl mx-auto">
              <div className="flex items-start space-x-8">
                <div className="p-6 bg-blue-100/50 rounded-2xl">
                  <Droplets className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1 space-y-6">
                  <FlowingText size="2xl" className="text-slate-800">
                    Generous Whitespace
                  </FlowingText>
                  <FlowingText className="text-slate-600">
                    Every element has room to breathe, like islands floating
                    peacefully in a calm sea. No cramped layouts, no fighting
                    for space - just natural, comfortable distance that lets
                    your eyes rest and your mind focus.
                  </FlowingText>
                </div>
              </div>
            </FlowyCard>

            {/* Second card - offset naturally */}
            <div className="ml-8">
              <FlowyCard delay={0.4} className="max-w-4xl">
                <div className="flex items-start space-x-8">
                  <div className="p-6 bg-purple-100/50 rounded-2xl">
                    <Cloud className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <FlowingText size="2xl" className="text-slate-800">
                      Natural Flow
                    </FlowingText>
                    <FlowingText className="text-slate-600">
                      Content moves like water around stones - organically,
                      effortlessly. Your eye follows a natural path from element
                      to element, never forced or jarring, always smooth and
                      predictable like a gentle stream.
                    </FlowingText>
                  </div>
                </div>
              </FlowyCard>
            </div>

            {/* Third card - back to center */}
            <FlowyCard delay={0.6} className="max-w-4xl mx-auto">
              <div className="flex items-start space-x-8">
                <div className="p-6 bg-pink-100/50 rounded-2xl">
                  <Heart className="w-8 h-8 text-pink-600" />
                </div>
                <div className="flex-1 space-y-6">
                  <FlowingText size="2xl" className="text-slate-800">
                    Graceful Curves
                  </FlowingText>
                  <FlowingText className="text-slate-600">
                    Soft, rounded edges everywhere - like smooth river stones
                    worn by countless years of flowing water. No harsh
                    rectangles or rigid angles, just gentle curves that feel
                    warm and welcoming to the human eye.
                  </FlowingText>
                </div>
              </div>
            </FlowyCard>

            {/* Fourth card - slightly offset */}
            <div className="mr-8">
              <FlowyCard delay={0.8} className="max-w-4xl ml-auto">
                <div className="flex items-start space-x-8">
                  <div className="p-6 bg-green-100/50 rounded-2xl">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <div className="flex-1 space-y-6">
                    <FlowingText size="2xl" className="text-slate-800">
                      Weightless Feeling
                    </FlowingText>
                    <FlowingText className="text-slate-600">
                      Cards hover like morning mist, never heavy or oppressive.
                      They lift gently when you approach, settle softly when you
                      interact, creating a sense of lightness that makes the
                      whole experience feel effortless and joyful.
                    </FlowingText>
                  </div>
                </div>
              </FlowyCard>
            </div>
          </div>

          {/* Breathing space at bottom */}
          <div className="mt-32 text-center">
            <FlowingText className="text-slate-500 italic">
              This is what "flowy" truly means - generous, natural, graceful,
              weightless
            </FlowingText>
          </div>
        </div>
      </div>
    </div>
  );
}
