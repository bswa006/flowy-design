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
  ExternalLink,
  Settings,
  Hand,
  Brain,
  Zap,
  Workflow,
  Image,
  Copy
} from "lucide-react";

import {
  PlaybookCard,
  PlaybookContext,
  PlaybookInsight,
  PlaybookStep,
  PlaybookStage,
  RichContentElement,
  ToolConfiguration,
  PromptTemplate,
  playbookData,
  getInsightTypeColor,
  formatDuration
} from "@/lib/playbookData";

interface PlaybookInsightsPanelProps {
  card: PlaybookCard;
  isVisible: boolean;
  intent?: string;
  className?: string;
  onStageDetailToggle?: (stageId: string) => void;
  expandedStageDetails?: string | null;
}

export function PlaybookInsightsPanel({
  card,
  isVisible,
  intent = "playbook-insights",
  className = "",
  onStageDetailToggle,
  expandedStageDetails
}: PlaybookInsightsPanelProps) {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
  const [expandedStages, setExpandedStages] = useState<Set<string>>(new Set());
  const [filterType] = useState<string>("all");
  const [viewMode] = useState<"summary" | "detailed">("summary");

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
      return playbookData.insights.filter((insight: any) => 
        insight.source_context_id === context.id ||
        insight.upload_id === context.upload.id
      );
    } else if (card.type === "insight") {
      const insight = card.data as PlaybookInsight;
      return playbookData.insights.filter((i: any) => 
        i.source_context_id === insight.source_context_id ||
        i.id === insight.id
      );
    } else if (card.type === "project") {
      return playbookData.insights.filter((insight: any) => 
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

  const toggleStageExpansion = (stageId: string) => {
    setExpandedStages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stageId)) {
        newSet.delete(stageId);
      } else {
        newSet.add(stageId);
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

  const formatText = (text: string) => {
    return text
      .replace(/_/g, ' ')
      .replace(/\b\w/g, letter => letter.toUpperCase());
  };

  // Rich content rendering functions
  const renderRichContentElement = (element: RichContentElement, index: number) => {
    switch (element.type) {
      case "code":
        return (
          <div key={index} className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono relative group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs">{element.language || "bash"}</span>
              <button 
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white"
                title="Copy code"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
            <pre className="whitespace-pre-wrap">{element.content}</pre>
          </div>
        );
      
      case "link":
        return (
          <a
            key={index}
            href={element.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
          >
            <ExternalLink className="w-3 h-3" />
            <span>{element.content}</span>
          </a>
        );
      
      case "image":
        return (
          <div key={index} className="border border-gray-200 rounded-lg p-2 bg-gray-50">
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
              <Image className="w-4 h-4" />
              <span>{element.title || "Flow Diagram"}</span>
            </div>
            <div className="text-xs text-gray-500">
              📸 {element.alt || "Setup diagram"}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderToolConfiguration = (tool: ToolConfiguration) => {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">{tool.name}</span>
          </div>
          {tool.clickable && tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              title={`Open ${tool.name}`}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
        {tool.configuration && (
          <div className="text-xs text-blue-700 space-y-1">
            {Object.entries(tool.configuration).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium">{key}:</span>
                <span>{String(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderPromptTemplate = (prompt: PromptTemplate) => {
    return (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-2">
        <div className="flex items-center space-x-2 mb-2">
          <Brain className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">AI Prompt</span>
        </div>
        <p className="text-sm text-purple-800 mb-2">{prompt.content}</p>
        {prompt.variables && prompt.variables.length > 0 && (
          <div className="text-xs text-purple-600">
            <span className="font-medium">Variables: </span>
            {prompt.variables.join(", ")}
          </div>
        )}
      </div>
    );
  };

  const renderContextAndOutcome = (stage: PlaybookStage) => {
    if (!stage.context && !stage.outcome_expected) return null;
    
    return (
      <div className="mt-3 space-y-3">
        {stage.context && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center space-x-1 mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs font-medium text-blue-800">Context Required</span>
            </div>
            <div className="text-xs text-blue-700 space-y-1">
              {stage.context.required.map((context, i) => (
                <div key={i}>• {formatText(context)}</div>
              ))}
              {stage.context.assumptions && (
                <div className="mt-2 pt-2 border-t border-blue-200">
                  <span className="text-xs font-medium text-blue-800 block mb-1">Assumptions:</span>
                  {stage.context.assumptions.map((assumption, i) => (
                    <div key={i} className="text-xs text-blue-600">✓ {formatText(assumption)}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {stage.outcome_expected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-1 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-800">Expected Outcome</span>
              {stage.ai_completion_badge && (
                <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full flex items-center space-x-1">
                  <span>{stage.ai_completion_badge.icon}</span>
                  <span>{stage.ai_completion_badge.text}</span>
                </span>
              )}
            </div>
            <div className="text-xs text-green-700 space-y-1">
              {stage.outcome_expected.generated.map((outcome, i) => (
                <div key={i}>• {formatText(outcome)}</div>
              ))}
              {stage.outcome_expected.artifacts && (
                <div className="mt-2 pt-2 border-t border-green-200">
                  <span className="text-xs font-medium text-green-800 block mb-1">Artifacts:</span>
                  {stage.outcome_expected.artifacts.map((artifact, i) => (
                    <div key={i} className="text-xs text-green-600">📄 {artifact}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
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
    <div
      data-intent={intent}
      className={`h-full flex flex-col ${className}`}
    >
      {/* Key Insights style header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {panelTitle}
              </h3>
              <p className="text-sm text-gray-500">
                Progressive knowledge
              </p>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">{contentCount} total</span>
            <span className="ml-2">{completedStagesCount} new</span>
          </div>
        </div>
      </div>

      {/* Content Section - Key Insights style */}
      <div className="flex-1 bg-gray-50 px-4 pb-4 overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9' }}>
        {isStepCard ? (
          <div className="space-y-2">
            {executionStages.length > 0 && (
              <div className="space-y-2">
                {executionStages.map((stage, index) => {
                    const getStageCardStyles = () => {
                      if (stage.status === 'completed') {
                        return {
                          container: "border border-gray-200 rounded-lg bg-gray-50",
                          numberBg: "bg-gray-900 text-white",
                          statusBadge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
                          statusText: "✅ Completed"
                        };
                      } else if (stage.status === 'in_progress') {
                        return {
                          container: "border border-blue-200 rounded-lg bg-blue-50",
                          numberBg: "bg-gray-900 text-white", 
                          statusBadge: "bg-blue-50 text-blue-700 border border-blue-200",
                          statusText: `🔄 ${stage.completion_percentage}%`
                        };
                      } else {
                        return {
                          container: "border border-gray-200 rounded-lg bg-white",
                          numberBg: "bg-gray-900 text-white",
                          statusBadge: "bg-gray-50 text-gray-600 border border-gray-200", 
                          statusText: "⏳ Pending"
                        };
                      }
                    };

                    const styles = getStageCardStyles();
                    
                    return (
                      <div key={`stage-${stage.stage}`} className={`${styles.container} transition-all duration-200 hover:shadow-sm`}>
                        <div 
                          className={`p-4 cursor-pointer transition-all duration-200 ${
                            expandedStageDetails === stage.stage.toString() 
                              ? "bg-blue-50/50 border-blue-200 ring-1 ring-blue-200/50" 
                              : "hover:bg-gray-50"
                          }`}
                          onClick={() => onStageDetailToggle?.(stage.stage.toString())}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${styles.numberBg}`}>
                              {stage.stage}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">{stage.name}</h4>
                                <div className="flex items-center space-x-2 flex-shrink-0">
                                  <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${styles.statusBadge}`}>
                                    {styles.statusText}
                                  </span>
                                  <ChevronRight className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>
                              <div className="flex items-center space-x-3 text-xs text-gray-600">
                                <div className="flex items-center space-x-1">
                                  {getExecutionTypeIcon(stage.type)}
                                  <span className="capitalize">{formatExecutionType(stage.type)}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{formatDuration(stage.estimated_minutes)}</span>
                                </div>
                                {stage.tool && (
                                  <div className="flex items-center space-x-1">
                                    <Settings className="w-3 h-3" />
                                    <span className="truncate">{typeof stage.tool === 'string' ? stage.tool : stage.tool.name}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Progress Bar for in-progress stages */}
                              {stage.status === 'in_progress' && stage.completion_percentage > 0 && (
                                <div className="w-full bg-gray-100 rounded-full h-1 mt-3">
                                  <div 
                                    className="bg-blue-500 h-1 rounded-full transition-all duration-500 ease-out" 
                                    style={{ width: `${stage.completion_percentage}%` }}
                                  ></div>
                                </div>
                              )}
                              
                              {/* AI Completion Badge */}
                              {stage.ai_completion_badge && (
                                <div className="mt-2">
                                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                                    stage.type === 'llm_direct' 
                                      ? 'bg-gray-100 text-gray-700'
                                      : stage.type === 'ai_review'
                                      ? 'bg-blue-100 text-blue-700'
                                      : 'bg-amber-100 text-amber-700'
                                  }`}>
                                    <span className="w-3 h-3 flex items-center justify-center bg-current text-white rounded-sm text-xs">AI</span>
                                    <span>
                                      {stage.type === 'llm_direct' 
                                        ? 'Fully automated'
                                        : stage.type === 'ai_review'
                                        ? 'AI assisted'
                                        : 'AI enhanced'
                                      }
                                    </span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
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

    </div>
  );
}

