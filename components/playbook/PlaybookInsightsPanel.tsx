"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Lightbulb, 
  AlertTriangle, 
  CheckCircle, 
  Target, 
  Clock, 
  User,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Filter,
  Search,
  ExternalLink,
  Settings,
  Hand,
  Brain,
  Zap,
  Workflow
} from "lucide-react";

import {
  PlaybookCard,
  PlaybookContext,
  PlaybookInsight,
  PlaybookStep,
  playbookData,
  getInsightTypeColor,
  getExecutionTypeColor,
  formatDuration,
  getStatusColor,
  getStatusIcon,
  getStatusLabel
} from "@/lib/playbookData";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";

interface PlaybookInsightsPanelProps {
  card: PlaybookCard;
  isVisible: boolean;
  intent?: string;
  className?: string;
}

export function PlaybookInsightsPanel({
  card,
  isVisible,
  intent = "playbook-insights",
  className = ""
}: PlaybookInsightsPanelProps) {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"summary" | "detailed">("summary");

  // Get execution stages for step cards or insights for other cards
  const getStepExecutionStages = () => {
    if (card.type === "step") {
      const step = card.data as PlaybookStep;
      return step.execution.stages;
    }
    return [];
  };

  const getRelatedInsights = (): PlaybookInsight[] => {
    if (card.type === "step") {
      // For step cards, we'll show execution stages instead of insights
      return [];
    } else if (card.type === "context") {
      const context = card.data as PlaybookContext;
      return playbookData.insights.filter(insight => 
        insight.source_context_id === context.id ||
        insight.upload_id === context.upload.id
      );
    } else if (card.type === "insight") {
      const insight = card.data as PlaybookInsight;
      return playbookData.insights.filter(i => 
        i.source_context_id === insight.source_context_id ||
        i.id === insight.id
      );
    } else if (card.type === "project") {
      return playbookData.insights.filter(insight => 
        insight.project_id === playbookData.project.id
      );
    }
    return [];
  };

  const executionStages = getStepExecutionStages();
  const relatedInsights = getRelatedInsights();
  const hasContent = executionStages.length > 0 || relatedInsights.length > 0;
  
  // Filter insights based on type
  const filteredInsights = filterType === "all" 
    ? relatedInsights 
    : relatedInsights.filter(insight => insight.insight_type === filterType);

  // Group insights by type
  const groupedInsights = filteredInsights.reduce((groups, insight) => {
    const type = insight.insight_type;
    if (!groups[type]) {
      groups[type] = [];
    }
    groups[type].push(insight);
    return groups;
  }, {} as Record<string, PlaybookInsight[]>);

  const toggleInsightExpansion = (insightId: string) => {
    setExpandedInsights(prev => {
      const newSet = new Set(prev);
      if (newSet.has(insightId)) {
        newSet.delete(insightId);
      } else {
        newSet.add(insightId);
      }
      return newSet;
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "risk_blocker": return <AlertTriangle className="w-4 h-4" />;
      case "create_task": return <CheckCircle className="w-4 h-4" />;
      case "mark_decision": return <Target className="w-4 h-4" />;
      case "dependency": return <ExternalLink className="w-4 h-4" />;
      case "commitment": return <User className="w-4 h-4" />;
      case "open_question": return <Lightbulb className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const formatInsightType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getExecutionTypeIcon = (type: string) => {
    switch (type) {
      case "manual": return <Hand className="w-3 h-3" />;
      case "tool_guided": return <Settings className="w-3 h-3" />;
      case "ai_review": return <Brain className="w-3 h-3" />;
      case "llm_direct": return <Zap className="w-3 h-3" />;
      case "hybrid": return <Workflow className="w-3 h-3" />;
      default: return <Settings className="w-3 h-3" />;
    }
  };

  const formatExecutionType = (type: string) => {
    switch (type) {
      case "manual": return "manual";
      case "tool_guided": return "tool guided";
      case "ai_review": return "ai review";
      case "llm_direct": return "llm direct";
      case "hybrid": return "hybrid";
      default: return type;
    }
  };

  if (!isVisible || !hasContent) {
    return null;
  }

  // Determine panel title and content based on card type
  const isStepCard = card.type === "step";
  const panelTitle = isStepCard ? "Execution Stages" : "Insights";
  const contentCount = isStepCard ? executionStages.length : relatedInsights.length;
  
  // Calculate completed stages for step cards
  const completedStagesCount = isStepCard 
    ? executionStages.filter(stage => stage.status === "completed").length 
    : 0;

  return (
    <motion.div
      data-intent={intent}
      className={`bg-white rounded-2xl border border-gray-200 overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 0.98, x: 12 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.98, x: 12 }}
      transition={{ duration: MERCURY_DURATIONS.normal, ease: MERCURY_EASING }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-900 rounded-lg flex items-center justify-center">
              {isStepCard ? (
                <BookOpen className="w-3 h-3 text-white" />
              ) : (
                <Lightbulb className="w-3 h-3 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                {panelTitle}
              </h3>
              <p className="text-xs text-gray-500">
                {isStepCard 
                  ? `${completedStagesCount}/${contentCount} stages completed`
                  : `${contentCount} insights`
                }
              </p>
            </div>
          </div>
          
          {/* View Toggle - only show for insights */}
          {!isStepCard && (
            <div className="flex items-center bg-gray-50 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("summary")}
                className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                  viewMode === "summary" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Summary
              </button>
              <button
                onClick={() => setViewMode("detailed")}
                className={`px-2 py-1 text-xs font-medium rounded transition-all ${
                  viewMode === "detailed" 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Detailed
              </button>
            </div>
          )}
        </div>

        {/* Filter - only show for insights */}
        {!isStepCard && (
          <div className="flex items-center space-x-2">
            <Filter className="w-3 h-3 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs bg-gray-50 border-0 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="all">All ({relatedInsights.length})</option>
              {Object.keys(groupedInsights).map(type => (
                <option key={type} value={type}>
                  {formatInsightType(type)} ({groupedInsights[type].length})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="max-h-96 overflow-y-auto">
        {isStepCard ? (
          // Show execution stages for step cards
          <div className="p-4 space-y-3">
            {executionStages.map((stage, index) => (
              <motion.div
                key={`stage-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="relative bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <div className="p-4">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                        stage.status === "completed" ? "bg-green-100 text-green-600" :
                        stage.status === "in_progress" ? "bg-blue-100 text-blue-600" :
                        "bg-gray-100 text-gray-400"
                      }`}>
                        {stage.status === "completed" ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : stage.status === "in_progress" ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-medium">{stage.stage}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                          {stage.name}
                        </h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`flex items-center space-x-1 text-xs ${getExecutionTypeColor(stage.type).replace('bg-', 'text-').replace('-100', '-600')}`}>
                            {getExecutionTypeIcon(stage.type)}
                            <span>{formatExecutionType(stage.type)}</span>
                          </div>
                          {stage.status === "in_progress" && stage.completion_percentage > 0 && (
                            <span className="text-xs text-blue-600 font-medium">
                              {stage.completion_percentage}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stage.status === "completed" ? "bg-green-50 text-green-700" :
                      stage.status === "in_progress" ? "bg-blue-50 text-blue-700" :
                      "bg-gray-50 text-gray-600"
                    }`}>
                      {stage.status === "completed" ? "Complete" :
                       stage.status === "in_progress" ? "In Progress" :
                       "Pending"}
                    </div>
                  </div>
                  
                  {/* Description - Checklist Format */}
                  <div className="mb-3">
                    {stage.instructions.split(/[,;]|\band\b/).map((item, itemIndex) => {
                      const trimmedItem = item.trim();
                      if (!trimmedItem) return null;
                      
                      return (
                        <div key={itemIndex} className="flex items-start space-x-3 mb-1.5 last:mb-0">
                          <div className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-gray-300"></div>
                          <span className="text-sm text-gray-600 leading-relaxed">
                            {trimmedItem.charAt(0).toUpperCase() + trimmedItem.slice(1)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(stage.estimated_minutes)}</span>
                    </div>
                    {stage.tool && (
                      <div className="flex items-center space-x-1">
                        <Settings className="w-3 h-3" />
                        <span>{stage.tool}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // Show insights for other card types
          <>  
            {viewMode === "summary" ? (
              // Summary View - Compact cards
              <div className="p-4 space-y-3">
                {filteredInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => toggleInsightExpansion(insight.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`flex-shrink-0 p-1 rounded ${getInsightTypeColor(insight.insight_type)}`}>
                          {getInsightIcon(insight.insight_type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs font-medium text-gray-900">
                              {formatInsightType(insight.insight_type)}
                            </span>
                            {insight.confidence_score && (
                              <span className="text-xs text-gray-500">
                                {Math.round(insight.confidence_score * 100)}% confidence
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {insight.extracted_text}
                          </p>
                          {insight.metadata?.priority && (
                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded">
                              {insight.metadata.priority} priority
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600">
                        {expandedInsights.has(insight.id) ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedInsights.has(insight.id) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 pt-3 border-t border-gray-200"
                        >
                          {insight.metadata && (
                            <div className="space-y-2">
                              {Object.entries(insight.metadata).slice(0, 3).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                  <span className="text-gray-500 font-medium">{key}:</span>
                                  <span className="text-gray-700 text-right max-w-48 truncate">
                                    {typeof value === 'string' ? value : JSON.stringify(value)}
                                  </span>
                                </div>
                              ))}
                              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                                <span>Source: {insight.source_context_id.slice(-8)}</span>
                                <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Detailed View - Grouped by type
              <div className="p-4">
                {Object.entries(groupedInsights).map(([type, insights]) => (
                  <div key={type} className="mb-6 last:mb-0">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className={`p-1 rounded ${getInsightTypeColor(type)}`}>
                        {getInsightIcon(type)}
                      </div>
                      <h4 className="text-sm font-semibold text-gray-900">
                        {formatInsightType(type)}
                      </h4>
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                        {insights.length}
                      </span>
                    </div>

                    <div className="space-y-3 pl-6">
                      {insights.map((insight, index) => (
                        <motion.div
                          key={insight.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="p-3 bg-white border border-gray-200 rounded-lg"
                        >
                          <div className="mb-2">
                            <p className="text-sm text-gray-800">{insight.extracted_text}</p>
                          </div>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              {insight.confidence_score && (
                                <span>Confidence: {Math.round(insight.confidence_score * 100)}%</span>
                              )}
                              {insight.is_ai_generated && (
                                <span className="px-1 py-0.5 bg-purple-100 text-purple-600 rounded">
                                  AI Generated
                                </span>
                              )}
                              {insight.is_user_modified && (
                                <span className="px-1 py-0.5 bg-blue-100 text-blue-600 rounded">
                                  Modified
                                </span>
                              )}
                            </div>
                            <span>{new Date(insight.created_at).toLocaleDateString()}</span>
                          </div>

                          {/* Metadata Preview */}
                          {insight.metadata && Object.keys(insight.metadata).length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-100">
                              <div className="grid grid-cols-1 gap-1 text-xs">
                                {Object.entries(insight.metadata).slice(0, 2).map(([key, value]) => (
                                  <div key={key} className="flex justify-between">
                                    <span className="text-gray-500 font-medium">{key}:</span>
                                    <span className="text-gray-700 text-right max-w-32 truncate">
                                      {typeof value === 'string' ? value : JSON.stringify(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {isStepCard 
              ? `${executionStages.length} execution stages` 
              : `${filteredInsights.length} of ${relatedInsights.length} insights shown`
            }
          </span>
          <div className="flex items-center space-x-2">
            <Clock className="w-3 h-3" />
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

