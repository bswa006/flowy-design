"use client";

import * as React from "react";
// lucide-react icons imported in child components
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square } from "lucide-react";
import { Context, initialContexts } from "@/lib/contextMockData";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MainCard } from "./MainCard";
import { EditableCard } from "./EditableCard";
import { MercuryUploadsTimeline } from "@/components/mercury/mercury-uploads-timeline";
import { useTimelineData } from "@/hooks/useTimelineData";

declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

// Mercury Editable Card Component
interface MercuryContextCardProps {
  context: Context;
  index: number;
  isEditing: boolean;
  isExpanded: boolean;
  focusLevel: "focused" | "ambient" | "fog";
  onEdit: () => void;
  onSave: (updatedContext: Context) => void;
  onCancel: () => void;
  onToggleInsights: () => void;
}

const INSIGHT_STYLES = {
  keyPainPoint: {
    label: "Key Pain Point",
    pillClass: "bg-orange-400",
    // borderClass: "border-emerald-100",
  },
  desiredFeature: {
    label: "Desired Feature",
    pillClass: "bg-emerald-800",
    // borderClass: "border-blue-100",
  },
};

function MercuryContextCard({
  context,
  index,
  isEditing,
  isExpanded,
  focusLevel,
  onEdit,
  onSave,
  onCancel,
  onToggleInsights,
}: MercuryContextCardProps) {
  const [editedContext, setEditedContext] = useState<Context>(context);

  // Update local state when context changes
  useEffect(() => {
    setEditedContext(context);
  }, [context]);

  const updateField = (field: string, value: string | number | boolean | string[], nested?: string) => {
    setEditedContext((prev) => {
      if (nested) {
        const nestedObj = prev[nested as keyof Context] as Record<string, unknown>;
        return {
          ...prev,
          [nested]: {
            ...nestedObj,
            [field]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleSave = () => {
    onSave(editedContext);
  };

  // Mercury focus classes
  const getFocusClasses = () => {
    switch (focusLevel) {
      case "focused":
        return "scale-[1.02] z-30 opacity-100";
      case "ambient":
        return "scale-100 z-10 opacity-90";
      case "fog":
        return "scale-[0.98] z-0 opacity-40 pointer-events-none blur-[0.5px]";
    }
  };

  return (
    <motion.div
      className="relative group flex"
      layout
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Main card */}
      <motion.div
        className="relative"
        layout
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Card content */}
        <motion.div
          className={`max-w-lg bg-white rounded-2xl shadow-md border border-gray-100 relative transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${getFocusClasses()} ${
            !isEditing ? "cursor-pointer hover:shadow-lg" : ""
          }`}
          layout
          style={{
            height: isEditing ? "80vh" : "auto",
            minHeight: isEditing ? "auto" : "220px",
            width: isEditing ? "600px" : "400px",
            overflow: isEditing ? "hidden" : "visible",
          }}
          animate={{
            width: isEditing ? 600 : 400,
          }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className={`${isEditing ? "h-full flex flex-col" : "p-8"}`}>
            {!isEditing ? (
              <MainCard
                context={context}
                onToggleInsights={onToggleInsights}
                contextNumber={index + 1}
                handleEdit={onEdit}
              />
            ) : (
              <EditableCard
                editedContext={editedContext}
                onSave={handleSave}
                onCancel={onCancel}
                onFieldChange={updateField}
              />
            )}
          </div>
        </motion.div>
      </motion.div>


    </motion.div>
  );
}

export default function OldWorkflowPage() {
  const [contexts, setContexts] = useState<Context[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  
  // Play demo state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [playTimeoutId, setPlayTimeoutId] = useState<NodeJS.Timeout | null>(null);
  
  // Refs for scrolling
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Timeline data hook
  const { timelineUploads, totalUploads, checkpointCount } = useTimelineData({
    contexts,
    currentContextId: editingId || undefined,
  });

  const handleEdit = (contextId: string) => {
    setEditingId(contextId);
    setExpandedIds(new Set()); // Close all insights when editing
  };

  const handleSave = (updatedContext: Context) => {
    setContexts((prev) =>
      prev.map((ctx) => (ctx.id === updatedContext.id ? updatedContext : ctx))
    );
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleToggleInsights = (contextId: string) => {
    if (editingId) return; // Don't toggle insights while editing
    setExpandedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(contextId)) {
        newSet.delete(contextId);
      } else {
        newSet.add(contextId);
      }
      return newSet;
    });
  };

  const getFocusLevel = (contextId: string): "focused" | "ambient" | "fog" => {
    if (editingId === contextId) return "focused";
    if (editingId && editingId !== contextId) return "fog";
    return "ambient";
  };

  // Auto-scroll to card function
  const scrollToCard = useCallback((index: number) => {
    if (cardRefs.current[index] && scrollContainerRef.current) {
      const cardElement = cardRefs.current[index];
      const containerElement = scrollContainerRef.current;
      
      if (cardElement) {
        const cardRect = cardElement.getBoundingClientRect();
        const containerRect = containerElement.getBoundingClientRect();
        
        // Calculate offset needed to center the card in viewport
        const cardTop = cardElement.offsetTop;
        const cardHeight = cardRect.height;
        const containerHeight = containerRect.height;
        const centerOffset = (containerHeight - cardHeight) / 2;
        
        const scrollTop = cardTop - centerOffset;
        
        containerElement.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }
  }, []);

  // Play demo functionality
  const startPlayDemo = useCallback(() => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    setCurrentPlayIndex(0);
    setExpandedIds(new Set()); // Start with no insights shown
    
    // Start the demo sequence
    playNextCardRef.current(0);
  }, [isPlaying]);

  const playNextCard = useCallback((index: number) => {
    if (index >= contexts.length) {
      // Demo finished
      setIsPlaying(false);
      setCurrentPlayIndex(0);
      return;
    }
    
    setCurrentPlayIndex(index);
    
    // Scroll to the current card
    scrollToCard(index);
    
    // Wait a moment for scroll, then show insights
    setTimeout(() => {
      const contextId = contexts[index].id;
      setExpandedIds(prev => {
        const newSet = new Set(prev);
        newSet.add(contextId);
        return newSet;
      });
      
      // Schedule next card
      const timeoutId = setTimeout(() => {
        playNextCard(index + 1);
      }, 3000); // 3 seconds to view each card's insights
      
      setPlayTimeoutId(timeoutId);
    }, 800); // 800ms for scroll animation
  }, [contexts, scrollToCard]);

  // Fix circular dependency by creating a ref for playNextCard
  const playNextCardRef = useRef(playNextCard);
  playNextCardRef.current = playNextCard;

  const pausePlayDemo = useCallback(() => {
    setIsPlaying(false);
    if (playTimeoutId) {
      clearTimeout(playTimeoutId);
      setPlayTimeoutId(null);
    }
  }, [playTimeoutId]);

  const stopPlayDemo = useCallback(() => {
    setIsPlaying(false);
    setCurrentPlayIndex(0);
    setExpandedIds(new Set()); // Close all insights
    if (playTimeoutId) {
      clearTimeout(playTimeoutId);
      setPlayTimeoutId(null);
    }
  }, [playTimeoutId]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (playTimeoutId) {
        clearTimeout(playTimeoutId);
      }
    };
  }, [playTimeoutId]);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-gray-300 px-6 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-semibold text-foreground">Context</h1>
        
        {/* Play Demo Controls */}
        <div className="flex items-center gap-2">
          {!isPlaying ? (
            <button
              onClick={startPlayDemo}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              disabled={editingId !== null}
            >
              <Play className="w-4 h-4" />
              Play Demo
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={pausePlayDemo}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <Pause className="w-4 h-4" />
                Pause
              </button>
              <button
                onClick={stopPlayDemo}
                className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
              <div className="text-sm text-gray-700 ml-2">
                Card {currentPlayIndex + 1} of {contexts.length}
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Timeline Section */}
      <div className="border-b border-gray-200 flex-shrink-0">
        <MercuryUploadsTimeline 
          intent="workflow-timeline"
          uploads={timelineUploads}
          totalUploads={totalUploads}
          checkpointCount={checkpointCount}
          focusLevel="ambient"
          className="max-w-none"
        />
      </div>
      
      {/* Scrollable Content Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <div className="p-12">
          <AnimatePresence>
            {contexts.map((context, idx) => (
              <div 
                key={context.id} 
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                className={`relative mb-8 flex items-start justify-center ${
                  isPlaying && currentPlayIndex === idx ? 'ring-2 ring-blue-400 rounded-xl' : ''
                }`}
              >
                {/* Main Context Card */}
                <div className="relative">
                    <MercuryContextCard
                      context={context}
                      index={idx}
                      isEditing={editingId === context.id}
                      isExpanded={expandedIds.has(context.id)}
                      focusLevel={getFocusLevel(context.id)}
                      onEdit={() => handleEdit(context.id)}
                      onSave={handleSave}
                      onCancel={handleCancel}
                      onToggleInsights={() => handleToggleInsights(context.id)}
                    />
                  

                  </div>
                

                  
                  {/* Insights Panel - positioned relative to outer container that creates the gap */}
                  {expandedIds.has(context.id) && !editingId && (
                    <motion.div
                      className="p-4 z-40 pointer-events-auto"
                      style={{
                        // left: 'calc(50% + 220px)', // Center of container + half card width + margin  
                        // top: '50%', // 50% 
                        // transform: 'translateY(-50%)' // Center panel itself
                      }}
                      initial={{ opacity: 0, x: 20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >

                      {/* Insights Container */}
                        <div className="flex flex-col gap-y-3">
                  
                          
                          {/* Key Pain Points - Show 2 */}
                          {Array.isArray(context.extracted_metadata?.key_pain_points) &&
                          context.extracted_metadata.key_pain_points.slice(0, 2).map(
                              (point: string, i: number) => (
                                <Tooltip key={"pain-" + i}>
                                  <TooltipTrigger
                                    asChild
                                    className="flex items-center cursor-pointer"
                                  >
                                    <div className="bg-orange-50 rounded-lg px-3 py-2 flex items-center gap-2 hover:bg-orange-100 transition-colors">
                                      <span
                                        className={`w-2 h-2 ${INSIGHT_STYLES.keyPainPoint.pillClass} rounded-full flex-shrink-0`}
                                      />
                                      <div className="text-gray-900 text-xs font-medium leading-relaxed">
                                        {point}
                                      </div>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    sideOffset={8}
                                    className="bg-gray-800 text-white rounded-lg text-xs font-normal"
                                  >
                                    key pain point
                                  </TooltipContent>
                                </Tooltip>
                              )
                            )}
                          
                        {/* Desired Features - Show 2 */}
                          {Array.isArray(context.extracted_metadata?.desired_features) &&
                          context.extracted_metadata.desired_features.slice(0, 2).map(
                              (feature: string, i: number) => (
                                <Tooltip key={"feature-" + i}>
                                  <TooltipTrigger asChild>
                                    <div className="bg-emerald-50 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-emerald-100 transition-colors">
                                      <span
                                        className={`w-2 h-2 rounded-full ${INSIGHT_STYLES.desiredFeature.pillClass} flex-shrink-0`}
                                      />
                                      <span className="text-gray-900 text-xs font-medium leading-relaxed">
                                        {feature}
                                      </span>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="left"
                                    sideOffset={8}
                                    className="bg-gray-800 text-white rounded-lg text-xs font-normal"
                                  >
                                    desired feature
                                  </TooltipContent>
                                </Tooltip>
                              )
                            )}

                        {/* Integrations Required - Show 2 */}
                        {Array.isArray(context.extracted_metadata?.integrations_required) &&
                          context.extracted_metadata.integrations_required.slice(0, 2).map(
                            (integration: string, i: number) => (
                              <Tooltip key={"integration-" + i}>
                                <TooltipTrigger asChild>
                                  <div className="bg-blue-50 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-blue-100 transition-colors">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                    <span className="text-gray-900 text-xs font-medium leading-relaxed">
                                      {integration}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="left"
                                  sideOffset={8}
                                  className="bg-gray-800 text-white rounded-lg text-xs font-normal"
                                >
                                  integration required
                                </TooltipContent>
                              </Tooltip>
                            )
                          )}

                        {/* Market Gaps - Show 2 */}
                        {Array.isArray(context.extracted_metadata?.market_gaps) &&
                          context.extracted_metadata.market_gaps.slice(0, 2).map(
                            (gap: string, i: number) => (
                              <Tooltip key={"gap-" + i}>
                                <TooltipTrigger asChild>
                                  <div className="bg-red-50 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-red-100 transition-colors">
                                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                                    <span className="text-gray-900 text-xs font-medium leading-relaxed">
                                      {gap}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="left"
                                  sideOffset={8}
                                  className="bg-gray-800 text-white rounded-lg text-xs font-normal"
                                >
                                  market gap
                                </TooltipContent>
                              </Tooltip>
                            )
                          )}

                        {/* Key Differentiators - Show 2 */}
                        {Array.isArray(context.extracted_metadata?.key_differentiators) &&
                          context.extracted_metadata.key_differentiators.slice(0, 2).map(
                            (diff: string, i: number) => (
                              <Tooltip key={"diff-" + i}>
                                <TooltipTrigger asChild>
                                  <div className="bg-purple-50 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer hover:bg-purple-100 transition-colors">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0" />
                                    <span className="text-gray-900 text-xs font-medium leading-relaxed">
                                      {diff}
                                    </span>
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side="left"
                                  sideOffset={8}
                                  className="bg-gray-800 text-white rounded-lg text-xs font-normal"
                                >
                                  key differentiator
                                </TooltipContent>
                              </Tooltip>
                            )
                          )}
                      </div>
                    </motion.div>
                  )}
              </div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
