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
    migration_type?: string;
    source_stack?: string[];
    target_stack?: string[];
    ai_tools_stack?: string[];
    codebase_metrics?: {
      total_components: number;
      lines_of_code: number;
      test_coverage: string;
      technical_debt_hours: number;
    };
    expected_benefits?: string;
    feature_type?: string;
    integrations?: string[];
    tech_stack?: string[];
    target_users?: string;
    expected_impact?: string;
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
  context?: {
    required: string[];
    optional?: string[];
    assumptions?: string[];
  };
  outcome_expected?: {
    generated: string[];
    artifacts?: string[];
  };
  ai_prompts?: {
    analysis_prompt?: string;
    scanning_prompt?: string;
  };
  ai_completion_badge?: {
    type: string;
    icon: string;
    text: string;
    color: string;
    animation?: string;
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
  ai_automation?: {
    level: "fully_automated" | "ai_assisted" | "ai_enhanced";
    human_interaction: "none" | "minimal" | "moderate" | "significant";
    message: string;
  };
  ai_completion_indicator?: {
    type: string;
    visual_cue: string;
    message: string;
    confidence: number;
    auto_proceed: boolean;
  };
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
      context: getStageContext(stage, stageIndex),
      outcome_expected: getStageOutcomeExpected(stage, stageIndex),
      flow_position: getFlowPosition(stageIndex, stepIndex),
      ai_prompts: getAIPrompts(stage, stageIndex),
      ai_completion_badge: getAICompletionBadge(stage, stageIndex)
    };
    
    return enhancedStage;
  });
};

// Helper functions for enhanced data
const getEnhancedTool = (stage: any, stageIndex: number): ToolConfiguration | undefined => {
  if (stage.tool) {
    // Handle both string and object tool definitions
    if (typeof stage.tool === 'string') {
      return {
        name: stage.tool,
        url: getToolUrl(stage.tool),
        clickable: true,
        configuration: getToolConfiguration(stage.tool, stageIndex)
      };
    } else if (typeof stage.tool === 'object' && stage.tool.name) {
      // Tool is already an object, return it with any missing defaults
      return {
        ...stage.tool,
        url: stage.tool.url || getToolUrl(stage.tool.name),
        clickable: stage.tool.clickable !== undefined ? stage.tool.clickable : true,
        configuration: stage.tool.configuration || getToolConfiguration(stage.tool.name, stageIndex)
      };
    }
  }
  return undefined;
};

const getToolUrl = (toolName: string): string => {
  const toolUrls: Record<string, string> = {
    "Context7": "https://context7.ai",
    "ShardCN": "https://ui.shadcn.com",
    "Cursor": "https://cursor.sh",
    "GitHub": "https://github.com",
    "VS Code": "https://code.visualstudio.com",
    "CodeQL + SonarQube": "https://github.com/github/codeql",
    "npm audit + Snyk": "https://snyk.io",
    "create-next-app": "https://nextjs.org/docs/app/api-reference/create-next-app",
    "GitHub Actions": "https://github.com/features/actions",
    "ESLint + Prettier": "https://eslint.org",
    "Retool/Grafana": "https://grafana.com",
    "Vercel Analytics + Sentry": "https://vercel.com/analytics",
    "Prisma": "https://www.prisma.io",
    "ast-grep + jscodeshift": "https://ast-grep.github.io",
    "Cursor IDE + Copilot": "https://cursor.sh",
    "i18next-parser": "https://github.com/i18next/i18next-parser",
    "Crowdin": "https://crowdin.com",
    "Vitest + Playwright": "https://vitest.dev",
    "Lighthouse CI": "https://github.com/GoogleChrome/lighthouse-ci",
    "Vercel": "https://vercel.com",
    "LaunchDarkly": "https://launchdarkly.com"
  };
  return toolUrls[toolName] || `https://tools.dev/${toolName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
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
  
  // Get tool name safely
  const getToolName = (tool: any): string | null => {
    if (typeof tool === 'string') return tool;
    if (typeof tool === 'object' && tool.name) return tool.name;
    return null;
  };
  
  const toolName = getToolName(stage.tool);
  
  // Add code examples for tool-guided stages
  if (stage.type === "tool_guided" && toolName) {
    elements.push({
      type: "code",
      content: `npm install ${toolName.toLowerCase()}`,
      language: "bash",
      title: `Install ${toolName}`
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
  if (toolName) {
    elements.push({
      type: "link",
      url: getToolUrl(toolName),
      content: `${toolName} Documentation`,
      clickable: true,
      title: `Open ${toolName} docs`
    });
  }
  
  return {
    type: "mixed",
    elements
  };
};

const getStageContext = (stage: any, stageIndex: number) => {
  // Return more specific inputs based on stage content
  const stageSpecificInputs: Record<string, string[]> = {
    "Automated codebase scanning": [
      "Legacy React 14 source code repository",
      "Package.json with all dependencies", 
      "Existing build configuration files"
    ],
    "Dependency analysis and mapping": [
      "Security scan results from previous stage",
      "Complete dependency tree",
      "Current package versions list"
    ],
    "Architecture documentation with AI": [
      "Codebase structure analysis",
      "Component hierarchy mapping",
      "API endpoint documentation"
    ],
    "Initialize Next.js 15 with TypeScript": [
      "Project requirements specification",
      "Target architecture decisions",
      "Team development preferences"
    ],
    "Configure AI-powered development tools": [
      "Team IDE preferences",
      "Existing development workflow",
      "Code quality standards"
    ],
    "Migrate authentication to NextAuth.js": [
      "Current authentication implementation",
      "User database schema",
      "Session management requirements"
    ]
  };

  return {
    required: stageSpecificInputs[stage.name] || [
      "Requirements from previous stage",
      "Technical specifications",
      "Team approval and sign-off"
    ],
    optional: stageIndex > 0 ? ["Previous stage deliverables", "Team feedback"] : []
  };
};

const getStageOutcomeExpected = (stage: any, stageIndex: number) => {
  // Return comprehensive outputs based on stage content
  const stageSpecificOutputs: Record<string, string[]> = {
    "Automated codebase scanning": [
      "Security vulnerability report (147 critical issues identified)",
      "Technical debt assessment with severity levels", 
      "Code quality metrics and complexity analysis",
      "Dependency audit with upgrade recommendations"
    ],
    "Dependency analysis and mapping": [
      "Complete migration roadmap for 89 outdated packages",
      "Breaking changes documentation for major upgrades",
      "Alternative package recommendations (Redux → Zustand)",
      "Timeline and effort estimation for each dependency"
    ],
    "Architecture documentation with AI": [
      "Comprehensive component hierarchy diagram",
      "Data flow documentation with state management patterns",
      "API integration points and authentication flows",
      "Migration complexity matrix (450 components categorized)"
    ],
    "Create migration roadmap": [
      "Detailed 26-week migration timeline",
      "Component complexity categorization (Simple: 200, Medium: 180, Complex: 70)",
      "Risk assessment with mitigation strategies",
      "Resource allocation and team assignment plan"
    ],
    "Setup migration tracking dashboard": [
      "Real-time progress dashboard with migration metrics",
      "Automated reporting for component completion rates",
      "Performance benchmarking tools integration",
      "Team velocity tracking and bottleneck identification"
    ],
    "Initialize Next.js 15 with TypeScript": [
      "Fully configured Next.js 15 project with App Router",
      "TypeScript strict mode configuration",
      "Tailwind CSS integration with custom design tokens",
      "Project structure following best practices"
    ],
    "Configure AI-powered development tools": [
      "GitHub Copilot integration with team settings",
      "Cursor IDE configuration for React migration patterns",
      "AI prompt templates for component conversion",
      "Automated code review workflows"
    ],
    "Setup CI/CD with GitHub Actions": [
      "Automated testing pipeline with quality gates",
      "Build and deployment workflow for staging/production",
      "Performance monitoring integration",
      "Security scanning in CI/CD pipeline"
    ],
    "Migrate authentication to NextAuth.js": [
      "NextAuth.js configuration with multiple providers",
      "User session migration strategy preserving existing sessions",
      "Security enhancements with JWT and OAuth integration",
      "Backward compatibility layer for legacy auth"
    ],
    "Setup Prisma ORM with PostgreSQL": [
      "Complete database schema migration from MongoDB",
      "Data migration scripts with integrity validation",
      "Prisma client configuration with type safety",
      "Database connection pooling and optimization"
    ],
    "Extract hardcoded strings": [
      "15,000+ strings extracted into organized translation files",
      "Namespace structure for component-based translations",
      "Context preservation for accurate AI translation",
      "Duplicate detection and consolidation report"
    ],
    "AI-powered translation": [
      "Professional translations for 12 languages",
      "Context-aware translations maintaining UI tone",
      "Cultural adaptation for target markets",
      "Quality assurance report with confidence scores"
    ]
  };

  return {
    generated: stageSpecificOutputs[stage.name] || [
      "Stage completion report with quality metrics",
      "Implementation documentation and best practices",
      "Code artifacts ready for next development phase",
      "Validation results and testing outcomes"
    ],
    artifacts: getStageArtifacts(stage.name, stageIndex)
  };
};

const getStageArtifacts = (stageName: string, stageIndex: number): string[] => {
  const stageArtifacts: Record<string, string[]> = {
    "Automated codebase scanning": [
      "security-vulnerability-report.json",
      "technical-debt-analysis.pdf", 
      "code-quality-metrics.xlsx"
    ],
    "Architecture documentation with AI": [
      "component-hierarchy-diagram.svg",
      "data-flow-documentation.md",
      "migration-complexity-matrix.xlsx"
    ],
    "Initialize Next.js 15 with TypeScript": [
      "next.config.js",
      "tsconfig.json",
      "tailwind.config.js",
      "package.json"
    ],
    "Setup CI/CD with GitHub Actions": [
      ".github/workflows/ci-cd.yml",
      "deployment-scripts/",
      "quality-gates-config.json"
    ],
    "AI-powered translation": [
      "locales/en/common.json",
      "locales/es/common.json", 
      "locales/fr/common.json",
      "translation-quality-report.pdf"
    ]
  };

  return stageArtifacts[stageName] || [
    `${stageName.toLowerCase().replace(/\s+/g, '-')}-output.md`,
    "implementation-guide.pdf",
    "validation-checklist.json"
  ];
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

const getAIPrompts = (stage: any, stageIndex: number) => {
  // Return existing ai_prompts if they exist (from the JSON file)
  if (stage.ai_prompts && Object.keys(stage.ai_prompts).length > 0) {
    return stage.ai_prompts;
  }
  
  // Only generate fallback prompts if no ai_prompts exist and stage is AI-driven
  if (stage.type === "ai_review" || stage.type === "llm_direct") {
    return {
      analysis_prompt: `Analyze and implement: ${stage.instructions}`,
      scanning_prompt: `Execute comprehensive analysis for: ${stage.name}`
    };
  }
  return undefined;
};

const getAICompletionBadge = (stage: any, stageIndex: number) => {
  if (stage.type === "llm_direct") {
    return {
      type: "autonomous_success",
      icon: "🤖",
      text: "AI COMPLETED",
      color: "success",
      animation: "celebration"
    };
  }
  return undefined;
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

export const playbookData: any = enrichedPlaybookData;

// Get card width based on expansion state - optimized for three-panel system
export const getCardWidth = (cardId: string, expandedInsights?: string | null, expandedStageDetails?: string | null): number => {
  const baseWidth = 480; // Step card section (optimized)
  const insightsWidth = 520; // Execution Stages panel (optimized)
  const stageDetailsWidth = 480; // Stage details panel (optimized)
  
  let totalWidth = baseWidth;
  
  // Add insights panel width if insights are expanded
  if (expandedInsights === cardId) {
    totalWidth += insightsWidth;
  }
  
  // Add stage details panel width if stage details are expanded
  if (expandedStageDetails) {
    totalWidth += stageDetailsWidth;
  }
  
  return totalWidth;
};

// Create initial cards for canvas workflow - focus on steps as main cards
export const createPlaybookCards = (): PlaybookCard[] => {
  const cards: PlaybookCard[] = [];
  
  // Add all playbook steps as the main cards - positioned vertically
  playbookData.playbook.steps.forEach((step: any, index: number) => {
    cards.push({
      id: `step-${step.id}`,
      type: "step",
      data: step,
      position: { x: 50, y: 100 + (index * 400) }, // Vertical positioning
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
    completedSteps: playbookData.playbook.steps.filter((step: any) => step.status === "completed").length,
    estimatedDuration: playbookData.playbook.steps.reduce((total: number, step: any) => total + step.estimated_minutes, 0),
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

