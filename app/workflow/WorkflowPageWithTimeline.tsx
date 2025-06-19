"use client";

import { TimelineWrapper } from "@/components/ui/timeline-wrapper";
import { Context, initialContexts } from "@/lib/contextMockData";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { InsightsPanel } from "./components/InsightsPanel";
import { EditableCard } from "./EditableCard";
import { MainCard } from "./MainCard";

declare global {
  interface Window {
    mercurySpaceDepth?: number;
  }
}

// Mercury Context Card Component for Timeline
interface MercuryTimelineCardProps {
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

function MercuryTimelineCard({
  context,
  index,
  isEditing,
  isExpanded,
  focusLevel,
  onEdit,
  onSave,
  onCancel,
  onToggleInsights,
}: MercuryTimelineCardProps) {
  const [editedContext, setEditedContext] = useState<Context>(context);

  // Update local state when context changes
  useEffect(() => {
    setEditedContext(context);
  }, [context]);

  const updateField = (
    field: string,
    value: string | number | boolean | string[],
    nested?: string
  ) => {
    setEditedContext((prev) => {
      if (nested) {
        const nestedObj = prev[nested as keyof Context] as Record<
          string,
          unknown
        >;
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
    <div className="relative group flex">
      {/* Main card */}
      <motion.div
        className="relative"
        layout
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
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

      {/* Insights Panel - positioned to the right */}
      {isExpanded && !isEditing && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="ml-6 flex-shrink-0"
        >
          <InsightsPanel
            intent="insights-panel"
            context={context}
            isVisible={true}
          />
        </motion.div>
      )}
    </div>
  );
}

export default function WorkflowPageWithTimeline() {
  const [contexts, setContexts] = useState<Context[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Play demo state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [playTimeoutId, setPlayTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  );

  // Refs for scrolling to timeline items
  const timelineItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to timeline item function
  const scrollToTimelineItem = useCallback((index: number) => {
    if (timelineItemRefs.current[index] && scrollContainerRef.current) {
      const itemElement = timelineItemRefs.current[index];
      const containerElement = scrollContainerRef.current;

      if (itemElement) {
        // Scroll directly to the target card - this positions it at the top and hides previous cards
        const itemTop = itemElement.offsetTop;

        // No offset - scroll directly to the target position to hide previous cards
        const scrollTop = itemTop;

        containerElement.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: "smooth",
        });
      }
    }
  }, []);

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
    setExpandedIds((prev) => {
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

    // Highlight current card during demo playback
    if (isPlaying) {
      const currentContext = contexts[currentPlayIndex];
      if (currentContext && currentContext.id === contextId) {
        return "focused";
      } else {
        return "fog";
      }
    }

    return "ambient";
  };

  // Play demo functionality
  const startPlayDemo = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);
    playNextCardRef.current(currentPlayIndex);
  }, [isPlaying, currentPlayIndex]);

  const playNextCard = useCallback(
    (index: number) => {
      if (index >= contexts.length) {
        // Demo finished
        setIsPlaying(false);
        setCurrentPlayIndex(0);
        return;
      }

      setCurrentPlayIndex(index);

      // Scroll to the current timeline item
      scrollToTimelineItem(index);

      // Wait a moment for scroll, then show insights
      setTimeout(() => {
        const contextId = contexts[index].id;
        setExpandedIds((prev) => {
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
    },
    [contexts, scrollToTimelineItem]
  );

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

  // Prepare timeline data from contexts
  const timelineData = contexts.map((context, index) => {
    // Format the date from recorded_on
    const recordedDate = new Date(context.upload.recorded_on);
    const formattedDate = recordedDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return {
      title: formattedDate,
      content: (
        <MercuryTimelineCard
          context={context}
          index={index}
          isEditing={editingId === context.id}
          isExpanded={expandedIds.has(context.id)}
          focusLevel={getFocusLevel(context.id)}
          onEdit={() => handleEdit(context.id)}
          onSave={handleSave}
          onCancel={handleCancel}
          onToggleInsights={() => handleToggleInsights(context.id)}
        />
      ),
    };
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Beautiful Mercury Header */}
      <header
        data-intent="workflow-header"
        className="relative h-20 bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-200/60 px-8 flex items-center justify-between flex-shrink-0 shadow-sm"
      >
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03),transparent_70%)]" />

        {/* Left Side - Breadcrumb Navigation */}
        <div className="relative z-10 flex items-center space-x-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-center space-x-2"
          >
            {/* Breadcrumb with elegant styling */}
            <div className="flex items-center space-x-2 text-slate-600">
              <span className="font-medium transition-colors cursor-pointer">
                The Get Shit Done
              </span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="font-medium transition-colors cursor-pointer">
                Acme Company
              </span>
              <div className="w-1 h-1 bg-slate-300 rounded-full" />
              <span className="font-medium text-slate-800">Context</span>
            </div>
          </motion.div>

          {/* Subtle Badge */}
          {/* <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="ml-4 px-3 py-1 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-full"
          >
            <span className="text-xs font-medium text-blue-700">
              {contexts.length} Contexts
            </span>
          </motion.div> */}
        </div>

        {/* Right Side Play Demo Controls - COMMENTED OUT
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative z-10 flex items-center gap-3"
        >
          Play demo controls removed for cleaner UI
        </motion.div>
        */}
      </header>

      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        <AnimatePresence>
          <TimelineWrapper
            data={timelineData}
            itemRefs={timelineItemRefs}
            scrollContainer={scrollContainerRef}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}
