// Data structures for playbook.json integration

export interface PlaybookProject {
  id: string;
  name: string;
  description: string;
  organization_id: string;
  team_id: string;
  created_at: string;
  status: string;
  metadata: {
    feature_type: string;
    integrations: string[];
    tech_stack: string[];
    target_users: string;
    expected_impact: string;
  };
}

export interface PlaybookUpload {
  id: string;
  file_name: string;
  original_name: string;
  content_type: string;
  upload_type: string;
  description: string;
  status: string;
  priority: string;
  is_checkpoint: boolean;
  recorded_on: string;
  summary: string;
  participants?: string[];
  number_of_participants?: number;
}

export interface PlaybookContext {
  id: string;
  processing_request_id: string;
  upload: PlaybookUpload;
  text_content: string;
  summary: string;
  priority_score: number;
  is_checkpoint: boolean;
  is_invalidated: boolean;
  extracted_metadata: Record<string, any>;
  tags: string[];
  created_at: string;
}

export interface PlaybookInsight {
  id: string;
  upload_id: string;
  project_id: string;
  insight_type: "risk_blocker" | "create_task" | "mark_decision" | "dependency" | "commitment" | "open_question";
  extracted_text: string;
  source_context_id: string;
  metadata: Record<string, any>;
  is_ai_generated: boolean;
  confidence_score?: number;
  semantic_hash?: string;
  is_user_modified?: boolean;
  original_text?: string;
  created_at: string;
}

// Enhanced rich content support
export interface RichContentElement {
  type: "code" | "image" | "video" | "audio" | "markdown" | "link";
  content?: string;
  url?: string;
  language?: string;
  alt?: string;
  title?: string;
  clickable?: boolean;
}

export interface RichContent {
  type: "mixed" | "single";
  elements: RichContentElement[];
}

// Enhanced tool configuration
export interface ToolConfiguration {
  name: string;
  url?: string;
  clickable?: boolean;
  configuration?: {
    mcp_server?: boolean;
    repo_url?: string;
    documentation_type?: string;
    [key: string]: any;
  };
}

// Enhanced prompt structure
export interface PromptTemplate {
  content: string;
  template?: string;
  variables?: string[];
}

// Flow positioning for cards
export interface FlowPosition {
  horizontal_index: number;
  vertical_step: number;
  sub_cards?: Array<{
    type: "ai_output" | "human_review" | "tool_config" | "detailed_view";
    position: "right" | "right_2" | "right_3" | "below" | "below_right";
    content: string;
    expandable?: boolean;
  }>;
}

// Enhanced stage structure
export interface PlaybookStage {
  stage: number;
  name: string;
  type: "manual" | "tool_guided" | "ai_review" | "llm_direct" | "hybrid";
  tool?: ToolConfiguration;
  prompt?: PromptTemplate;
  rich_content?: RichContent;
  instructions: string;
  estimated_minutes: number;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  inputs?: {
    required: string[];
    optional?: string[];
  };
  outputs?: {
    generated: string[];
    artifacts?: string[];
  };
  flow_position?: FlowPosition;
}

// Enhanced execution flow
export interface ExecutionFlow {
  direction: "horizontal_then_vertical" | "vertical_then_horizontal" | "horizontal_only" | "vertical_only";
  sub_flows: Array<{
    type: "ai_agent" | "human_review" | "tool_execution" | "detailed_config";
    opens: "right" | "right_secondary" | "below" | "modal";
    triggers?: string[];
    depends_on?: string;
    expandable?: boolean;
  }>;
}

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  execution_pattern: "hybrid" | "manual" | "tool_guided" | "ai_review" | "llm_direct";
  flow?: ExecutionFlow;
  execution: {
    type: "hybrid" | "manual" | "tool_guided" | "ai_review" | "llm_direct";
    stages: PlaybookStage[];
  };
}

// Workflow layout configuration
export interface WorkflowLayout {
  pattern: "horizontal_vertical" | "vertical_horizontal" | "grid";
  step_progression: "vertical_down" | "horizontal_right" | "grid";
  stage_progression: "horizontal_right" | "vertical_down" | "grid";
  card_expansion: {
    ai_completion: "new_card_right" | "expand_in_place" | "modal";
    review_needed: "new_card_right_offset" | "expand_below" | "modal";
    details: "expand_below" | "expand_right" | "modal";
  };
}

// Tools integration configuration
export interface ToolsIntegration {
  context7?: {
    enabled: boolean;
    mcp_server?: string;
    capabilities?: string[];
  };
  rich_content_support: {
    types: string[];
    interactive: boolean;
    clickable_links: boolean;
  };
}

export interface PlaybookData {
  project: PlaybookProject;
  contexts: PlaybookContext[];
  insights: PlaybookInsight[];
  insight_evolution: {
    summary: string;
    phases: Array<{
      phase: string;
      date_range: string;
      insights_added: number;
      key_themes: string[];
    }>;
    insight_relationships: Array<{
      from: string;
      to: string;
      relationship: string;
      description: string;
    }>;
  };
  workflow_layout?: WorkflowLayout;
  tools_integration?: ToolsIntegration;
  playbook: {
    id: string;
    project_id: string;
    name: string;
    description: string;
    created_at: string;
    generated_from_contexts: string[];
    steps: PlaybookStep[];
  };
}

// Card type for canvas workflow
export interface PlaybookCard {
  id: string;
  type: "context" | "insight" | "step" | "project";
  data: PlaybookContext | PlaybookInsight | PlaybookStep | PlaybookProject;
  position: { x: number; y: number };
  connections: string[];
  focusLevel: "focused" | "ambient" | "fog";
}

// Load data from playbook.json
import playbookJsonData from '@/docs/playbook.json';

// Add mock status data to steps and stages for demonstration
// Enhanced stage data with rich content and flow positioning
const addStageStatus = (stages: any[], stepIndex: number) => {
  return stages.map((stage, stageIndex) => {
    let status: "not_started" | "in_progress" | "completed";
    let completion_percentage: number;
    
    if (stepIndex === 0) {
      // Step 1: All stages completed
      status = "completed";
      completion_percentage = 100;
    } else if (stepIndex === 1) {
      // Step 2: Progressive completion (65% overall)
      if (stageIndex === 0) {
        status = "completed";
        completion_percentage = 100;
      } else if (stageIndex === 1) {
        status = "completed";
        completion_percentage = 100;
      } else if (stageIndex === 2) {
        status = "in_progress";
        completion_percentage = 60;
      } else {
        status = "not_started";
        completion_percentage = 0;
      }
    } else {
      // Step 3+: All stages not started
      status = "not_started";
      completion_percentage = 0;
    }
    
    // Add enhanced data based on stage type and content
    const enhancedStage: PlaybookStage = {
      ...stage,
      status,
      completion_percentage,
      tool: getEnhancedTool(stage, stageIndex),
      prompt: getEnhancedPrompt(stage, stageIndex),
      rich_content: getRichContent(stage, stageIndex),
      inputs: getStageInputs(stage, stageIndex),
      outputs: getStageOutputs(stage, stageIndex),
      flow_position: getFlowPosition(stageIndex, stepIndex)
    };
    
    return enhancedStage;
  });
};

// Helper functions for enhanced data
const getEnhancedTool = (stage: any, stageIndex: number): ToolConfiguration | undefined => {
  if (stage.tool) {
    return {
      name: stage.tool,
      url: getToolUrl(stage.tool),
      clickable: true,
      configuration: getToolConfiguration(stage.tool, stageIndex)
    };
  }
  return undefined;
};

const getToolUrl = (toolName: string): string => {
  const toolUrls: Record<string, string> = {
    "Context7": "https://context7.ai",
    "ShardCN": "https://ui.shadcn.com",
    "Cursor": "https://cursor.sh",
    "GitHub": "https://github.com",
    "VS Code": "https://code.visualstudio.com"
  };
  return toolUrls[toolName] || `https://tools.dev/${toolName.toLowerCase()}`;
};

const getToolConfiguration = (toolName: string, stageIndex: number): any => {
  if (toolName === "Context7") {
    return {
      mcp_server: true,
      repo_url: "github.com/anthropic/claude-code",
      documentation_type: "latest"
    };
  }
  return {};
};

const getEnhancedPrompt = (stage: any, stageIndex: number): PromptTemplate | undefined => {
  if (stage.type === "ai_review" || stage.type === "llm_direct") {
    return {
      content: `Analyze and implement: ${stage.instructions}`,
      template: "analysis_implementation",
      variables: ["repo_url", "framework_type", "requirements"]
    };
  }
  return undefined;
};

const getRichContent = (stage: any, stageIndex: number): RichContent => {
  const elements: RichContentElement[] = [];
  
  // Add code examples for tool-guided stages
  if (stage.type === "tool_guided" && stage.tool) {
    elements.push({
      type: "code",
      content: `npm install ${stage.tool.toLowerCase()}`,
      language: "bash",
      title: `Install ${stage.tool}`
    });
  }
  
  // Add setup images for first stages
  if (stageIndex === 0) {
    elements.push({
      type: "image",
      url: `/assets/setup-flow-${stageIndex + 1}.png`,
      alt: `Setup flow diagram for ${stage.name}`,
      title: "Setup Flow Visualization"
    });
  }
  
  // Add documentation links
  if (stage.tool) {
    elements.push({
      type: "link",
      url: getToolUrl(stage.tool),
      content: `${stage.tool} Documentation`,
      clickable: true,
      title: `Open ${stage.tool} docs`
    });
  }
  
  return {
    type: "mixed",
    elements
  };
};

const getStageInputs = (stage: any, stageIndex: number) => {
  return {
    required: ["project_requirements", "target_framework"],
    optional: stageIndex > 0 ? ["previous_stage_output"] : []
  };
};

const getStageOutputs = (stage: any, stageIndex: number) => {
  return {
    generated: ["implementation_plan", "code_structure"],
    artifacts: [`stage_${stageIndex + 1}_output.md`, "config.json"]
  };
};

const getFlowPosition = (stageIndex: number, stepIndex: number): FlowPosition => {
  const subCards = [];
  
  if (stageIndex === 0) {
    subCards.push({
      type: "ai_output" as const,
      position: "right" as const,
      content: "AI-generated implementation plan",
      expandable: true
    });
  }
  
  if (stageIndex === 1) {
    subCards.push({
      type: "human_review" as const,
      position: "right_2" as const,
      content: "Human review and approval needed",
      expandable: false
    });
  }
  
  return {
    horizontal_index: stageIndex + 1,
    vertical_step: stepIndex + 1,
    sub_cards: subCards
  };
};

const enrichedPlaybookData = {
  ...playbookJsonData,
  workflow_layout: {
    pattern: "horizontal_vertical" as const,
    step_progression: "vertical_down" as const,
    stage_progression: "horizontal_right" as const,
    card_expansion: {
      ai_completion: "new_card_right" as const,
      review_needed: "new_card_right_offset" as const,
      details: "expand_below" as const
    }
  },
  tools_integration: {
    context7: {
      enabled: true,
      mcp_server: "context7.mcp.server",
      capabilities: ["documentation_extraction", "repo_analysis", "code_generation"]
    },
    rich_content_support: {
      types: ["image", "video", "audio", "code", "markdown", "link"],
      interactive: true,
      clickable_links: true
    }
  },
  playbook: {
    ...playbookJsonData.playbook,
    steps: playbookJsonData.playbook.steps.map((step, index) => ({
      ...step,
      status: index === 0 ? "completed" : index === 1 ? "in_progress" : "not_started",
      completion_percentage: index === 0 ? 100 : index === 1 ? 65 : 0,
      execution_pattern: step.execution.type,
      flow: {
        direction: "horizontal_then_vertical" as const,
        sub_flows: [
          {
            type: "ai_agent" as const,
            opens: "right" as const,
            triggers: ["documentation_analysis", "code_generation"],
            expandable: true
          },
          {
            type: "human_review" as const,
            opens: "right_secondary" as const,
            depends_on: "ai_agent",
            expandable: false
          },
          {
            type: "detailed_config" as const,
            opens: "below" as const,
            expandable: true
          }
        ]
      },
      execution: {
        ...step.execution,
        stages: addStageStatus(step.execution.stages, index)
      }
    }))
  }
};

export const playbookData: PlaybookData = enrichedPlaybookData as PlaybookData;

// Create initial cards for canvas workflow - focus on steps as main cards
export const createPlaybookCards = (): PlaybookCard[] => {
  const cards: PlaybookCard[] = [];
  
  // Add all playbook steps as the main cards
  playbookData.playbook.steps.forEach((step, index) => {
    cards.push({
      id: `step-${step.id}`,
      type: "step",
      data: step,
      position: { x: 50 + (index * 450), y: 100 },
      connections: [],
      focusLevel: "ambient"
    });
  });
  
  return cards;
};

// Get project header information
export const getProjectHeader = () => {
  return {
    project: playbookData.project,
    totalSteps: playbookData.playbook.steps.length,
    completedSteps: playbookData.playbook.steps.filter(step => step.status === "completed").length,
    estimatedDuration: playbookData.playbook.steps.reduce((total, step) => total + step.estimated_minutes, 0),
    generatedFrom: playbookData.playbook.generated_from_contexts.length,
    createdAt: playbookData.playbook.created_at
  };
};

// Helper functions
export const getInsightTypeColor = (type: string): string => {
  switch (type) {
    case "risk_blocker": return "bg-red-50 text-red-700 border-red-100";
    case "create_task": return "bg-blue-50 text-blue-700 border-blue-100";
    case "mark_decision": return "bg-green-50 text-green-700 border-green-100";
    case "dependency": return "bg-orange-50 text-orange-700 border-orange-100";
    case "commitment": return "bg-purple-50 text-purple-700 border-purple-100";
    case "open_question": return "bg-yellow-50 text-yellow-700 border-yellow-100";
    default: return "bg-gray-50 text-gray-700 border-gray-100";
  }
};

export const getExecutionTypeColor = (type: string): string => {
  switch (type) {
    case "manual": return "bg-orange-100 text-orange-700 border-orange-200";
    case "tool_guided": return "bg-blue-100 text-blue-700 border-blue-200";
    case "ai_review": return "bg-purple-100 text-purple-700 border-purple-200";
    case "llm_direct": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "hybrid": return "bg-indigo-100 text-indigo-700 border-indigo-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
};

export const getStatusColor = (status: "not_started" | "in_progress" | "completed"): string => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-700 border-green-200";
    case "in_progress": return "bg-blue-100 text-blue-700 border-blue-200";
    case "not_started": return "bg-gray-100 text-gray-600 border-gray-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

export const getStatusIcon = (status: "not_started" | "in_progress" | "completed"): string => {
  switch (status) {
    case "completed": return "✅";
    case "in_progress": return "🔄";
    case "not_started": return "⏳";
    default: return "⏳";
  }
};

export const getStatusLabel = (status: "not_started" | "in_progress" | "completed"): string => {
  switch (status) {
    case "completed": return "Completed";
    case "in_progress": return "In Progress";
    case "not_started": return "Not Started";
    default: return "Unknown";
  }
};

