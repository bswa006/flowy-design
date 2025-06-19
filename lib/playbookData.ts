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

export interface PlaybookStep {
  id: string;
  title: string;
  description: string;
  estimated_minutes: number;
  execution: {
    type: "hybrid" | "manual" | "tool_guided" | "ai_review" | "llm_direct";
    stages: Array<{
      stage: number;
      name: string;
      type: "manual" | "tool_guided" | "ai_review" | "llm_direct";
      tool?: string;
      instructions: string;
      estimated_minutes: number;
    }>;
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

export const playbookData: PlaybookData = playbookJsonData as PlaybookData;

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
    completedSteps: 0, // This could be dynamic based on step status
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
    case "manual": return "bg-gray-50 text-gray-700";
    case "tool_guided": return "bg-gray-50 text-gray-700";
    case "ai_review": return "bg-gray-50 text-gray-700";
    case "llm_direct": return "bg-gray-50 text-gray-700";
    case "hybrid": return "bg-gray-50 text-gray-700";
    default: return "bg-gray-50 text-gray-700";
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

