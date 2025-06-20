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
}

export function PlaybookInsightsPanel({
  card,
  isVisible,
  intent = "playbook-insights",
  className = ""
}: PlaybookInsightsPanelProps) {
  const [expandedInsights, setExpandedInsights] = useState<Set<string>>(new Set());
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

  const renderInputsOutputs = (stage: PlaybookStage) => {
    if (!stage.inputs && !stage.outputs) return null;
    
    return (
      <div className="mt-3 grid grid-cols-2 gap-3">
        {stage.inputs && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs font-medium text-green-800">Inputs</span>
            </div>
            <div className="text-xs text-green-700 space-y-1">
              {stage.inputs.required.map((input, i) => (
                <div key={i}>• {input}</div>
              ))}
            </div>
          </div>
        )}
        
        {stage.outputs && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
            <div className="flex items-center space-x-1 mb-1">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-xs font-medium text-orange-800">Outputs</span>
            </div>
            <div className="text-xs text-orange-700 space-y-1">
              {stage.outputs.generated.map((output, i) => (
                <div key={i}>• {output}</div>
              ))}
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
      className={`overflow-hidden flex flex-col ${className}`}
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
      <div className="bg-gray-50 px-4 pb-4">
        {isStepCard ? (
          /* Key Insights style layout */
          <div className="space-y-4">
            {/* Group stages by status or logically */}
            {executionStages.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center text-sm font-semibold">
                      {executionStages.filter(s => s.status === 'completed').length}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">Completed Stages</span>
                  </div>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    Active
                  </span>
                </div>
                
                <div className="space-y-4">
                  {executionStages.filter(stage => stage.status === 'completed').map((stage, index) => (
                    <div key={`completed-${index}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {stage.stage}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-semibold text-gray-900">{stage.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                ✅ Completed
                              </span>
                              <span className="text-xs text-gray-500">
                                {stage.completion_percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mb-2 text-sm text-gray-600">
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
                                <span>{typeof stage.tool === 'string' ? stage.tool : stage.tool.name}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {stage.instructions}
                          </p>
                          
                          {/* Tool Configuration */}
                          {stage.tool && renderToolConfiguration(stage.tool)}
                          
                          {/* AI Prompt */}
                          {stage.prompt && renderPromptTemplate(stage.prompt)}
                          
                          {/* Rich Content */}
                          {stage.rich_content && stage.rich_content.elements.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {stage.rich_content.elements.map((element, i) => 
                                renderRichContentElement(element, i)
                              )}
                            </div>
                          )}
                          
                          {/* Inputs/Outputs */}
                          {renderInputsOutputs(stage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* In Progress Stages */}
            {executionStages.filter(s => s.status === 'in_progress').length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                    {executionStages.filter(s => s.status === 'in_progress').length}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">In Progress</span>
                </div>
                
                <div className="space-y-4">
                  {executionStages.filter(stage => stage.status === 'in_progress').map((stage, index) => (
                    <div key={`progress-${index}`} className="border border-blue-200 rounded-lg p-4 bg-blue-50">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {stage.stage}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-semibold text-gray-900">{stage.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                🔄 In Progress
                              </span>
                              <span className="text-xs text-gray-500">
                                {stage.completion_percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mb-2 text-sm text-gray-600">
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
                                <span>{typeof stage.tool === 'string' ? stage.tool : stage.tool.name}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {stage.instructions}
                          </p>
                          
                          {/* Tool Configuration */}
                          {stage.tool && renderToolConfiguration(stage.tool)}
                          
                          {/* AI Prompt */}
                          {stage.prompt && renderPromptTemplate(stage.prompt)}
                          
                          {/* Rich Content */}
                          {stage.rich_content && stage.rich_content.elements.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {stage.rich_content.elements.map((element, i) => 
                                renderRichContentElement(element, i)
                              )}
                            </div>
                          )}
                          
                          {/* Inputs/Outputs */}
                          {renderInputsOutputs(stage)}
                          
                          {stage.completion_percentage > 0 && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{stage.completion_percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${stage.completion_percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Pending Stages */}
            {executionStages.filter(s => s.status === 'not_started').length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-2xl">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                    {executionStages.filter(s => s.status === 'not_started').length}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">Pending</span>
                </div>
                
                <div className="space-y-4">
                  {executionStages.filter(stage => stage.status === 'not_started').map((stage, index) => (
                    <div key={`pending-${index}`} className="border border-gray-200 rounded-lg p-4 bg-white">
                      <div className="flex items-start space-x-3 mb-3">
                        <div className="w-7 h-7 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {stage.stage}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base font-semibold text-gray-900">{stage.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                                ⏳ Pending
                              </span>
                              <span className="text-xs text-gray-500">
                                {stage.completion_percentage}%
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 mb-2 text-sm text-gray-600">
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
                                <span>{typeof stage.tool === 'string' ? stage.tool : stage.tool.name}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {stage.instructions}
                          </p>
                          
                          {/* Tool Configuration */}
                          {stage.tool && renderToolConfiguration(stage.tool)}
                          
                          {/* AI Prompt */}
                          {stage.prompt && renderPromptTemplate(stage.prompt)}
                          
                          {/* Rich Content */}
                          {stage.rich_content && stage.rich_content.elements.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {stage.rich_content.elements.map((element, i) => 
                                renderRichContentElement(element, i)
                              )}
                            </div>
                          )}
                          
                          {/* Inputs/Outputs */}
                          {renderInputsOutputs(stage)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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

