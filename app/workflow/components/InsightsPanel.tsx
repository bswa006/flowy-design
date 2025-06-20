"use client";

import React from "react";
import { motion } from "framer-motion";
import { Context } from "@/lib/contextMockData";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";
import { Lightbulb, Edit2, Check, X } from "lucide-react";

interface InsightsPanelProps {
  intent: "insights-panel" | "insights-panel-grid";
  context: Context;
  isVisible: boolean;
  onInsightUpdate?: (contextId: string, updatedInsights: string[]) => void;
}

const INSIGHT_STYLES = {
  keyPainPoint: {
    label: "Key Pain Point",
    pillClass: "bg-orange-400",
    containerClass: "bg-orange-50 hover:bg-orange-100",
    tooltip: "key pain point",
  },
  desiredFeature: {
    label: "Desired Feature",
    pillClass: "bg-emerald-800",
    containerClass: "bg-emerald-50 hover:bg-emerald-100",
    tooltip: "desired feature",
  },
  integration: {
    label: "Integration Required",
    pillClass: "bg-blue-500",
    containerClass: "bg-blue-50 hover:bg-blue-100",
    tooltip: "integration required",
  },
  marketGap: {
    label: "Market Gap",
    pillClass: "bg-red-500",
    containerClass: "bg-red-50 hover:bg-red-100",
    tooltip: "market gap",
  },
  differentiator: {
    label: "Key Differentiator",
    pillClass: "bg-purple-500",
    containerClass: "bg-purple-50 hover:bg-purple-100",
    tooltip: "key differentiator",
  },
} as const;
interface CategoryData {
  title: string;
  insights: { text: string; source: string; source_id: string }[];
  style: {
    label: string;
    pillClass: string;
    containerClass: string;
    tooltip: string;
  };
  maxVisible: number;
}

function InsightCategory({
  category,
  isExpanded,
  onToggle,
}: {
  category: CategoryData;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const visibleInsights = isExpanded
    ? category.insights
    : category.insights.slice(0, category.maxVisible);
  const hasMore = category.insights.length > category.maxVisible;

  if (category.insights.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Category Header */}
      <div
        className={`px-3 py-2 border-b border-gray-200 cursor-pointer flex items-center justify-between`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-800">
            {category.title}
          </span>
          <span className="text-[10px] text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded-full">
            {category.insights.length}
          </span>
        </div>
        {hasMore && (
          <span className="text-[10px] text-gray-600">
            {isExpanded ? "−" : "+"}
          </span>
        )}
      </div>

      {/* Category Content */}
      <div className="p-2 space-y-1">
        {visibleInsights.map((insight, i) => {
          // Group insights by source for cleaner display
          const isNewCard =
            i === 0 || visibleInsights[i - 1].source !== insight.source;

          return (
            <div key={i}>
              {isNewCard && visibleInsights.length > 3 && (
                <div className="text-[9px] text-gray-400 font-medium mb-1 mt-2 first:mt-0">
                  {insight.source}
                </div>
              )}
              <div className="text-xs text-gray-700 pl-2">
                <span
                  className={`inline-block align-middle mr-2 w-1.5 h-1.5 ${category.style.pillClass} rounded-full`}
                />
                {insight.text}
              </div>
            </div>
          );
        })}

        {!isExpanded && hasMore && (
          <div
            className="text-[10px] text-blue-600 cursor-pointer hover:text-blue-800 pl-2 pt-1"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            +{category.insights.length - category.maxVisible} more
          </div>
        )}
      </div>
    </div>
  );
}

export function InsightsPanel({
  intent,
  context,
  isVisible,
  onInsightUpdate,
}: InsightsPanelProps) {
  // Edit state management
  const [editingInsightId, setEditingInsightId] = React.useState<string | null>(null);
  const [editText, setEditText] = React.useState<string>("");

  if (!isVisible) return null;
  const metadata = context.extracted_metadata;
  if (!metadata) return null;

  // Check if this is a grid layout (multi-column view)
  const isGridLayout = intent === "insights-panel-grid";

  // Get focused insights (new field) - prioritize these over cumulative data
  const focusedInsights = metadata.insights || [];
  
  // Create progressive insights with source tracking
  const createProgressiveInsights = (insights: string[]) => {
    const sources = metadata.insight_sources || [];
    const progressiveInsights: Array<{text: string, source: string, contextNumber: number}> = [];
    
    // Map each insight to its originating context based on our balanced distribution
    // Card 1: insights 0-1, Card 2: insight 2, Card 3: insights 3-4, Card 4: insight 5, Card 5: insight 6
    const insightToContextMap: {[key: number]: {contextNumber: number, source: string}} = {};
    
    let currentIndex = 0;
    sources.forEach((source, sourceIndex) => {
      const contextNumber = sourceIndex + 1;
      let newInsightsForThisContext: number;
      
      // Define how many NEW insights each context adds
      switch(contextNumber) {
        case 1: newInsightsForThisContext = 2; break;
        case 2: newInsightsForThisContext = 1; break;
        case 3: newInsightsForThisContext = 2; break;
        case 4: newInsightsForThisContext = 1; break;
        case 5: newInsightsForThisContext = 1; break;
        default: newInsightsForThisContext = 1; break;
      }
      
      // Map the new insights for this context
      for (let i = 0; i < newInsightsForThisContext && currentIndex + i < insights.length; i++) {
        const insightIndex = currentIndex + i;
        insightToContextMap[insightIndex] = { contextNumber, source };
      }
      currentIndex += newInsightsForThisContext;
    });
    
    // Create the progressive insights array with proper context attribution
    insights.forEach((insight, index) => {
      const contextInfo = insightToContextMap[index];
      if (contextInfo) {
        progressiveInsights.push({
          text: insight,
          source: contextInfo.source,
          contextNumber: contextInfo.contextNumber
        });
      }
    });
    
    return progressiveInsights;
  };
  
  const progressiveInsights = createProgressiveInsights(focusedInsights);

  // Edit handlers
  const startEdit = (insightId: string, currentText: string) => {
    setEditingInsightId(insightId);
    setEditText(currentText);
  };

  const saveEdit = () => {
    if (!editingInsightId || !onInsightUpdate) return;
    
    const updatedInsights = [...focusedInsights];
    const insightIndex = parseInt(editingInsightId.split('-')[1]);
    
    if (insightIndex >= 0 && insightIndex < updatedInsights.length) {
      updatedInsights[insightIndex] = editText.trim();
      onInsightUpdate(context.id, updatedInsights);
    }
    
    setEditingInsightId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditingInsightId(null);
    setEditText("");
  };

  return (
    <motion.div
      data-intent={intent}
      className={`mercury-module p-4 z-40 pointer-events-auto ${
        isGridLayout ? "w-auto min-w-0" : "max-w-sm"
      }`}
      style={
        isGridLayout
          ? {
              width: "100%",
              maxWidth: "none",
              display: "block",
              boxSizing: "border-box",
              flex: "none",
              minWidth: "0",
            }
          : {}
      }
      initial={{
        opacity: 0,
        x: isGridLayout ? 0 : 20,
        y: isGridLayout ? 20 : 0,
        scale: 0.95,
      }}
      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      exit={{
        opacity: 0,
        x: isGridLayout ? 0 : 20,
        y: isGridLayout ? -20 : 0,
        scale: 0.95,
      }}
      transition={{
        duration: MERCURY_DURATIONS.normal,
        ease: MERCURY_EASING,
      }}
    >
      <div className="flex flex-col gap-y-3">
        {/* Clean Header with Summary */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-gray-600" />
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Key Insights</h3>
              <p className="text-xs text-gray-500">Progressive knowledge</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-gray-600 font-medium">{progressiveInsights.length} total</span>
            <span className="text-gray-700 font-medium">
              {progressiveInsights.filter(p => p.contextNumber === Math.max(...progressiveInsights.map(p => p.contextNumber))).length} new
            </span>
          </div>
        </div>

        {/* Elegant Progressive Insights */}
        <div className="bg-white border border-gray-200 rounded-lg max-h-96 overflow-y-auto shadow-sm">
          <div className="divide-y divide-gray-100">
            {Array.from(new Set(progressiveInsights.map(p => p.contextNumber))).reverse().map(contextNum => {
              const contextInsights = progressiveInsights.filter(p => p.contextNumber === contextNum);
              const contextSource = contextInsights[0]?.source || `Context ${contextNum}`;
              const isCurrentContext = contextNum === Math.max(...progressiveInsights.map(p => p.contextNumber));
              
              return (
                <div key={contextNum} className={`transition-all duration-200 ${
                  isCurrentContext 
                    ? 'bg-gray-50 border-l-2 border-gray-800' 
                    : 'hover:bg-gray-25'
                }`}>
                  
                  {/* Elegant Context Header */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center justify-center w-5 h-5 rounded border ${
                        isCurrentContext 
                          ? 'bg-gray-800 text-white border-gray-800' 
                          : 'bg-white text-gray-600 border-gray-300'
                      }`}>
                        <span className="text-xs font-medium">{contextNum}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-medium ${
                          isCurrentContext ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {contextSource.replace(`Card ${contextNum}: `, '')}
                        </span>
                      </div>
                      {isCurrentContext && (
                        <span className="text-xs text-gray-600 font-medium px-2 py-1 bg-gray-200 rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Elegant Insights List */}
                  <div className="px-4 pb-4">
                    <div className="space-y-3">
                      {contextInsights.map((insight, index) => {
                        const insightId = `${contextNum}-${progressiveInsights.findIndex(p => p.text === insight.text)}`;
                        const isEditing = editingInsightId === insightId;
                        
                        return (
                          <div key={index} className="flex items-start gap-3 group">
                            <div className={`flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0 text-xs font-medium border ${
                              isCurrentContext 
                                ? 'bg-gray-700 text-white border-gray-700' 
                                : 'bg-gray-100 text-gray-600 border-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              {isEditing ? (
                                <div className="space-y-2">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full text-xs leading-relaxed p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows={3}
                                    autoFocus
                                  />
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={saveEdit}
                                      className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                                    >
                                      <Check className="w-3 h-3" />
                                      Save
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-start justify-between group/insight-item">
                                  <p className={`text-xs leading-relaxed transition-colors group-hover/insight-item:text-gray-900 ${
                                    isCurrentContext ? 'text-gray-800' : 'text-gray-600'
                                  }`}>
                                    {insight.text}
                                  </p>
                                  {isCurrentContext && onInsightUpdate && (
                                    <button
                                      onClick={() => startEdit(insightId, insight.text)}
                                      className="opacity-0 group-hover/insight-item:opacity-100 ml-2 p-1 text-gray-400 hover:text-gray-600 transition-all duration-200"
                                      title="Edit insight"
                                    >
                                      <Edit2 className="w-3 h-3" />
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
