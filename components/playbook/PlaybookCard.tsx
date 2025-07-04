"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Users, 
  FileText, 
  Lightbulb, 
  CheckCircle, 
  AlertTriangle, 
  Target, 
  BookOpen,
  Layers,
  Play,
  Edit3,
  MoreVertical,
  ChevronRight,
  ChevronDown,
  Settings,
  Brain,
  Hand,
  Zap,
  ArrowRight,
  Workflow,
  Badge,
  Timer
} from "lucide-react";

import {
  PlaybookCard as PlaybookCardType,
  PlaybookContext,
  PlaybookInsight,
  PlaybookStep,
  PlaybookProject,
  getInsightTypeColor,
  getExecutionTypeColor,
  formatDuration,
  getStatusColor,
  getStatusLabel,
  getStatusIcon
} from "@/lib/playbookData";
import { MERCURY_DURATIONS, MERCURY_EASING } from "@/lib/mercury-utils";

interface PlaybookCardProps {
  card: PlaybookCardType;
  onToggleInsights?: (cardId: string) => void;
  onEdit?: (cardId: string) => void;
  isExpanded?: boolean;
  focusLevel?: "focused" | "ambient" | "fog";
  className?: string;
}

export function PlaybookCard({
  card,
  onToggleInsights,
  onEdit,
  isExpanded = false,
  focusLevel = "ambient",
  className = ""
}: PlaybookCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const handleCardClick = () => {
    console.log('PlaybookCard clicked:', card.id, card.type);
    onToggleInsights?.(card.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(card.id);
  };

  const handleDetailsToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetails(!showDetails);
  };

  const getFocusStyles = () => {
    switch (focusLevel) {
      case "focused":
        return "scale-[1.02] shadow-xl ring-2 ring-blue-500/30 opacity-100";
      case "ambient":
        return "scale-100 shadow-lg opacity-90 hover:shadow-xl hover:scale-[1.01]";
      case "fog":
        return "scale-[0.98] shadow-sm opacity-40 blur-[0.5px]";
      default:
        return "scale-100 shadow-lg opacity-90";
    }
  };

  if (card.type === "step") {
    return renderStepCard(card as PlaybookCardType & { data: PlaybookStep }, handleCardClick, handleEditClick, showDetails, handleDetailsToggle, focusLevel, className, isExpanded);
  }

  return (
    <motion.div
      className={`bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer ${getFocusStyles()} ${className}`}
      layout
      onClick={handleCardClick}
      whileHover={focusLevel !== "fog" ? { y: -1 } : {}}
      transition={{ duration: MERCURY_DURATIONS.normal, ease: MERCURY_EASING }}
      style={{ width: '320px' }}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Card Type Icon */}
            <div className="flex-shrink-0 mt-1">
              {card.type === "project" && (
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-blue-600" />
                </div>
              )}
              {card.type === "context" && (
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-green-600" />
                </div>
              )}
              {card.type === "insight" && (
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-purple-600" />
                </div>
              )}
            </div>

            {/* Card Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {card.type}
                </span>
                {card.type === "context" && (card.data as PlaybookContext).is_checkpoint && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                )}
                {card.type === "insight" && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getInsightTypeColor((card.data as PlaybookInsight).insight_type)}`}>
                    {(card.data as PlaybookInsight).insight_type.replace('_', ' ')}
                  </span>
                )}
              </div>
              
              <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                {getCardTitle(card)}
              </h3>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {getCardDescription(card)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-1 ml-2">
            <button
              onClick={handleDetailsToggle}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Toggle details"
            >
              {showDetails ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleEditClick}
              className="p-1 text-gray-400 hover:text-gray-600 rounded"
              title="Edit card"
            >
              <Edit3 className="w-3 h-3" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <MoreVertical className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        {/* Quick Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(getCardDate(card))}</span>
            </div>
            {card.type === "context" && (card.data as PlaybookContext).upload.participants && (
              <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{(card.data as PlaybookContext).upload.participants!.length}</span>
              </div>
            )}
          </div>
          
          {card.type === "context" && (
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${
                (card.data as PlaybookContext).priority_score >= 90 ? 'bg-red-400' :
                (card.data as PlaybookContext).priority_score >= 70 ? 'bg-yellow-400' : 'bg-green-400'
              }`} />
              <span>P{(card.data as PlaybookContext).priority_score}</span>
            </div>
          )}
        </div>

        {/* Card-specific content */}
        {renderCardSpecificContent(card)}

        {/* Tags */}
        {getCardTags(card).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {getCardTags(card).slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
              >
                {tag}
              </span>
            ))}
            {getCardTags(card).length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                +{getCardTags(card).length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: MERCURY_EASING }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-4">
              {renderExpandedContent(card)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Indicators */}
      {card.connections.length > 0 && (
        <div className="absolute -right-1 top-1/2 transform -translate-y-1/2">
          <div className="w-2 h-2 bg-blue-500 rounded-full shadow-sm" />
        </div>
      )}
    </motion.div>
  );
}

// Helper functions
function getCardTitle(card: PlaybookCardType): string {
  switch (card.type) {
    case "project":
      return (card.data as PlaybookProject).name;
    case "context":
      return (card.data as PlaybookContext).upload.original_name;
    case "insight":
      return (card.data as PlaybookInsight).extracted_text.substring(0, 100) + "...";
    case "step":
      return (card.data as PlaybookStep).title;
    default:
      return "Unknown Card";
  }
}

function getCardDescription(card: PlaybookCardType): string {
  switch (card.type) {
    case "project":
      return (card.data as PlaybookProject).description;
    case "context":
      return (card.data as PlaybookContext).summary;
    case "insight":
      return `${(card.data as PlaybookInsight).insight_type.replace('_', ' ')} from ${(card.data as PlaybookInsight).source_context_id}`;
    case "step":
      return (card.data as PlaybookStep).description;
    default:
      return "";
  }
}

function getCardDate(card: PlaybookCardType): string {
  switch (card.type) {
    case "project":
      return (card.data as PlaybookProject).created_at;
    case "context":
      return (card.data as PlaybookContext).created_at;
    case "insight":
      return (card.data as PlaybookInsight).created_at;
    case "step":
      return new Date().toISOString(); // Steps don't have dates in the data
    default:
      return new Date().toISOString();
  }
}

function getCardTags(card: PlaybookCardType): string[] {
  switch (card.type) {
    case "project":
      return (card.data as PlaybookProject).metadata.integrations?.slice(0, 3) || [];
    case "context":
      return (card.data as PlaybookContext).tags || [];
    case "insight":
      return [(card.data as PlaybookInsight).insight_type];
    case "step":
      return [(card.data as PlaybookStep).execution.type];
    default:
      return [];
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

function renderCardSpecificContent(card: PlaybookCardType) {
  switch (card.type) {
    case "project":
      const project = card.data as PlaybookProject;
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Expected Impact</span>
            <span className="font-medium text-gray-700">{project.metadata.expected_impact}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Target Users</span>
            <span className="font-medium text-gray-700">{project.metadata.target_users}</span>
          </div>
        </div>
      );

    case "context":
      const context = card.data as PlaybookContext;
      return (
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <span className={`px-2 py-1 rounded-full ${
              context.upload.upload_type === 'video' ? 'bg-red-100 text-red-700' :
              context.upload.upload_type === 'document' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {context.upload.upload_type}
            </span>
            <span className={`px-2 py-1 rounded-full ${
              context.upload.status === 'completed' ? 'bg-green-100 text-green-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {context.upload.status}
            </span>
          </div>
        </div>
      );

    case "insight":
      const insight = card.data as PlaybookInsight;
      return (
        <div className="space-y-2">
          {insight.confidence_score && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-500">Confidence</span>
              <span className="font-medium text-gray-700">{Math.round(insight.confidence_score * 100)}%</span>
            </div>
          )}
          <div className="flex items-center space-x-2 text-xs">
            {insight.is_ai_generated && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full">AI Generated</span>
            )}
            {insight.is_user_modified && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">User Modified</span>
            )}
          </div>
        </div>
      );

    case "step":
      const step = card.data as PlaybookStep;
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Execution Type</span>
            <span className={`px-2 py-1 rounded-full text-xs ${getExecutionTypeColor(step.execution.type)}`}>
              {step.execution.type}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Stages</span>
            <span className="font-medium text-gray-700">{step.execution.stages.length} stages</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}

// Step card renderer matching exact workflow design
function renderStepCard(
  card: PlaybookCardType & { data: PlaybookStep }, 
  handleCardClick: () => void, 
  handleEditClick: (e: React.MouseEvent) => void,
  showDetails: boolean,
  handleDetailsToggle: (e: React.MouseEvent) => void,
  focusLevel: "focused" | "ambient" | "fog",
  className: string,
  isExpanded: boolean = false
) {
  const step = card.data;
  const stepId = card.id.split('-')[1];
  const stepNumber = parseInt(stepId.replace('step', '')) || 1;
  
  const getExecutionIcon = (type: string) => {
    switch (type) {
      case "manual": return <Hand className="w-4 h-4" />;
      case "tool_guided": return <Settings className="w-4 h-4" />;
      case "ai_review": return <Brain className="w-4 h-4" />;
      case "llm_direct": return <Zap className="w-4 h-4" />;
      case "hybrid": return <Workflow className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };
  
  const getExecutionLabel = (type: string) => {
    switch (type) {
      case "manual": return "manual";
      case "tool_guided": return "tool guided";
      case "ai_review": return "ai review";
      case "llm_direct": return "AI powered";
      case "hybrid": return "hybrid";
      default: return type;
    }
  };
  
  const getFocusStyles = () => {
    switch (focusLevel) {
      case "focused":
        return "shadow-lg ring-1 ring-gray-200 scale-[1.02]";
      case "ambient":
        return "shadow-md hover:shadow-lg transition-all duration-300";
      case "fog":
        return "opacity-50 scale-[0.98]";
      default:
        return "shadow-md";
    }
  };
  
  return (
    <div
      className={`cursor-pointer transition-all duration-300 ${className} focus:outline-none`}
      onClick={handleCardClick}
      role="button"
      aria-label={`Step ${stepNumber}: ${step.title}. Click to view execution stages`}
      tabIndex={-1}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        {/* AI Automation Banner */}
        {(step as any).ai_automation && (
          <div className={`mb-3 -mx-4 -mt-4 px-3 py-2 border-b ${
            (step as any).ai_automation.level === 'fully_automated' 
              ? 'bg-gray-50 border-gray-200'
              : (step as any).ai_automation.level === 'ai_assisted'
              ? 'bg-blue-50/30 border-blue-200/50'
              : 'bg-amber-50/30 border-amber-200/50'
          }`}>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${
                (step as any).ai_automation.level === 'fully_automated'
                  ? 'bg-gray-600 text-white'
                  : (step as any).ai_automation.level === 'ai_assisted'
                  ? 'bg-blue-500 text-white'
                  : 'bg-amber-500 text-white'
              }`}>
                AI
              </div>
              <span className={`text-xs font-medium ${
                (step as any).ai_automation.level === 'fully_automated'
                  ? 'text-gray-700'
                  : (step as any).ai_automation.level === 'ai_assisted'
                  ? 'text-blue-700'
                  : 'text-amber-700'
              }`}>
                {(step as any).ai_automation.message}
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-sm font-medium">
              {stepNumber}
            </div>
            <span className="text-sm font-medium text-gray-900">
              Step {stepNumber}
            </span>
          </div>
          
          {/* Status Badge */}
          <div className={`px-2 py-1 rounded-md text-xs font-medium ${
            step.status === "completed" ? "bg-green-100 text-green-700" :
            step.status === "in_progress" ? "bg-blue-100 text-blue-700" :
            "bg-gray-100 text-gray-600"
          }`}>
            {step.status === "completed" ? "✅ Completed" :
             step.status === "in_progress" ? `🔄 In Progress${step.completion_percentage > 0 ? ` (${step.completion_percentage}%)` : ''}` :
             "Pending"}
          </div>
        </div>
        
        {/* Execution Type */}
        <div className="flex items-center space-x-2 mb-3">
          {getExecutionIcon(step.execution.type)}
          <span className="text-sm text-gray-600 capitalize">
            {getExecutionLabel(step.execution.type)}
          </span>
          {step.execution.type === 'llm_direct' && step.ai_completion_indicator && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full text-xs font-medium border border-purple-200">
              <span className="text-[10px]">🤖</span>
              <span>AI KUDOS</span>
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {step.title}
        </h3>
        
        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
          {step.description}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1">
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-xs text-gray-500 mb-1">Duration</div>
            <div className="text-sm font-medium text-gray-900">{formatDuration(step.estimated_minutes)}</div>
          </div>
          
          <div>
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1">
              <Layers className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-xs text-gray-500 mb-1">Stages</div>
            <div className="text-sm font-medium text-gray-900">{step.execution.stages.length}</div>
          </div>
          
          <div>
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-1">
              <Target className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-xs text-gray-500 mb-1">Type</div>
            <div className="text-sm font-medium text-gray-900 capitalize">{getExecutionLabel(step.execution.type)}</div>
          </div>
        </div>
        
        {/* Click hint */}
        <div className="text-center mt-4">
          <span className="text-xs text-gray-500">
            Click to view execution stages
          </span>
        </div>
      </div>
    </div>
  );
}

function renderExpandedContent(card: PlaybookCardType) {
  switch (card.type) {
    case "project":
      const project = card.data as PlaybookProject;
      return (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Tech Stack</h4>
            <div className="flex flex-wrap gap-1">
              {project.metadata.tech_stack?.map((tech, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                  {tech}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Integrations</h4>
            <div className="flex flex-wrap gap-1">
              {project.metadata.integrations?.map((integration, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                  {integration}
                </span>
              ))}
            </div>
          </div>
        </div>
      );

    case "context":
      const context = card.data as PlaybookContext;
      return (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{context.upload.description}</p>
          </div>
          {context.upload.participants && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Participants</h4>
              <div className="flex flex-wrap gap-1">
                {context.upload.participants.map((participant, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {participant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "insight":
      const insight = card.data as PlaybookInsight;
      return (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Full Text</h4>
            <p className="text-sm text-gray-600">{insight.extracted_text}</p>
          </div>
          {insight.metadata && Object.keys(insight.metadata).length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Metadata</h4>
              <div className="text-xs text-gray-600 space-y-1">
                {Object.entries(insight.metadata).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="font-medium">{key}:</span>
                    <span>{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case "step":
      const step = card.data as PlaybookStep;
      return (
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Execution Stages</h4>
            <div className="space-y-2">
              {step.execution.stages.map((stage, index) => (
                <div key={index} className="flex items-start space-x-3 p-2 bg-white rounded border">
                  <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                    {stage.stage}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-medium text-gray-900">{stage.name}</h5>
                      <span className={`px-2 py-0.5 text-xs rounded ${getExecutionTypeColor(stage.type)}`}>
                        {stage.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">{stage.instructions}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{formatDuration(stage.estimated_minutes)}</span>
                      {stage.tool && (
                        <>
                          <span>•</span>
                          <span>Tool: {typeof stage.tool === 'string' ? stage.tool : stage.tool.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

