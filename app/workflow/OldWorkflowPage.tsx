"use client";

import * as React from "react";
// lucide-react icons imported in child components
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
          className={`max-w-lg mx-auto bg-white rounded-2xl shadow-md border border-gray-100 relative transition-all duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${getFocusClasses()} ${
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

      {/* Insights cards and arrows */}
      <AnimatePresence>
        {isExpanded && !isEditing && (
          <motion.div
            className="flex items-center ml-8 relative z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Insights column */}
            <div className="flex flex-col gap-y-4">
              {/* Key Pain Points as individual cards */}
              {Array.isArray(context.extracted_metadata?.key_pain_points) &&
                context.extracted_metadata.key_pain_points.map(
                  (point: string, i: number) => (
                    <Tooltip key={"pain-" + i}>
                      <TooltipTrigger
                        asChild
                        className="flex items-center cursor-pointer"
                      >
                        <div
                          className={`relative max-w-xs bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2`}
                        >
                          <span
                            className={`w-fit h-fit p-1 text-xs ${INSIGHT_STYLES.keyPainPoint.pillClass} rounded-full`}
                          />
                          <div className="text-gray-900 text-xs font-medium">
                            {point}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={0}
                        className="bg-gray-800 text-white rounded-lg text-xs font-normal opacity-100"
                      >
                        key pain point
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
              {/* Desired Features as individual cards */}
              {Array.isArray(context.extracted_metadata?.desired_features) &&
                context.extracted_metadata.desired_features.map(
                  (feature: string, i: number) => (
                    <Tooltip key={"feature-" + i}>
                      <TooltipTrigger asChild>
                        <div
                          id={`insight-feature-${index}-${i}`}
                          className="relative max-w-xs bg-white rounded-lg shadow-md px-3 py-2 flex items-center gap-2 cursor-pointer"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${INSIGHT_STYLES.desiredFeature.pillClass} inline-block`}
                          />
                          <span className="text-gray-900 text-xs font-medium">
                            {feature}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={0}
                        className="bg-gray-800 text-white rounded-lg text-xs font-normal opacity-100"
                      >
                        desired feature
                      </TooltipContent>
                    </Tooltip>
                  )
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OldWorkflowPage() {
  const [contexts, setContexts] = useState<Context[]>(initialContexts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Timeline data hook
  const { timelineUploads, totalUploads, checkpointCount } = useTimelineData({
    contexts,
    currentContextId: editingId || undefined,
  });

  const handleEdit = (contextId: string) => {
    setEditingId(contextId);
    setExpandedId(null); // Close insights when editing
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
    setExpandedId(expandedId === contextId ? null : contextId);
  };

  const getFocusLevel = (contextId: string): "focused" | "ambient" | "fog" => {
    if (editingId === contextId) return "focused";
    if (editingId && editingId !== contextId) return "fog";
    return "ambient";
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="h-16 bg-gray-300 px-6 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-semibold text-foreground">Context</h1>
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
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-8 p-12">
          <AnimatePresence>
            {contexts.map((context, idx) => (
              <MercuryContextCard
                key={context.id}
                context={context}
                index={idx}
                isEditing={editingId === context.id}
                isExpanded={expandedId === context.id}
                focusLevel={getFocusLevel(context.id)}
                onEdit={() => handleEdit(context.id)}
                onSave={handleSave}
                onCancel={handleCancel}
                onToggleInsights={() => handleToggleInsights(context.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
