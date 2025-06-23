"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  Video,
  Image as ImageIcon,
  Link as LinkIcon,
  Code,
  Brain,
  User,
  Target,
  TrendingUp,
  Download,
  Play,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  Settings,
  Database,
  Palette
} from "lucide-react";
import { PlaybookCard as PlaybookCardType, PlaybookStep } from "@/lib/playbookData";

// Enhanced interfaces for rich content
interface EnhancedStage {
  stage: number;
  name: string;
  type: string;
  tool: any;
  instructions: string;
  estimated_minutes: number;
  status: string;
  completion_percentage: number;
  context: {
    required: string[];
    assumptions?: string[];
  };
  outcome_expected: {
    generated: string[];
    artifacts: string[];
  };
  ai_completion_badge?: {
    icon: string;
    message: string;
  };
  context_insights_used?: Array<{
    insight_id: string;
    application: string;
    confidence: number;
  }>;
  rich_content?: {
    ai_prompts?: Record<string, string>;
    reference_materials?: Array<{
      type: "document" | "video" | "image" | "link";
      title: string;
      url: string;
      description: string;
      timestamp_highlights?: Array<{
        time: string;
        description: string;
      }>;
    }>;
    execution_checklist?: Array<{
      task: string;
      estimated_time: string;
      ai_assisted: boolean;
      prompt_template?: string;
    }>;
    success_criteria?: string[];
    technical_specs?: Array<{
      title: string;
      content: string;
    }>;
    code_examples?: Array<{
      title: string;
      language: string;
      content: string;
    }>;
  };
  real_time_progress?: {
    artifacts_generated: string[];
    current_step: string;
    blockers: string[];
    next_actions: string[];
  };
}

interface EnhancedStageDetailsPanelProps {
  card: PlaybookCardType;
  stageId: string;
  onClose: () => void;
  contextInsights?: any[]; // Array of context insights
}

// Helper functions to generate fallback content for basic data structures
const generateFallbackPrompt = (stage: EnhancedStage): string => {
  const basePrompt = `You are an AI assistant helping with ${stage.name}. 

**Task**: ${stage.instructions}

**Context**: You have access to ${stage.context.required.join(', ')}.

**Expected Deliverables**: 
${stage.outcome_expected.generated.map(item => `- ${item}`).join('\n')}

**Output Format**: Generate the following artifacts:
${stage.outcome_expected.artifacts.map(artifact => `- ${artifact}`).join('\n')}

Please provide detailed, actionable output that meets these requirements while following best practices for ${stage.type.replace('_', ' ')} execution.`;

  return basePrompt;
};

const generateFallbackChecklist = (stage: EnhancedStage) => {
  const totalTime = stage.estimated_minutes;
  const steps = [
    {
      task: "Review context and requirements",
      estimated_time: `${Math.round(totalTime * 0.15)}m`,
      ai_assisted: false
    },
    {
      task: `Execute ${stage.name.toLowerCase()}`,
      estimated_time: `${Math.round(totalTime * 0.6)}m`,
      ai_assisted: stage.type.includes('llm') || stage.type.includes('ai')
    },
    {
      task: "Validate outputs and deliverables",
      estimated_time: `${Math.round(totalTime * 0.15)}m`,
      ai_assisted: false
    },
    {
      task: "Document results and prepare for next stage",
      estimated_time: `${Math.round(totalTime * 0.1)}m`,
      ai_assisted: false
    }
  ];
  return steps;
};

const generateFallbackArtifacts = (stage: EnhancedStage) => {
  return stage.outcome_expected.artifacts.map(artifact => ({
    type: artifact.endsWith('.md') ? 'document' :
          artifact.endsWith('.json') ? 'document' :
          artifact.endsWith('.png') || artifact.endsWith('.jpg') ? 'image' :
          artifact.endsWith('.mp4') ? 'video' : 'document',
    title: artifact,
    description: `Generated artifact from ${stage.name}`,
    status: stage.status === 'completed' ? 'completed' : 'pending'
  }));
};

export function EnhancedStageDetailsPanel({ 
  card, 
  stageId, 
  onClose,
  contextInsights = []
}: EnhancedStageDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "execution" | "artifacts" | "insights">("overview");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["context", "outcomes"]));
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const step = card.data as PlaybookStep;
  const stage = step.execution.stages.find(s => s.stage.toString() === stageId) as EnhancedStage;
  
  if (!stage) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Stage not found</p>
        </div>
      </div>
    );
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const copyToClipboard = async (text: string, promptId: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedPrompt(promptId);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-50 border-green-200";
      case "in_progress": return "text-blue-600 bg-blue-50 border-blue-200";
      case "not_started": return "text-gray-600 bg-gray-50 border-gray-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "llm_direct": return <Brain className="w-4 h-4" />;
      case "tool_guided": return <Settings className="w-4 h-4" />;
      case "ai_review": return <CheckCircle className="w-4 h-4" />;
      case "manual": return <User className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const renderMediaIcon = (type: string) => {
    switch (type) {
      case "document": return <FileText className="w-4 h-4" />;
      case "video": return <Video className="w-4 h-4" />;
      case "image": return <ImageIcon className="w-4 h-4" />;
      case "link": return <LinkIcon className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {stage.stage}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{stage.name}</h3>
            <div className="flex items-center space-x-3 mt-1">
              <div className="flex items-center space-x-1">
                {getTypeIcon(stage.type)}
                <span className="text-sm text-gray-600 capitalize">{stage.type.replace('_', ' ')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{stage.estimated_minutes}m</span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(stage.status)}`}>
                {stage.status === "completed" ? "✅ Completed" :
                 stage.status === "in_progress" ? `🔄 ${stage.completion_percentage}%` :
                 "⏳ Pending"}
              </div>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-gray-50">
        <nav className="flex space-x-8 px-6">
          {[
            { id: "overview", label: "Overview", icon: Target },
            { id: "execution", label: "Execution", icon: Settings },
            { id: "artifacts", label: "Artifacts", icon: FileText },
            { id: "insights", label: "Insights", icon: Lightbulb }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-3 border-b-2 transition-colors ${
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium text-sm">{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stage Description */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Description</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{stage.instructions}</p>
                </div>

                {/* Context Requirements */}
                <div>
                  <button
                    onClick={() => toggleSection("context")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-md font-semibold text-gray-900">Context Required</h4>
                    {expandedSections.has("context") ? 
                      <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections.has("context") && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-4"
                      >
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-blue-900 mb-2">Required Inputs</h5>
                            <ul className="space-y-1">
                              {stage.context.required.map((item, i) => (
                                <li key={i} className="text-sm text-blue-700 flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {stage.context.assumptions && (
                            <div>
                              <h5 className="text-sm font-medium text-blue-900 mb-2">Assumptions</h5>
                              <ul className="space-y-1">
                                {stage.context.assumptions.map((item, i) => (
                                  <li key={i} className="text-sm text-blue-600 flex items-center space-x-2">
                                    <CheckCircle className="w-3 h-3 text-blue-500" />
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Expected Outcomes */}
                <div>
                  <button
                    onClick={() => toggleSection("outcomes")}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <h4 className="text-md font-semibold text-gray-900">Expected Outcomes</h4>
                    {expandedSections.has("outcomes") ? 
                      <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                  <AnimatePresence>
                    {expandedSections.has("outcomes") && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-3 bg-green-50 border border-green-200 rounded-lg p-4"
                      >
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-green-900 mb-2">Deliverables</h5>
                            <ul className="space-y-1">
                              {stage.outcome_expected.generated.map((item, i) => (
                                <li key={i} className="text-sm text-green-700 flex items-center space-x-2">
                                  <Target className="w-3 h-3 text-green-500" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-green-900 mb-2">Generated Artifacts</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {stage.outcome_expected.artifacts.map((item, i) => (
                                <div key={i} className="flex items-center space-x-2 text-sm text-green-600 bg-green-100 rounded-md px-2 py-1">
                                  <FileText className="w-3 h-3" />
                                  <span className="truncate">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* AI Completion Badge */}
                {stage.ai_completion_badge && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        AI
                      </div>
                      <span className="text-sm font-medium text-purple-900">{stage.ai_completion_badge.message}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "execution" && (
              <div className="space-y-6">
                {/* Execution Checklist */}
                {stage.rich_content?.execution_checklist ? (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Execution Checklist</span>
                    </h4>
                    <div className="space-y-3">
                      {stage.rich_content.execution_checklist.map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start space-x-3">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                              disabled
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{item.task}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">{item.estimated_time}</span>
                                  {item.ai_assisted && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">AI Assisted</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* AI Tool Information */}
                              {item.ai_assisted && item.prompt_template && (
                                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Brain className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs font-semibold text-purple-900">AI Tool Required</span>
                                  </div>
                                  
                                  {/* AI Tool Name */}
                                  <div className="mb-2">
                                    <span className="text-xs text-purple-700 font-medium">Tool: </span>
                                    <span className="text-xs text-purple-600">
                                      {item.prompt_template === 'competitor_research' ? 'GPT-4 + Research Browser' :
                                       item.prompt_template === 'insight_extraction' ? 'GPT-4 Text Analysis' :
                                       item.prompt_template === 'persona_generation' ? 'GPT-4 Persona Generator' :
                                       item.prompt_template === 'story_template_creation' ? 'GPT-4 Creative Writing' :
                                       item.prompt_template === 'educational_validation' ? 'GPT-4 Content Review' :
                                       'GPT-4 General'}
                                    </span>
                                  </div>
                                  
                                  {/* AI Prompt */}
                                  {item.prompt_template && stage.rich_content?.ai_prompts?.[item.prompt_template] && (
                                    <div className="mb-2">
                                      <span className="text-xs text-purple-700 font-medium">Prompt: </span>
                                      <p className="text-xs text-purple-600 mt-1 italic">
                                        "{stage.rich_content.ai_prompts[item.prompt_template].substring(0, 120)}..."
                                      </p>
                                    </div>
                                  )}
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-2 mt-2">
                                    <button
                                      onClick={() => copyToClipboard(
                                        (item.prompt_template && stage.rich_content?.ai_prompts?.[item.prompt_template]) || 'Prompt not available', 
                                        `checklist-${i}`
                                      )}
                                      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded flex items-center space-x-1 transition-colors"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>{copiedPrompt === `checklist-${i}` ? "Copied!" : "Copy Prompt"}</span>
                                    </button>
                                    <a
                                      href="https://chat.openai.com/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center space-x-1 transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Open ChatGPT</span>
                                    </a>
                                  </div>
                                </div>
                              )}
                              
                              {/* Manual Task Information */}
                              {!item.ai_assisted && (
                                <div className="mt-2 text-xs text-gray-600">
                                  Manual task - Human review and validation required
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Fallback Execution Checklist */
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span>Suggested Execution Steps</span>
                    </h4>
                    <div className="space-y-3">
                      {generateFallbackChecklist(stage).map((item, i) => (
                        <div key={i} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                          <div className="flex items-start space-x-3">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                              disabled
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">{item.task}</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs text-gray-500">{item.estimated_time}</span>
                                  {item.ai_assisted && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">AI Assisted</span>
                                  )}
                                </div>
                              </div>
                              
                              {/* AI Tool Information for Fallback */}
                              {item.ai_assisted && (
                                <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Brain className="w-4 h-4 text-purple-600" />
                                    <span className="text-xs font-semibold text-purple-900">AI Tool Required</span>
                                  </div>
                                  
                                  {/* AI Tool Name */}
                                  <div className="mb-2">
                                    <span className="text-xs text-purple-700 font-medium">Tool: </span>
                                    <span className="text-xs text-purple-600">
                                      {stage.type.includes('llm') ? 'GPT-4 Creative Writing' :
                                       stage.type.includes('ai') ? 'GPT-4 Analysis' :
                                       stage.name.toLowerCase().includes('research') ? 'GPT-4 + Research Browser' :
                                       stage.name.toLowerCase().includes('analysis') ? 'GPT-4 Text Analysis' :
                                       'GPT-4 General Assistant'}
                                    </span>
                                  </div>
                                  
                                  {/* Generated AI Prompt */}
                                  <div className="mb-2">
                                    <span className="text-xs text-purple-700 font-medium">Prompt: </span>
                                    <p className="text-xs text-purple-600 mt-1 italic">
                                      "Help me with {item.task.toLowerCase()} for {stage.name.toLowerCase()}. Consider the context: {stage.context.required.join(', ')}. Generate detailed outputs that meet the success criteria."
                                    </p>
                                  </div>
                                  
                                  {/* Action Buttons */}
                                  <div className="flex items-center space-x-2 mt-2">
                                    <button
                                      onClick={() => copyToClipboard(
                                        `Help me with ${item.task.toLowerCase()} for ${stage.name.toLowerCase()}. Consider the context: ${stage.context.required.join(', ')}. Generate detailed outputs that meet the success criteria and expected artifacts: ${stage.outcome_expected.artifacts.join(', ')}.`, 
                                        `fallback-${i}`
                                      )}
                                      className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-2 py-1 rounded flex items-center space-x-1 transition-colors"
                                    >
                                      <Copy className="w-3 h-3" />
                                      <span>{copiedPrompt === `fallback-${i}` ? "Copied!" : "Copy Prompt"}</span>
                                    </button>
                                    <a
                                      href="https://chat.openai.com/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-2 py-1 rounded flex items-center space-x-1 transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Open ChatGPT</span>
                                    </a>
                                    <a
                                      href="https://claude.ai/"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs bg-orange-100 hover:bg-orange-200 text-orange-700 px-2 py-1 rounded flex items-center space-x-1 transition-colors"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                      <span>Open Claude</span>
                                    </a>
                                  </div>
                                </div>
                              )}
                              
                              {/* Manual Task Information */}
                              {!item.ai_assisted && (
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span className="text-xs font-semibold text-blue-900">Manual Task</span>
                                  </div>
                                  <p className="text-xs text-blue-700">
                                    Human review and validation required. Use your expertise and judgment to complete this task.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Success Criteria */}
                {stage.rich_content?.success_criteria ? (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span>Success Criteria</span>
                    </h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {stage.rich_content.success_criteria.map((criteria, i) => (
                          <li key={i} className="text-sm text-green-700 flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{criteria}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  /* Fallback Success Criteria */
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <span>Success Criteria</span>
                    </h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <ul className="space-y-2">
                        {stage.outcome_expected.generated.map((deliverable, i) => (
                          <li key={i} className="text-sm text-green-700 flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Successfully complete: {deliverable}</span>
                          </li>
                        ))}
                        <li className="text-sm text-green-700 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Generate all required artifacts ({stage.outcome_expected.artifacts.length} items)</span>
                        </li>
                        <li className="text-sm text-green-700 flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Complete stage within estimated {stage.estimated_minutes} minutes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "artifacts" && (
              <div className="space-y-6">
                {/* Reference Materials */}
                {stage.rich_content?.reference_materials ? (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Reference Materials</span>
                    </h4>
                    <div className="grid gap-3">
                      {stage.rich_content.reference_materials.map((material, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                material.type === "video" ? "bg-red-100 text-red-600" :
                                material.type === "document" ? "bg-blue-100 text-blue-600" :
                                material.type === "image" ? "bg-green-100 text-green-600" :
                                "bg-purple-100 text-purple-600"
                              }`}>
                                {renderMediaIcon(material.type)}
                              </div>
                              <div>
                                <h5 className="text-sm font-semibold text-gray-900">{material.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                                {material.timestamp_highlights && (
                                  <div className="mt-2 space-y-1">
                                    <span className="text-xs font-medium text-gray-700">Key Moments:</span>
                                    {material.timestamp_highlights.map((highlight, j) => (
                                      <div key={j} className="text-xs text-gray-600 flex items-center space-x-2">
                                        <Play className="w-3 h-3" />
                                        <span className="font-mono">{highlight.time}</span>
                                        <span>-</span>
                                        <span>{highlight.description}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Fallback Artifacts Display */
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span>Expected Artifacts</span>
                    </h4>
                    <div className="grid gap-3">
                      {generateFallbackArtifacts(stage).map((artifact, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className={`p-2 rounded-lg ${
                                artifact.type === "document" ? "bg-blue-100 text-blue-600" :
                                artifact.type === "image" ? "bg-green-100 text-green-600" :
                                artifact.type === "video" ? "bg-red-100 text-red-600" :
                                "bg-gray-100 text-gray-600"
                              }`}>
                                {renderMediaIcon(artifact.type)}
                              </div>
                              <div>
                                <h5 className="text-sm font-semibold text-gray-900">{artifact.title}</h5>
                                <p className="text-sm text-gray-600 mt-1">{artifact.description}</p>
                                <div className={`inline-flex items-center mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                                  artifact.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {artifact.status === 'completed' ? '✅ Generated' : '⏳ Pending'}
                                </div>
                              </div>
                            </div>
                            <button className="text-gray-400 hover:text-gray-600">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code Examples */}
                {stage.rich_content?.code_examples && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Code className="w-5 h-5 text-gray-600" />
                      <span>Code Examples</span>
                    </h4>
                    <div className="space-y-4">
                      {stage.rich_content.code_examples.map((example, i) => (
                        <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-800 px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Code className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium text-white">{example.title}</span>
                              <span className="text-xs text-gray-400">({example.language})</span>
                            </div>
                            <button
                              onClick={() => copyToClipboard(example.content, `code-${i}`)}
                              className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <pre className="bg-gray-900 text-green-400 p-4 text-sm overflow-x-auto">
                            <code>{example.content}</code>
                          </pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Real-time Progress */}
                {stage.real_time_progress && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <span>Real-time Progress</span>
                    </h4>
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-semibold text-orange-900 mb-2">Current Step</h5>
                          <p className="text-sm text-orange-700 capitalize">{stage.real_time_progress.current_step}</p>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-orange-900 mb-2">Artifacts Generated</h5>
                          <p className="text-sm text-orange-700">{stage.real_time_progress.artifacts_generated.length} of {stage.outcome_expected.artifacts.length}</p>
                        </div>
                      </div>
                      {stage.real_time_progress.next_actions.length > 0 && (
                        <div className="mt-4">
                          <h5 className="text-sm font-semibold text-orange-900 mb-2">Next Actions</h5>
                          <ul className="space-y-1">
                            {stage.real_time_progress.next_actions.map((action, i) => (
                              <li key={i} className="text-sm text-orange-700 flex items-center space-x-2">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                <span>{action}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "insights" && (
              <div className="space-y-6">
                {/* Context Insights Used */}
                {stage.context_insights_used && stage.context_insights_used.length > 0 ? (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span>Context Insights Applied</span>
                    </h4>
                    <div className="space-y-3">
                      {stage.context_insights_used.map((insight, i) => (
                        <div key={i} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="text-sm font-semibold text-yellow-900">Insight #{insight.insight_id.split('_')[1]}</h5>
                              <p className="text-sm text-yellow-700 mt-1">{insight.application}</p>
                            </div>
                            <div className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                              {Math.round(insight.confidence * 100)}% confidence
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Fallback Insights Display */
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      <span>Stage Insights</span>
                    </h4>
                    <div className="space-y-3">
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Lightbulb className="w-5 h-5 text-yellow-600 mt-1" />
                          <div>
                            <h5 className="text-sm font-semibold text-yellow-900">Stage Focus</h5>
                            <p className="text-sm text-yellow-700 mt-1">
                              This stage focuses on {stage.name.toLowerCase()} with an estimated duration of {stage.estimated_minutes} minutes.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Target className="w-5 h-5 text-blue-600 mt-1" />
                          <div>
                            <h5 className="text-sm font-semibold text-blue-900">Key Deliverables</h5>
                            <p className="text-sm text-blue-700 mt-1">
                              Expected to generate {stage.outcome_expected.generated.length} deliverables and {stage.outcome_expected.artifacts.length} artifacts.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                          <div>
                            <h5 className="text-sm font-semibold text-green-900">Progress Status</h5>
                            <p className="text-sm text-green-700 mt-1">
                              Currently {stage.status} with {stage.completion_percentage}% completion rate.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Technical Specifications */}
                {stage.rich_content?.technical_specs && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                      <Database className="w-5 h-5 text-indigo-600" />
                      <span>Technical Specifications</span>
                    </h4>
                    <div className="space-y-3">
                      {stage.rich_content.technical_specs.map((spec, i) => (
                        <div key={i} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                          <h5 className="text-sm font-semibold text-indigo-900 mb-2">{spec.title}</h5>
                          <p className="text-sm text-indigo-700">{spec.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}