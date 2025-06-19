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
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  execution: {
    type: "hybrid" | "manual" | "tool_guided" | "ai_review" | "llm_direct";
    stages: Array<{
      stage: number;
      name: string;
      type: "manual" | "tool_guided" | "ai_review" | "llm_direct";
      tool?: string;
      instructions: string;
      estimated_minutes: number;
      status: "not_started" | "in_progress" | "completed";
      completion_percentage: number;
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

// Add mock status data to steps and stages for demonstration
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
    
    return {
      ...stage,
      status,
      completion_percentage
    };
  });
};

const enrichedPlaybookData = {
  ...playbookJsonData,
  playbook: {
    ...playbookJsonData.playbook,
    steps: playbookJsonData.playbook.steps.map((step, index) => ({
      ...step,
      status: index === 0 ? "completed" : index === 1 ? "in_progress" : "not_started",
      completion_percentage: index === 0 ? 100 : index === 1 ? 65 : 0,
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

